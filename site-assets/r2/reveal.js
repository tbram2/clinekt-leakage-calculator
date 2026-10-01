/* Clinekt scroll reveals. Built by webflow-push/r2/make_webflow.py from reveal_js in make_home.py; edit there. */
(function(){
  var shot=new URLSearchParams(location.search).has('shot'), io='IntersectionObserver' in window;
  function watch(sel,cls,opt){ [].slice.call(document.querySelectorAll(sel)).forEach(function(el){ if(shot||!io){ el.classList.add(cls); return; }
    var o=new IntersectionObserver(function(es){ if(es.some(function(e){return e.isIntersecting})){ el.classList.add(cls); o.disconnect(); } },opt); o.observe(el); }); }
  watch('.rv','seen',{threshold:.35,rootMargin:'0px 0px -8% 0px'});
  watch('.reveal','in',{threshold:.25});
})();
