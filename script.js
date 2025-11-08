// Active tab highlight
(function(){
  const map = {
    'index.html':'home',
    'projects.html':'projects',
    'events.html':'events',
    'skills.html' : 'skills',
    'resume.html':'resume',
    'videos.html':'videos'
  };
  const path = location.pathname.split('/').pop() || 'index.html';
  const current = map[path] || 'home';
  document.querySelectorAll('.nav a[data-tab]').forEach(a => {
    if(a.dataset.tab === current) a.classList.add('active');
  });
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();

// Data
const PROJECTS = [
  {title:"EcoSorter", blurb:"AI‑assisted waste sorting bin with servo‑controlled compartments.", tags:["embedded","ai"], link:"#", image:"assets/Eco/ProjectEco1.png"},
  {title:"Mirror Cap", blurb:"Assistive smart glasses: ultrasonic, LDR, haptics, and buzzer feedback.", tags:["embedded"], link:"#", image:"assets/Mirror/ProjectMirror1.jpg"},
  {title:"Chess Arm", blurb:"Arduino robot arm that detects nearest object and moves pieces.", tags:["robotics","embedded"], link:"#", image:"assets/Game/ProjectGame3.jpg"},
  {title:"Apps4Apps", blurb:"Android app aggregator with Firebase login and nav fragments.", tags:["android"], link:"#", image:"assets/App/ProjectApp.jpg"},
  {title:"Traffic Light FSM", blurb:"Verilog/VHDL traffic light controller on FPGA dev board.", tags:["embedded"], link:"#", image:""},
  {title:"Gen3 Kinematics", blurb:"MATLAB DH model & forward kinematics for Kinova Gen3.", tags:["robotics"], link:"#", image:"assets/Robotics/ProjectRobotic.png"}
];

const EVENTS = [
  {date:"2025-11-10", title:"Leonard Community Meeting", where:"Residence Hall", note:"Motivation wall build"},
  {date:"2025-11-12", title:"Meet & Munch", where:"Leonard Hall", note:"Upper‑year panel for first‑years"},
  {date:"2025-11-17", title:"Movie Night", where:"Leonard Hall", note:"Rescheduled"},
  {date:"2025-10-29", title:"TA Application — CEG3156", where:"uOttawa", note:"Cover letter submitted"},
  {date:"2025-09-26", title:"CEG 3155 Lab", where:"Campus Lab", note:"Atomic modules — structural VHDL"}
];



const RESUME_HIGHLIGHTS = [
  {title:"uOttawa — Computer Engineering (BASc)", detail:"4th year • Systems, Embedded, Robotics"},
  {title:"Projects", detail:"EcoSorter, Mirror Cap, Chess Arm, Apps4Apps, Gen3 Kinematics"},
  {title:"Tech", detail:"C/C++, Python, Java, VHDL, SystemVerilog, MATLAB, Arduino, Android"},
  {title:"Awards", detail:"Crunch Competition • Ross FBGA • Ontario Honour Roll"}
];

// Projects page
// Projects page
(function(){
  const grid = document.getElementById('projectGrid');
  if(!grid) return;

  function render(filter='all'){
    grid.innerHTML = '';
    const list = PROJECTS.filter(p => filter === 'all' || p.tags.includes(filter));

    for (const p of list) {
      const el = document.createElement('article');
      el.className = 'card project';

      // Media block with <img> if provided
      const mediaHTML = (p.image && p.image.trim() !== '')
        ? `<img class="project-img"
                 src="${p.image}"
                 alt="${p.title}"
                 loading="lazy"
                 decoding="async"
                 onerror="this.closest('.media').style.display='none'">`
        : '';

      el.innerHTML = `
        <div class="media">${mediaHTML}</div>
        <div class="body" style="padding:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <h3 style="margin:0">${p.title}</h3>
            <div>${p.tags.map(t => `<span class='tag'>${t}</span>`).join('')}</div>
          </div>
          <p class="muted" style="margin:8px 0 12px">${p.blurb}</p>
          <a class="btn" href="${p.link}" target="_blank" rel="noopener">View</a>
        </div>
      `;
      grid.appendChild(el);
    }
  }

  render('all');
  document.querySelectorAll('[data-filter]').forEach(b =>
    b.addEventListener('click', () => render(b.dataset.filter))
  );
})();


// Events page
(function(){
  const tl = document.getElementById('timeline');
  if(!tl) return;
  function render(mode='all'){
    tl.innerHTML='';
    const today = new Date().toISOString().slice(0,10);
    const items = EVENTS.slice().sort((a,b)=> a.date.localeCompare(b.date)).filter(ev => mode==='all' || (mode==='upcoming' ? ev.date >= today : ev.date < today));
    for(const ev of items){
      const el = document.createElement('div');
      el.className = 'event';
      el.innerHTML = `<div class="when">${ev.date} • ${ev.where}</div><div style="font-weight:700">${ev.title}</div><div class="muted">${ev.note||''}</div>`;
      tl.appendChild(el);
    }
  }
  render('all');
  const $ = sel => document.querySelector(sel);
  $('#showAll')?.addEventListener('click',()=>render('all'));
  $('#showUpcoming')?.addEventListener('click',()=>render('upcoming'));
  $('#showPast')?.addEventListener('click',()=>render('past'));
})();

// Resume page
(function(){
  const list = document.getElementById('resumeList');
  if(!list) return;
  list.innerHTML = '';
  for(const r of RESUME_HIGHLIGHTS){
    const el = document.createElement('div');
    el.className = 'resume-item';
    el.innerHTML = `<div class="title" style="font-weight:800">${r.title}</div><div class="muted">${r.detail}</div>`;
    list.appendChild(el);
  }
})();

// YouTube updater on videos page
(function(){
  const input = document.getElementById('ytInput');
  const frame = document.getElementById('ytFrame');
  const btn = document.getElementById('ytUpdate');
  if(!btn || !frame) return;
  function parseYouTubeId(val){
    try{
      if(!val) return null;
      const s = val.trim();
      if(/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
      const u = new URL(s);
      if(u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      if(u.searchParams.get('v')) return u.searchParams.get('v');
    }catch(e){}
    return null;
  }
  btn.addEventListener('click',()=>{
    const id = parseYouTubeId(input.value);
    if(id) frame.src = `https://www.youtube.com/embed/${id}`;
    else alert('Please paste a valid YouTube link or 11‑character video ID.');
  });
})();
