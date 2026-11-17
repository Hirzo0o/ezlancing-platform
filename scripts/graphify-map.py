"""Build a local, structural Graphify map; never calls an LLM or changes app dependencies."""
import argparse
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import subprocess
import sys

VERSION = '0.9.112'
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'graphify-out'
EXCLUDED_DIRS = {'.git', '.agents', 'node_modules', '.next', 'dist', 'build', 'coverage', '.venv', 'graphify-out', '__pycache__'}
EXCLUDED_NAMES = {'package-lock.json', 'pnpm-lock.yaml', 'release-notes.json', 'seed.json', 'GRAPHIFY.md', 'graphify-map.py'}
SUFFIXES = {'.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.sql', '.md', '.json', '.yaml', '.yml', '.sh', '.prisma', '.html'}

def sources():
    # Only tracked files: never index local credentials or untracked customer data.
    result = subprocess.run(['git', 'ls-files', '-z'], cwd=ROOT, check=True, capture_output=True)
    paths = [ROOT / p for p in result.stdout.decode().split('\0') if p]
    return sorted(p for p in paths if p.is_file() and p.suffix in SUFFIXES
                  and not (set(p.relative_to(ROOT).parts) & EXCLUDED_DIRS)
                  and p.name not in EXCLUDED_NAMES and not p.name.startswith('.env'))

def inventory(paths):
    return {p.relative_to(ROOT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='fail if tracked sources differ from the map')
    parser.add_argument('--source-commit', help='audited baseline commit (defaults to current HEAD)')
    args = parser.parse_args()
    paths = sources()
    hashes = inventory(paths)
    if args.check:
        previous = json.loads((OUT / 'coverage.json').read_text())['sha256']
        changed = sorted(p for p in previous.keys() | hashes.keys() if previous.get(p) != hashes.get(p))
        print('STALE: ' + ', '.join(changed) if changed else 'PASS: map matches all eligible tracked sources')
        return bool(changed)
    if importlib.metadata.version('graphifyy') != VERSION:
        raise SystemExit('Use graphifyy[sql]==' + VERSION + ' in an isolated Python environment.')
    os.environ['GRAPHIFY_BACKEND'] = 'none'
    os.environ['GRAPHIFY_QUERY_LOG_DISABLE'] = '1'
    from graphify.extract import extract, _DISPATCH
    from graphify.build import build
    from graphify.cluster import cluster, score_all
    from graphify.export import to_json
    supported = [p for p in paths if p.suffix in _DISPATCH]
    result = extract(supported, root=ROOT, cache_root=ROOT, parallel=False)
    represented = {n.get('source_file') for n in result['nodes']}
    file_only = []
    for p in paths:
        rel = p.relative_to(ROOT).as_posix()
        if rel not in represented:
            # HTML, Prisma and symbol-free files remain discoverable as file nodes.
            # This is an inventory fallback, not semantic or embedded-script parsing.
            file_only.append(rel)
            result['nodes'].append({'id': 'inventory:' + rel, 'label': rel, 'type': 'file',
                                    'source_file': rel, 'source_location': 'L1', '_origin': 'ast'})
    graph = build([result], directed=True, root=ROOT)
    communities = cluster(graph)
    score_all(graph, communities)
    OUT.mkdir(exist_ok=True)
    to_json(graph, communities, str(OUT / 'graph.json'), force=True)
    coverage = {'tool': 'graphifyy[sql]==' + VERSION, 'mode': 'local structural extraction; no semantic LLM pass',
                'baseline_commit': args.source_commit or subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
                'scope': 'main baseline plus mapping guidance changes; unmerged feature branches excluded',
                'nodes': graph.number_of_nodes(), 'edges': graph.number_of_edges(),
                'file_only': file_only, 'sha256': hashes,
                'limitations': ['Markdown headings, links and code mentions are structural, not semantic understanding.',
                                'HTML inline scripts and Prisma fields are not parsed; file inventory only.',
                                'Binary assets, lockfiles, seed/release data, vendor skills and untracked files excluded.',
                                'Static call/import resolution can be incomplete; verify source before changes.']}
    (OUT / 'coverage.json').write_text(json.dumps(coverage, indent=2) + '\n')
    subprocess.run([sys.executable, '-m', 'graphify', 'cluster-only', str(ROOT), '--no-label'], check=True, env=os.environ)
    print(json.dumps({k: coverage[k] for k in ('nodes', 'edges', 'baseline_commit')}))
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
