const nav=document.getElementById('nav');


let ticking=false;
function onScroll(){
  const y=window.scrollY;
  nav.classList.toggle('solid',y>40);
  updateStage();

  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onScroll);ticking=true;}},{passive:true});
window.addEventListener('resize',onScroll);

const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
const rio=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target);}});},{threshold:.3,rootMargin:'0px 0px -10% 0px'});
document.querySelectorAll('.reveal').forEach(el=>(el.matches('.secint-vis,.cta')?rio:io).observe(el));

function animateCount(el){
  const t=parseFloat(el.dataset.count),suf=el.dataset.suffix||'',pre=el.dataset.prefix||'',comma=el.dataset.comma==='1';
  function fmt(n){return comma?Math.round(n).toLocaleString():Math.round(n);}
  if(reduce){el.textContent=pre+fmt(t)+suf;return;}
  const dur=1600,st=performance.now();
  function step(n){const p=Math.min(Math.max((n-st)/dur,0),1),e=1-Math.pow(1-p,3);el.textContent=pre+fmt(t*e)+suf;if(p<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
const co=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){const d=reduce?0:(parseInt(e.target.dataset.delay,10)||0);d?setTimeout(()=>animateCount(e.target),d):animateCount(e.target);co.unobserve(e.target);}});},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>{if(!el.closest('.offer')&&!el.closest('.band-card'))co.observe(el);});
const logos=[
  ["https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@247ca24/site-assets/media/logos/orthoalabama-mark.svg","OrthoAlabama","tall"],
  ["https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@2a145b4/site-assets/media/logos/ventura.png","Ventura Orthopedics",""],
  ["https://cdn.prod.website-files.com/698f93a6f3fe10ac9229e2b4/6990e9f98111544b1023cac8_AssortHealthLogo.svg","Assort Health",""],
  ["https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@2a145b4/site-assets/media/logos/highfive.png","HighFive Healthcare",""],
  ["https://cdn.prod.website-files.com/698f93a7f3fe10ac9229e523/6992612b90cf6ffecba56289_Final%20Logo%201.925%20(1).svg","Baldwin Bone and Joint",""],
  ["https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@2a145b4/site-assets/media/logos/mobile.png","Mobile Oral and Facial Surgery",""],
  ["https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@2a145b4/site-assets/media/logos/athelas.png","Athelas",""],
  ["https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@2a145b4/site-assets/media/logos/paradigm.png","Paradigm Health System",""],
  ["https://cdn.prod.website-files.com/698f93a6f3fe10ac9229e2b4/699333fae8d78ec1c0b80cb9_Final%20Logo%201.925%20(3000%20x%201000%20px)%20(4).svg","Bramlett Orthopedic Clinic",""],
  ["https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@2a145b4/site-assets/media/logos/northeast.png","Northeast Orthopedic Sports Clinic and Physical Therapy",""]
];
window.addEventListener('load',function(){setTimeout(function(){var v=document.querySelector('.hero-video video');if(v){v.play().catch(function(){});}},200);});
const _nt=document.getElementById('navTgl');if(_nt){document.querySelectorAll('.nav-m a').forEach(a=>a.addEventListener('click',()=>{_nt.checked=false;}));}
const mq=document.getElementById('marquee');
// Two loop units ship inline in the embed so the logo row paints with the page (no
// blank-then-pop layout shift on mobile). Extend to four units here so each -50%
// animation half spans ultra-wide screens; skip entirely if already extended.
const unit=[...logos];
if(mq&&mq.childElementCount<=unit.length*2){
  let mhtml='';for(let r=0;r<2;r++){unit.forEach(([s,a])=>{mhtml+=`<img src="${s}" alt="${a}" decoding="async" loading="lazy">`;});}
  mq.insertAdjacentHTML('beforeend',mhtml);
}
/* Pinned offerings stage — one card whose contents rotate as you scroll; tabs + progress give continuous feedback */
const stageEl=document.getElementById('stageScroll');
const offers=Array.prototype.slice.call(document.querySelectorAll('.offer'));
const stabs=Array.prototype.slice.call(document.querySelectorAll('.st-tab'));
const sprog=document.getElementById('stageProg');
let curOffer=-1;
function setOffer(i){
  if(i===curOffer)return;curOffer=i;
  offers.forEach((o,k)=>o.classList.toggle('active',k===i));
  stabs.forEach((t,k)=>t.classList.toggle('active',k===i));
  offers[i].querySelectorAll('[data-count]').forEach((el,k)=>setTimeout(()=>animateCount(el),reduce?0:650+k*140));
}
function updateStage(){
  if(!stageEl)return;
  if(window.innerWidth<=1000){offers.forEach(o=>o.classList.add('active'));return;}
  const r=stageEl.getBoundingClientRect();
  if(r.top>window.innerHeight)return;
  const total=r.height-window.innerHeight;
  const sc=Math.min(Math.max(-r.top,0),total);
  const p=total>0?sc/total:0;
  if(sprog)sprog.style.width=(p*100)+'%';
  setOffer(Math.min(offers.length-1,Math.floor(p*offers.length)));
}
stabs.forEach((t,k)=>t.addEventListener('click',()=>{
  const r=stageEl.getBoundingClientRect();
  const total=r.height-window.innerHeight;
  window.scrollTo({top:r.top+window.scrollY+(k*total/offers.length)+2,behavior:reduce?'auto':'smooth'});
}));
/* One Brain band — inject the neural-sphere canvas (rendered by ck-brain.js, loaded
   from the home page footer custom code). Decorative, so JS injection keeps the
   embed under Webflow's 50K cap. */
(function(){
  var band=document.querySelector('.brainband');
  if(!band||band.querySelector('.ckbrain'))return;
  var st=document.createElement('div');
  st.className='bb-stage';
  st.innerHTML='<canvas class="ckbrain" data-labels="off"></canvas>'+
    '<div class="bnode bn1"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M16.5 6L9.5 13"/><path d="M9.5 8.5V13h4.5"/></svg><b>Inbound Agent</b><span>Captures and books new patients the moment they arrive.</span></div>'+
    '<div class="bnode bn2"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><circle cx="12" cy="12" r="1"/></svg><b>Recall Agent</b><span>Knows who is overdue and how they like to be reached.</span></div>'+
    '<div class="bnode bn3"><svg viewBox="0 0 24 24"><path d="M3 17L9.5 10.5l4 4L21 7"/><path d="M14.5 7H21v6.5"/></svg><b>Outbound Agent</b><span>Ties every campaign to the patients it produced.</span></div>'+
    '<div class="bnode bn4"><svg viewBox="0 0 24 24"><rect x="9" y="2.5" width="6" height="3.5" rx="1"/><path d="M15 4.5h2.5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H9"/><path d="M7 13.5h2l1.5-3 2.5 6 1.5-3h2.5"/></svg><b>Care Management Agent</b><span>Continues every patient&apos;s story between visits.</span></div>';
  band.appendChild(st);
  if(window.ckBrainScan)window.ckBrainScan();
})();
/* Impact band — numbers count up when the blue card scrolls into view */
const bandCard=document.querySelector('.band-card');
if(bandCard){const bo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){bandCard.querySelectorAll('[data-count]').forEach((el,k)=>setTimeout(()=>animateCount(el),reduce?0:180+k*130));bo.unobserve(bandCard);}});},{threshold:.45});bo.observe(bandCard);}
onScroll();
/* Proof — featured testimonial with customer-logo tabs (Assort style); tab click / auto-advance switches it */
(function(){
  var proof=document.querySelector('.cs-wrap'); if(!proof) return;
  var tests=[].slice.call(proof.querySelectorAll('.cs-story'));
  var tabs=[].slice.call(proof.querySelectorAll('.cs-tab'));
  var real=tests.filter(function(t){return !t.querySelector('.ph')});
  var i=0,timer;
  function show(n){i=(n+tests.length)%tests.length;tests.forEach(function(t,k){t.classList.toggle('active',k===i);});tabs.forEach(function(t,k){t.classList.toggle('active',k===i);});}
  if(real.length>1){tabs.forEach(function(t,k){t.addEventListener('click',function(){show(k);reset();});});}
  function reset(){clearInterval(timer); if(real.length<2||reduce) return; timer=setInterval(function(){show(i+1);},8000);}
  proof.addEventListener('mouseenter',function(){clearInterval(timer);});
  proof.addEventListener('mouseleave',reset);
  var vio=new IntersectionObserver(function(es){es.forEach(function(e){e.isIntersecting?reset():clearInterval(timer);});},{threshold:.4});
  vio.observe(proof);
  show(0);
})();