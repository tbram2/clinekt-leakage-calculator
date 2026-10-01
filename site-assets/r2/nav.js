/* Clinekt header menus. Built by webflow-push/r2/make_webflow.py from nav_js in make_home.py; edit there. */
(function(){
  var q=new URLSearchParams(location.search), shot=q.has('shot');
  if(shot) document.documentElement.classList.add('shot');
  var nav=document.getElementById('nav'); if(!nav) return;
  var trig=[].slice.call(nav.querySelectorAll('.nt')), panels=[].slice.call(nav.querySelectorAll('.mp')), scrim=document.getElementById('scrim');
  var burger=nav.querySelector('.burger'), open=null, tmr=null;
  var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  function place(name){ var t=nav.querySelector('.nt[data-m="'+name+'"]'), pn=nav.querySelector('.mp[data-m="'+name+'"]'); if(!t||!pn) return;
    var r=t.getBoundingClientRect(), w=pn.offsetWidth, vw=document.documentElement.clientWidth, g=Math.max(16,parseFloat(getComputedStyle(nav.querySelector('.in')).paddingLeft)||16);
    var x=Math.min(Math.max(g, r.left+r.width/2-w/2), Math.max(g, vw-g-w)); pn.style.left=Math.round(x)+'px'; pn.style.transformOrigin=Math.round(r.left+r.width/2-x)+'px 0'; }
  function show(name){ clearTimeout(tmr); open=name||null; if(open) place(open);
    trig.forEach(function(t){ var on=t.dataset.m===open; t.classList.toggle('on',on); t.setAttribute('aria-expanded',on?'true':'false'); });
    panels.forEach(function(p){ p.classList.toggle('on',p.dataset.m===open); });
  }
  function later(name,ms){ clearTimeout(tmr); tmr=setTimeout(function(){ show(name); },ms); }
  trig.forEach(function(t){
    if(fine){ t.addEventListener('mouseenter',function(){ later(t.dataset.m, open?0:90); }); }
    t.addEventListener('click',function(){ show(open===t.dataset.m&&!fine?null:t.dataset.m); });
    t.addEventListener('keydown',function(e){ if(e.key==='ArrowDown'){ e.preventDefault(); show(t.dataset.m); var a=nav.querySelector('.mp.on a'); if(a) a.focus(); } });
  });
  if(fine){
    nav.addEventListener('mouseleave',function(){ later(null,180); });
    nav.addEventListener('mouseenter',function(){ clearTimeout(tmr); });
    [].slice.call(nav.querySelectorAll('.links > a, .cta a, .brand')).forEach(function(a){ a.addEventListener('mouseenter',function(){ if(open) later(null,120); }); });
  }
  function sheet(on){ if(on) scrollTo(0,0); nav.classList.toggle('sheet',on); document.documentElement.classList.toggle('lock',on); if(burger) burger.setAttribute('aria-expanded',on?'true':'false'); }
  if(burger) burger.addEventListener('click',function(){ sheet(!nav.classList.contains('sheet')); });
  [].slice.call(nav.querySelectorAll('.msheet a')).forEach(function(a){ a.addEventListener('click',function(){ sheet(false); }); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ show(null); sheet(false); } });
  document.addEventListener('click',function(e){ if(open&&!nav.contains(e.target)) show(null); });
  addEventListener('resize',function(){ if(innerWidth>1024){ sheet(false); if(open) place(open); } else show(null); });
  if(q.get('menu')){ if(q.get('menu')==='sheet') sheet(true); else show(q.get('menu')); }
})();
