# Graphify source map

Audited baseline: `2dcf2d271cc13d6c18679e0cda0857b9abb33d69` on `main`. Unmerged PR branches are outside this map.

- Open [interactive graph](graphify-out/graph.html) after downloading or cloning this branch; GitHub displays HTML as source.
- Read [architecture report](graphify-out/GRAPH_REPORT.md).
- Inspect [coverage and source hashes](graphify-out/coverage.json), including file-only coverage and exclusions.
- Query [graph.json](graphify-out/graph.json) with the CLI below.

## Rebuild and verify

Use Python 3.12 and an isolated developer environment; no application manifests or production dependencies change.

```bash
python3 -m venv /tmp/graphify-tools
/tmp/graphify-tools/bin/pip install 'graphifyy[sql]==0.9.112'
/tmp/graphify-tools/bin/python scripts/graphify-map.py
/tmp/graphify-tools/bin/python scripts/graphify-map.py --check
/tmp/graphify-tools/bin/graphify query "README" --budget 1200
```

Windows: use a temporary venv path and its `Scripts/python.exe` and `Scripts/graphify.exe` equivalents.

Run the freshness check before relying on the graph, and rebuild after source edits, pulls or branch switches. Review generated changes before committing. A graph from another branch is not evidence for the current source.

## Coverage boundaries

This uses Graphify's deterministic parsers for code, SQL, manifests, YAML and Markdown structure. No LLM backend, account, cloud upload or telemetry is used during extraction. Markdown headings/links do not establish that planned features are implemented. HTML and Prisma are inventoried as file nodes when no structural parser is available; embedded JavaScript, Prisma fields, binary assets and image/PDF contents are not semantically mapped. Static dynamic-call resolution is incomplete. Exact indexed file hashes and file-only fallbacks are recorded in coverage.json.

The script reads only tracked eligible files, excluding generated outputs, lockfiles, seed/release data and bundled vendor skills. It rebuilds from scratch so deleted source nodes disappear. No git hooks or scheduled jobs are installed. Existing repository rules and source remain authoritative.
