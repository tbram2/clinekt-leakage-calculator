/* CK-HEC: hero email capture.
   submit -> validate -> log step-1 lead to the Webflow form store -> gtag event -> /book-a-demo?email=...
   On /book-a-demo the same file pre-fills the Work Email field from ?email=.

   Lead logging reuses the leakage calculator's form binding (see embed/clinekt-leakage-embed.js):
   Webflow only stores submissions whose Origin is a site domain and that are bound to a real
   form's pageId/elementId. Rows are told apart by fields[event] = "hero_email". */
(function(){
  var WF_FORM="https://formdata.webflow.com/api/v1/form/698f93a6f3fe10ac9229e2b4";
  var WF_PAGE_ID="698f93a7f3fe10ac9229e7fc";
  var WF_ELEMENT_ID="2537b3c8-a4ee-a1b5-f95e-dec209ce3a62";
  var RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function submitLead(email){
    try{
      var body=new URLSearchParams();
      body.append("name","clinectleakagefill");
      body.append("pageId",WF_PAGE_ID);
      body.append("elementId",WF_ELEMENT_ID);
      body.append("source",location.href);
      body.append("test","false");
      body.append("dolphin","false");
      body.append("fields[event]","hero_email");
      body.append("fields[email]",email);
      body.append("fields[page]",location.href);
      fetch(WF_FORM,{method:"POST",body:body,keepalive:true}).catch(function(){});
    }catch(err){}
  }

  function bind(f){
    var field=f.querySelector(".ck-hec-field"),inp=f.querySelector(".ck-hec-input"),
        err=f.querySelector(".ck-hec-err"),hp=f.querySelector(".ck-hec-hp");
    if(!field||!inp)return;
    inp.addEventListener("input",function(){field.classList.remove("is-bad");if(err)err.hidden=true;});
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var v=inp.value.trim();
      if(!RE.test(v)){field.classList.add("is-bad");if(err)err.hidden=false;inp.focus();return;}
      if(!(hp&&hp.value)){
        submitLead(v);
        if(window.gtag)try{gtag("event","hero_email_capture",{page_path:location.pathname});}catch(_){}
      }
      location.href="/book-a-demo?email="+encodeURIComponent(v)+"&src="+encodeURIComponent(location.pathname);
    });
  }

  function prefill(){
    var el=document.getElementById("Work-Email");
    if(!el)return;
    var v;
    try{v=new URLSearchParams(location.search).get("email");}catch(_){return;}
    if(!v||!RE.test(v)||el.value)return;
    el.value=v;
    el.dispatchEvent(new Event("input",{bubbles:true}));
    var first=document.getElementById("First-Name");
    if(first)try{first.focus({preventScroll:true});}catch(_){}
  }

  function init(){
    Array.prototype.forEach.call(document.querySelectorAll("form.ck-hec"),bind);
    prefill();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
