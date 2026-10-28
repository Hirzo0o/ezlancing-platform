'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import '../ezlancing-landing.css';
import './marketplace.css';

type Category = 'Design'|'Development'|'Writing'|'Video'|'Marketing'|'Data & AI'|'Music';
type Gig = {id:number;title:string;category:Category;price:number;seller:string;rating:number;reviews:number};
type Project = {id:number;title:string;category:Category;min:number;max:number;skills:string[];description:string;client:string;bidCount:number};
type Order = {id:number;title:string;packageName:string;amount:number;status:'Demo requested'};
type Bid = {id:number;projectId:number;title:string;amount:number;days:number;message:string};
type Account = {name:string;email:string};
type Store = {user:Account|null;orders:Order[];bids:Bid[];projects:Project[]};
const categories:Category[]=['Design','Development','Writing','Video','Marketing','Data & AI','Music'];
const glyph:Record<Category,string>={Design:'✦',Development:'⌘',Writing:'✎',Video:'▷',Marketing:'↗','Data & AI':'◎',Music:'♫'};
const examples:[string,Category,number,number,number][]=[
 ['Modern logo and brand kit','Design',25,4.9,312],
 ['React or Next.js website','Development',120,5,148],
 ['SEO blog writing','Writing',40,4.8,521],
 ['YouTube video editing','Video',35,4.9,267],
 ['Google and Meta advertising','Marketing',90,4.7,98],
 ['Custom AI chatbot','Data & AI',150,4.9,76],
 ['Podcast intro and mixing','Music',30,4.8,134],
 ['Mobile app UI in Figma','Design',110,5,203],
 ['Node.js API development','Development',60,4.9,389],
 ['Copy translation and proofreading','Writing',15,4.7,640],
 ['Explainer animation','Video',150,4.8,87],
 ['Data cleaning and visualization','Data & AI',70,4.8,112]
];
const gigs:Gig[]=examples.map(([title,category,price,rating,reviews],id)=>({id,title,category,price,rating,reviews,seller:['Amira K.','Dev P.','Lucas M.','Sofia R.','Omar H.','Chen W.','Nia T.','Jonas B.'][id%8]}));
const initialProjects:Project[]=[
 {id:1,title:'E-commerce site for handmade ceramics',category:'Development',min:800,max:1500,skills:['Shopify','UI/UX'],description:'A clean Shopify store with product catalog, blog and checkout.',client:'Studio Clay',bidCount:23},
 {id:2,title:'Coffee brand logo and packaging',category:'Design',min:300,max:600,skills:['Branding','Illustrator'],description:'Brand identity and packaging design for three coffee roasts.',client:'Bean Theory',bidCount:41},
 {id:3,title:'Fintech startup newsletter',category:'Writing',min:250,max:400,skills:['Copywriting','Finance'],description:'Weekly original newsletter for a fintech audience.',client:'Ledgerly',bidCount:17},
 {id:4,title:'Mobile game promotional video',category:'Video',min:500,max:1200,skills:['After Effects','3D'],description:'A 45-second trailer using supplied game footage.',client:'PixelNest',bidCount:12},
 {id:5,title:'Data collection and cleaning workflow',category:'Data & AI',min:150,max:300,skills:['Python','Pandas'],description:'Collect authorized data and produce a CSV with validation.',client:'Retail Radar',bidCount:35},
 {id:6,title:'Instagram growth strategy',category:'Marketing',min:200,max:500,skills:['Social Media','Reels'],description:'A month of campaign strategy and reporting.',client:'Forma Fit',bidCount:28}
];
const empty:Store={user:null,orders:[],bids:[],projects:[]};
const money=(n:number)=>'$'+n.toLocaleString('en-US');
export default function Marketplace(){
 const [ready,setReady]=useState(false);const [store,setStore]=useState<Store>(empty);
 const [view,setView]=useState<'home'|'gigs'|'projects'|'post'|'dashboard'>('home');
 const [query,setQuery]=useState('');const [cat,setCat]=useState('All');const [sort,setSort]=useState('popular');
 const [projectCat,setProjectCat]=useState('All');
 const [selectedGig,setSelectedGig]=useState<Gig|null>(null);const [selectedProject,setSelectedProject]=useState<Project|null>(null);
 const [packageName,setPackageName]=useState('Basic');const [signIn,setSignIn]=useState(false);const [notice,setNotice]=useState('');
 useEffect(()=>{
  let cancelled = false;
  // Defer browser-local hydration until after the component is committed.
  queueMicrotask(()=>{
   if(cancelled)return;
   try{
    const saved=localStorage.getItem('ezlancing-marketplace-demo-v1');
    if(saved){
     const parsed=JSON.parse(saved);
     setStore({user:parsed.user??null,orders:Array.isArray(parsed.orders)?parsed.orders:[],bids:Array.isArray(parsed.bids)?parsed.bids:[],projects:Array.isArray(parsed.projects)?parsed.projects:[]});
    }
   }catch{}
   setReady(true);
  });
  return ()=>{cancelled=true};
 },[]);
 useEffect(()=>{if(ready)localStorage.setItem('ezlancing-marketplace-demo-v1',JSON.stringify(store))},[store,ready]);
 const projects=[...store.projects,...initialProjects];
 const found=useMemo(()=>gigs.filter(g=>(cat==='All'||g.category===cat)&&[g.title,g.category,g.seller].join(' ').toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:b.reviews-a.reviews),[cat,query,sort]);
 const matches=projects.filter(p=>projectCat==='All'||p.category===projectCat);
 const goto=(next:typeof view)=>{setView(next);setSelectedGig(null);setSelectedProject(null);window.scrollTo({top:0,behavior:'smooth'})};
 const inform=(value:string)=>setNotice(value);
 const requireUser=()=>{if(store.user)return true;setSignIn(true);inform('Sign in to use this demo feature.');return false};
 const login=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();const data=new FormData(event.currentTarget);const name=String(data.get('name')||'').trim();const email=String(data.get('email')||'').trim();if(!name||!email)return;setStore(s=>({...s,user:{name,email}}));setSignIn(false);inform(selectedGig||selectedProject?'Demo sign-in complete. You can now review and submit your previous selection.':'Demo profile created on this browser only. No authentication occurred.')};
 const post=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(!requireUser())return;const data=new FormData(event.currentTarget);const min=Number(data.get('min'));const max=Number(data.get('max'));if(!Number.isFinite(min)||!Number.isFinite(max)||min<5||max<min){inform('Check your budget range.');return}const project:Project={id:Date.now(),title:String(data.get('title')).trim().slice(0,80),description:String(data.get('description')).trim(),category:String(data.get('category')) as Category,min,max,skills:String(data.get('skills')).split(',').map(x=>x.trim()).filter(Boolean),client:store.user!.name,bidCount:0};if(!project.title||!project.description)return;setStore(s=>({...s,projects:[project,...s.projects]}));inform('Demo project saved locally.');goto('projects')};
 const order=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(!selectedGig||!requireUser())return;const multipliers:Record<string,number>={Basic:1,Standard:1.8,Premium:3};const order:Order={id:Date.now(),title:selectedGig.title,packageName,amount:Math.round(selectedGig.price*multipliers[packageName]),status:'Demo requested'};setStore(s=>({...s,orders:[order,...s.orders]}));setSelectedGig(null);inform('Demo order recorded. No charge, escrow or seller notification occurred.')};
 const bid=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();if(!selectedProject||!requireUser())return;if(store.bids.some(b=>b.projectId===selectedProject.id)){inform('You already submitted a demo proposal for this project.');return}const f=new FormData(event.currentTarget);const amount=Number(f.get('amount'));const days=Number(f.get('days'));if(amount<5||days<1)return;const b:Bid={id:Date.now(),projectId:selectedProject.id,title:selectedProject.title,amount,days,message:String(f.get('message')).trim()};if(!b.message)return;setStore(s=>({...s,bids:[b,...s.bids],projects:s.projects.map(p=>p.id===b.projectId?{...p,bidCount:p.bidCount+1}:p)}));setSelectedProject(null);inform('Demo proposal saved to this browser.')};
 const listing=(g:Gig)=><button className="mp-service" key={g.id} onClick={()=>{setPackageName('Basic');setSelectedGig(g)}}><div className="mp-art">{glyph[g.category]}</div><div className="mp-card-content"><small>{g.category} · EXAMPLE</small><h3>{g.title}</h3><p>{g.seller} · ★ {g.rating} ({g.reviews} sample reviews)</p><strong>From {money(g.price)}</strong></div></button>;
 const projectCard=(p:Project)=><button className="mp-project" key={p.id} onClick={()=>setSelectedProject(p)}><div><h3>{p.title}</h3><p>{p.description}</p><div className="mp-tags">{p.skills.map(x=><span key={x}>{x}</span>)}</div></div><div className="mp-budget"><b>{money(p.min)}–{money(p.max)}</b><small>{p.bidCount} demo bids · {p.client}</small></div></button>;
 const tabs=<div className="mp-categories">{['All',...categories].map(c=><button className={cat===c?'active':''} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div>;
 return <div className="ez-page mp-page">
  <header className="ez-header"><div className="ez-container ez-nav"><Link href="/" className="mp-brand"><Image src="/brand/ezlancing-logo.png" width={44} height={52} alt="Ezlancing logo"/><span>ezlancing<span>.</span></span></Link><nav className="mp-nav" aria-label="Marketplace navigation">{(['home','gigs','projects','post','dashboard'] as const).map(v=><button key={v} className={view===v?'active':''} onClick={()=>goto(v)}>{({home:'Home',gigs:'Find Services',projects:'Browse Projects',post:'Post a Project',dashboard:'Dashboard'})[v]}</button>)}</nav><button className="ez-primary" onClick={()=>store.user?setStore(s=>({...s,user:null})):setSignIn(true)}>{store.user?'Sign Out':'Demo Sign In'}</button></div></header>
  <div className="mp-demo-strip">INTERACTIVE PROTOTYPE · Browser-local demonstration only · No real accounts, transactions, escrow or payouts</div>
  <main className="mp-main ez-container">
   {view==='home'&&<><section className="mp-hero"><h1>Find the right freelancer, or the right project.</h1><p>Explore packaged services, browse projects and try the workflows in this interactive Ezlancing demo.</p><form onSubmit={e=>{e.preventDefault();goto('gigs')}} className="mp-search"><input aria-label="Search services" placeholder="Try logo design or React developer" value={query} onChange={e=>setQuery(e.target.value)}/><button className="ez-primary">Search</button></form></section><div className="mp-section-head"><h2>Popular service examples</h2><button onClick={()=>goto('gigs')}>All services ↗</button></div><div className="mp-service-grid">{gigs.slice(0,4).map(listing)}</div><div className="mp-section-head"><h2>Latest project examples</h2><button onClick={()=>goto('projects')}>All projects ↗</button></div>{projects.slice(0,3).map(projectCard)}</>}
   {view==='gigs'&&<><div className="mp-section-head"><h1>Explore freelance services</h1><small>{found.length} examples</small></div>{tabs}<div className="mp-tools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services" aria-label="Search services"/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort services"><option value="popular">Most popular</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div><div className="mp-service-grid">{found.map(listing)}</div>{!found.length&&<div className="mp-empty">No matching services. Try another search.</div>}</>}
   {view==='projects'&&<><div className="mp-section-head"><h1>Browse projects</h1><button className="ez-primary" onClick={()=>goto('post')}>Post a Project</button></div><div className="mp-categories">{['All',...categories].map(c=><button key={c} className={projectCat===c?'active':''} onClick={()=>setProjectCat(c)}>{c}</button>)}</div>{matches.map(projectCard)}{!matches.length&&<div className="mp-empty">No projects in this category.</div>}</>}
   {view==='post'&&<><h1>Post a project</h1><p className="mp-muted">Demo only: posting creates a local record in your browser, not a public listing.</p><form className="mp-form" onSubmit={post}><label>Project title<input required maxLength={80} name="title" placeholder="Landing page for my startup"/></label><label>Category<select name="category">{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Description<textarea required minLength={20} name="description" rows={5}/></label><label>Skills (comma separated)<input name="skills" placeholder="Figma, TypeScript"/></label><div className="mp-fields"><label>Minimum budget (USD)<input type="number" name="min" min="5" defaultValue="100" required/></label><label>Maximum budget (USD)<input type="number" name="max" min="5" defaultValue="300" required/></label></div><button className="ez-primary">Save demo project</button></form></>}
   {view==='dashboard'&&<><h1>{store.user?'Welcome, '+store.user.name:'Your dashboard'}</h1>{!store.user?<div className="mp-empty">Sign in to view local demo activity. <button className="ez-primary" onClick={()=>setSignIn(true)}>Demo Sign In</button></div>:<><div className="mp-section-head"><h2>My orders</h2></div><div className="mp-table-wrap"><table><thead><tr><th>Service</th><th>Package</th><th>Value</th><th>Status</th></tr></thead><tbody>{store.orders.map(o=><tr key={o.id}><td>{o.title}</td><td>{o.packageName}</td><td>{money(o.amount)}</td><td>{o.status}</td></tr>)}</tbody></table>{!store.orders.length&&<p className="mp-muted">No demo orders yet.</p>}</div><div className="mp-section-head"><h2>My proposals</h2></div><div className="mp-table-wrap"><table><thead><tr><th>Project</th><th>Bid</th><th>Days</th></tr></thead><tbody>{store.bids.map(b=><tr key={b.id}><td>{b.title}</td><td>{money(b.amount)}</td><td>{b.days}</td></tr>)}</tbody></table>{!store.bids.length&&<p className="mp-muted">No demo proposals yet.</p>}</div><div className="mp-section-head"><h2>My projects</h2></div><div className="mp-table-wrap"><table><thead><tr><th>Project</th><th>Budget</th><th>Bids</th></tr></thead><tbody>{store.projects.map(p=><tr key={p.id}><td>{p.title}</td><td>{money(p.min)}–{money(p.max)}</td><td>{p.bidCount}</td></tr>)}</tbody></table>{!store.projects.length&&<p className="mp-muted">No demo projects yet.</p>}</div></>}</>}
  </main>
  {notice&&<div className="mp-notice" role="status">{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss">×</button></div>}
  {(selectedGig||selectedProject||signIn)&&<div className="mp-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget){setSelectedGig(null);setSelectedProject(null);setSignIn(false)}}}><section className="mp-dialog" role="dialog" aria-modal="true" aria-label={signIn?'Demo sign in':selectedGig?'Service packages':'Project proposal'}><button className="mp-close" aria-label="Close" onClick={()=>{setSelectedGig(null);setSelectedProject(null);setSignIn(false)}}>×</button>{signIn&&<><h2>Try Ezlancing</h2><p className="mp-muted">This demo stores a name and email in your browser only. It is not real authentication.</p><form className="mp-form" onSubmit={login}><label>Name<input name="name" required maxLength={80}/></label><label>Email<input name="email" type="email" required maxLength={200}/></label><button className="ez-primary">Continue in demo</button></form></>}
   {selectedGig&&!signIn&&<><div className="mp-art">{glyph[selectedGig.category]}</div><h2>{selectedGig.title}</h2><p>{selectedGig.seller} · Example service</p><form className="mp-form" onSubmit={order}><div className="mp-packages">{(['Basic','Standard','Premium'] as const).map((name,i)=><label key={name} className={packageName===name?'active':''}><input type="radio" name="package" checked={packageName===name} onChange={()=>setPackageName(name)}/><b>{name} · {money(Math.round(selectedGig!.price*[1,1.8,3][i]))}</b><small>{['1 concept · 3 days','3 concepts · 5 days','Full package · 7 days'][i]}</small></label>)}</div><button className="ez-primary">Create demo order</button></form></>}
   {selectedProject&&!signIn&&<><h2>{selectedProject.title}</h2><p>{selectedProject.description}</p><p className="mp-muted">Budget {money(selectedProject.min)}–{money(selectedProject.max)} · {selectedProject.client}</p><form className="mp-form" onSubmit={bid}><div className="mp-fields"><label>Proposal amount (USD)<input type="number" name="amount" min="5" required/></label><label>Delivery (days)<input type="number" name="days" min="1" required/></label></div><label>Your proposal<textarea rows={4} required minLength={10} name="message"/></label><button className="ez-primary">Save demo proposal</button></form></>}
  </section></div>}
  <footer className="ez-footer"><div className="ez-container mp-foot"><Link href="/">Back to Ezlancing homepage</Link><span>© 2026 Ezlancing · Interactive demo only</span></div></footer>
 </div>
}
