/* Clinekt interim chrome swap: replaces the OLD site's nav + footer with the new-design
   header/footer on legacy pages (FAQs, Blog, Case Studies, Integrations, legal), so
   visitors coming from home-v2 / book-a-demo-v2 never fall back into the old site.
   Loaded site-wide; the guard below makes it a no-op on the new embed-built pages.
   AT GO-LIVE: change HOME to '/' and DEMO to '/book-a-demo', bump ?v= in site custom code. */
(function () {
  if (document.querySelector('.ck-nav')) return;

  // Solutions menu, grouped Assort-style: use-case pages ("By use case") + the nine
  // specialty landing pages ("By specialty"). Group labels are sentence case (no all caps).
  var USECASES = [
    ['Stop patient leakage', '/patient-leakage'],
    ['Recall &amp; reactivation', '/patient-recall-reactivation'],
    ['Marketing ROI', '/marketing-roi'],
    ['Care between visits', '/care-agent']
  ];
  var SOLUTIONS = [
    ['Orthopedics', '/orthopedics'],
    ['Physical Therapy', '/physical-therapy'],
    ['Oral Surgery &amp; Dentistry', '/oral-surgery'],
    ['Dermatology', '/dermatology'],
    ['Ophthalmology', '/ophthalmology'],
    ['Urology', '/urology'],
    ['Primary Care', '/primary-care'],
    ['Cardiology', '/cardiology'],
    ['Pediatrics', '/pediatrics']
  ];
  // The platform pages — Platform dropdown: overview page + the four agent pages.
  // The Care Management Agent keeps its original /care-agent slug (published slugs never change).
  var PLATFORM = [
    ['Platform overview', '/platform'],
    ['Inbound Agent', '/inbound-agent'],
    ['Recall Agent', '/recall-agent'],
    ['Outbound Agent', '/outbound-agent'],
    ['Care Management Agent', '/care-agent']
  ];
  function links(list) { return list.map(function (s) { return '<a href="' + s[1] + '">' + s[0] + '</a>'; }).join(''); }
  var platLinks = links(PLATFORM);
  // Solutions mega-menu: featured pills across the top, then the two groups SIDE BY SIDE.
  var solLinks = '<a href="/demo-agent" style="display:block;margin:8px 8px 4px;padding:9px 14px;background:linear-gradient(145deg,#0A6FE6,#063FB0);color:#fff;font-weight:600;border-radius:10px;text-align:center">Try Our AI Agent</a>' +
    '<a href="/leakage-calculator" style="display:block;margin:4px 8px;padding:9px 14px;background:#EAF2FE;color:#0A58C4;font-weight:600;border-radius:10px;text-align:center;border:1px solid #D7E6FB">Leakage Calculator</a>' +
    '<div class="ck-sol"><div class="ck-sol-col"><div class="ck-grp">By use case</div>' + links(USECASES) + '</div>' +
    '<div class="ck-sol-col"><div class="ck-grp">By specialty</div>' + links(SOLUTIONS) + '</div></div>';
  // Group-label + side-by-side column styles for every nav variant that renders solLinks.
  (function () {
    var gs = document.createElement('style');
    gs.textContent =
      '.ck-grp{font-size:12px;font-weight:600;color:#9A9AA0;letter-spacing:.04em;padding:12px 14px 3px;white-space:nowrap}' +
      '.ck-sol{display:flex;align-items:flex-start;gap:6px}' +
      '.ck-sol-col{min-width:186px}' +
      '.ck-drop-menu .ck-sol{background:#fff;border:1px solid rgba(60,60,67,.1);border-top:0;padding:0 4px 6px}' +
      '.nav-m .ck-grp,.ck-m .ck-grp{padding:12px 0 2px}' +
      '.nav-m .ck-sol,.ck-m .ck-sol{gap:18px}' +
      '.nav-m .ck-sol-col,.ck-m .ck-sol-col{min-width:0;flex:1}' +
      'h1,h2,h3{text-wrap:balance}p,li{text-wrap:pretty}' +
      "/* Full-bleed section rhythm (match homepage): problem/proof/brain become edge-to-edge bands;   only the KPI band and CTA stay as intentional cards (2026-08-07 round 5) */#ck-sp .problem{background:var(--paper,#F3F4F7)!important;padding:clamp(48px,6vw,84px) 0!important;margin:clamp(20px,3vw,40px) 0 0!important}#ck-sp .problem .card{background:transparent!important;border:0!important;border-radius:0!important;padding:0!important;box-shadow:none!important}#ck-sp .proof{background:var(--pac-bg,#F3F8FE)!important;padding:clamp(56px,7vw,96px) 0!important;margin-bottom:var(--sec-y,clamp(56px,7vw,104px))!important}#ck-sp .proof .card{background:transparent!important;border:0!important;border-radius:0!important;padding:0!important;box-shadow:none!important}#ck-sp .brain{background:linear-gradient(160deg,#0B1B33,#12315D 70%,#0A5BC4)!important;padding:clamp(56px,7vw,96px) 0!important;margin-bottom:var(--sec-y,clamp(56px,7vw,104px))!important}#ck-sp .brain .card{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important}#ck-sp .band{background:linear-gradient(135deg,#0A5BC4,#0071E3 55%,#2E9BEF)!important;padding:clamp(48px,6vw,84px) 0!important;margin-bottom:var(--sec-y,clamp(56px,7vw,104px))!important}#ck-sp .band .card{background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important}";
    document.head.appendChild(gs);
  })();
  var CHEV = '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
  var COMPANY_LINKS = '<a href="/case-studies">Case Studies</a><a href="/faqs">FAQs</a><a href="/blog">Blog &amp; News</a>';

  // /integrations is retired: drop nav/footer links to it, unwrap in-copy links to plain text.
  function scrubIntegrations() {
    document.querySelectorAll('a[href="/integrations"], a[href^="/integrations/"]').forEach(function (a) {
      var li = a.closest('li');
      if (li) { li.remove(); return; }
      if (a.closest('nav, footer, .nav-m, .foot-top, .ck-m, .ck-foot')) { a.remove(); return; }
      a.replaceWith(document.createTextNode(a.textContent));
    });
  }

  // On the new embed-built pages (home, FAQs, demo) the page ships its own nav.nav —
  // don't inject chrome; upgrade its plain Solutions link into the specialty dropdown and
  // rebuild its mobile menu to mirror the desktop nav (same titles, same order).
  var embedNav = document.querySelector('nav.nav');
  if (embedNav) {
    var sol = embedNav.querySelector('.nav-links a[href="/#specialties"], .nav-links a[href="#specialties"]');
    if (sol && !embedNav.querySelector('.nav-drop-btn-solutions')) {
      var drop = document.createElement('div');
      drop.className = 'nav-drop';
      drop.innerHTML = '<button type="button" class="nav-drop-btn nav-drop-btn-solutions">Solutions' + CHEV + '</button><div class="nav-drop-menu"><div class="nav-drop-in">' + solLinks + '</div></div>';
      sol.replaceWith(drop);
    }
    var plat = embedNav.querySelector('.nav-links a[href="/#platform"], .nav-links a[href="#platform"]');
    if (plat && !embedNav.querySelector('.nav-drop-btn-platform')) {
      var pdrop = document.createElement('div');
      pdrop.className = 'nav-drop';
      pdrop.innerHTML = '<button type="button" class="nav-drop-btn nav-drop-btn-platform">Platform' + CHEV + '</button><div class="nav-drop-menu"><div class="nav-drop-in">' + platLinks + '</div></div>';
      plat.replaceWith(pdrop);
    }
    var navM = embedNav.querySelector('.nav-m');
    if (navM && !navM.querySelector('details')) {
      var mFoot = navM.querySelector('.nav-m-foot');
      navM.innerHTML =
        '<details><summary>Platform' + CHEV + '</summary><div>' + platLinks + '</div></details>' +
        '<details><summary>Solutions' + CHEV + '</summary><div>' + solLinks + '</div></details>' +
        '<a href="/#security">Security</a>' +
        '<details><summary>Company' + CHEV + '</summary><div>' + COMPANY_LINKS + '</div></details>';
      if (mFoot) navM.appendChild(mFoot);
      var mst = document.createElement('style');
      mst.textContent =
        '.nav-m details{border-bottom:1px solid rgba(60,60,67,.08)}' +
        '.nav-m summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-size:19px;font-weight:600;color:#1D1D1F;padding:15px 0}' +
        '.nav-m summary::-webkit-details-marker{display:none}' +
        '.nav-m summary svg{width:18px;height:18px;stroke:#9A9AA0;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s}' +
        '.nav-m details[open] summary svg{transform:rotate(180deg)}' +
        '.nav-m details div a{display:block;font-size:17px;font-weight:500;color:#56565C;padding:11px 0 11px 14px;border-bottom:0}' +
        '.nav-m details div{padding-bottom:10px}';
      document.head.appendChild(mst);
    }
    scrubIntegrations();
    return;
  }

  var HOME = '/';
  var DEMO = '/book-a-demo';
  var LOGO = 'https://cdn.prod.website-files.com/698f93a6f3fe10ac9229e2b4/69fe48ba433201b97386cb44_Clinekt_Color.svg';

  var css = [
    '.master_navigation,section.footer{display:none!important}',
    'body{padding-top:64px!important}',
    /* blur lives on ::before — backdrop-filter on .ck-nav itself would make it the containing
       block for the fixed .ck-m menu and collapse it to zero height */
    ".ck-nav{position:fixed;top:0;left:0;right:0;z-index:99999;isolation:isolate;border-bottom:1px solid rgba(60,60,67,.1);font-family:'Inter',system-ui,-apple-system,sans-serif}",
    '.ck-nav::before{content:"";position:absolute;inset:0;background:rgba(255,255,255,.92);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);z-index:-1}',
    '.ck-nav-in{width:100%;padding:0 clamp(20px,5vw,72px);height:64px;display:flex;align-items:center;justify-content:space-between}',
    '.ck-nav-logo img{height:30px;display:block}',
    '.ck-links{display:flex;gap:32px}',
    '.ck-links a{font-size:14.5px;color:#56565C;text-decoration:none;transition:color .18s}',
    '.ck-links a:hover{color:#1D1D1F}',
    '.ck-drop{position:relative;display:flex;align-items:center}',
    '.ck-drop-btn{font-family:inherit;font-size:14.5px;color:#56565C;background:none;border:0;padding:0;cursor:pointer;transition:color .18s}',
    '.ck-drop:hover .ck-drop-btn{color:#1D1D1F}',
    '.ck-drop-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:12px;opacity:0;visibility:hidden;transition:opacity .18s;z-index:100000}',
    '.ck-drop:hover .ck-drop-menu{opacity:1;visibility:visible}',
    '.ck-drop-menu a{display:block;background:#fff;padding:9px 14px;font-size:14.5px;color:#56565C;text-decoration:none;white-space:nowrap;border:1px solid rgba(60,60,67,.1);border-top:0}',
    '.ck-drop-menu a:first-child{border-top:1px solid rgba(60,60,67,.1);border-radius:10px 10px 0 0}',
    '.ck-drop-menu a:last-child{border-radius:0 0 10px 10px}',
    '.ck-drop-menu a:hover{color:#1D1D1F;background:#F5F5F7}',
    '.ck-cta{display:flex;gap:22px;align-items:center}',
    '.ck-signin{font-size:14.5px;font-weight:600;color:#56565C;text-decoration:none}',
    '.ck-signin:hover{color:#1D1D1F}',
    '.ck-btn{display:inline-flex;align-items:center;background:#0071E3;color:#fff!important;font-size:14px;font-weight:600;padding:9px 18px;border-radius:10px;text-decoration:none;box-shadow:0 8px 22px -12px rgba(0,113,227,.6);transition:background .18s}',
    '.ck-btn:hover{background:#0077ED}',
    ".ck-foot{position:relative;z-index:9998;background:#fff;border-top:1px solid rgba(60,60,67,.08);padding:80px 0 40px;font-family:'Inter',system-ui,-apple-system,sans-serif}",
    '.ck-foot-in{width:100%;padding:0 clamp(20px,5vw,72px)}',
    '.ck-foot-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding-bottom:48px;border-bottom:1px solid rgba(60,60,67,.08)}',
    '.ck-foot h4{font-size:13px;font-weight:600;color:#1D1D1F;margin:0 0 14px;text-align:left}',
    '.ck-foot ul{list-style:none;margin:0;padding:0;display:grid;gap:10px;text-align:left}',
    '.ck-foot ul a{font-size:14.5px;color:#56565C;text-decoration:none}',
    '.ck-foot ul a:hover{color:#1D1D1F}',
    '.ck-brand img{height:30px;margin-bottom:16px}',
    '.ck-brand p{color:#56565C;font-size:15px;line-height:1.6;max-width:32ch;margin:0}',
    '.ck-foot-bot{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;padding-top:28px}',
    '.ck-foot-bot p{margin:0}',
    '.ck-foot-bot p,.ck-foot-bot a{color:#9A9AA0;font-size:13px;text-decoration:none}',
    '.ck-foot-bot a:hover{color:#1D1D1F}',
    '.ck-legal{display:flex;gap:22px;flex-wrap:wrap}',
    '.ck-tgl{display:none}',
    '.ck-burger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:40px;height:40px;cursor:pointer;border-radius:10px;flex-shrink:0}',
    '.ck-burger span{display:block;width:20px;height:2px;background:#1D1D1F;border-radius:2px;transition:transform .25s,opacity .2s}',
    '.ck-m{display:none}',
    '@media(max-width:1000px){.ck-links,.ck-signin,.ck-cta > .ck-btn{display:none}',
    '.ck-burger{display:flex}',
    '.ck-m{display:flex;position:fixed;top:64px;left:0;right:0;bottom:0;background:#fff;flex-direction:column;padding:14px clamp(20px,5vw,72px) 44px;overflow:auto;z-index:99998;transform:translateX(102%);transition:transform .3s}',
    '.ck-m a{font-size:19px;font-weight:600;color:#1D1D1F;padding:15px 0;border-bottom:1px solid rgba(60,60,67,.08);text-decoration:none}',
    '.ck-tgl:checked ~ .ck-m{transform:none}',
    '.ck-tgl:checked ~ .ck-nav-in .ck-burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}',
    '.ck-tgl:checked ~ .ck-nav-in .ck-burger span:nth-child(2){opacity:0}',
    '.ck-tgl:checked ~ .ck-nav-in .ck-burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}',
    '.ck-m details{border-bottom:1px solid rgba(60,60,67,.08)}',
    '.ck-m summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-size:19px;font-weight:600;color:#1D1D1F;padding:15px 0}',
    '.ck-m summary::-webkit-details-marker{display:none}',
    '.ck-m summary svg{width:18px;height:18px;stroke:#9A9AA0;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:transform .2s}',
    '.ck-m details[open] summary svg{transform:rotate(180deg)}',
    '.ck-m details div a{display:block;font-size:17px;font-weight:500;color:#56565C;padding:11px 0 11px 14px;border-bottom:0}',
    '.ck-m details div{padding-bottom:10px}',
    '.ck-m-foot{margin-top:22px;display:flex;flex-direction:column;gap:16px}',
    '.ck-m-foot a{border-bottom:0;padding:0}',
    '.ck-m-foot .ck-btn{justify-content:center;padding:15px;font-size:16px}}',
    '@media(max-width:900px) and (min-width:641px){.ck-foot-top{grid-template-columns:1fr 1fr}}',
    '@media(max-width:640px){.ck-foot-top{grid-template-columns:1fr;gap:30px}.ck-foot{padding:56px 0 32px}}'
  ].join('\n');

  var nav =
    '<div class="ck-nav"><input type="checkbox" id="ckTgl" class="ck-tgl"><div class="ck-nav-in">' +
    '<a class="ck-nav-logo" href="' + HOME + '"><img src="' + LOGO + '" alt="Clinekt Health"></a>' +
    '<div class="ck-links"><div class="ck-drop"><button type="button" class="ck-drop-btn">Platform</button><div class="ck-drop-menu">' + platLinks + '</div></div><div class="ck-drop"><button type="button" class="ck-drop-btn">Solutions</button><div class="ck-drop-menu">' + solLinks + '</div></div><a href="/#security">Security</a><div class="ck-drop"><button type="button" class="ck-drop-btn">Company</button><div class="ck-drop-menu"><a href="/case-studies">Case Studies</a><a href="/faqs">FAQs</a><a href="/blog">Blog &amp; News</a></div></div></div>' +
    '<div class="ck-cta"><a class="ck-signin" href="https://portal.clinekthealth.com/login">Sign in</a><a class="ck-btn" href="' + DEMO + '">Book a Demo</a><label for="ckTgl" class="ck-burger" aria-label="Menu"><span></span><span></span><span></span></label></div>' +
    '</div>' +
    '<div class="ck-m">' +
    '<details><summary>Platform' + CHEV + '</summary><div>' + platLinks + '</div></details>' +
    '<details><summary>Solutions' + CHEV + '</summary><div>' + solLinks + '</div></details>' +
    '<a href="/#security">Security</a>' +
    '<details><summary>Company' + CHEV + '</summary><div>' + COMPANY_LINKS + '</div></details>' +
    '<div class="ck-m-foot"><a href="https://portal.clinekthealth.com/login">Sign in</a><a class="ck-btn" href="' + DEMO + '">Book a Demo</a></div>' +
    '</div></div>';

  var foot =
    '<footer class="ck-foot"><div class="ck-foot-in">' +
    '<div class="ck-foot-top">' +
    '<div class="ck-brand"><img src="' + LOGO + '" alt="Clinekt Health"><p>HIPAA-compliant AI agents that activate patients — new, dormant, and net-new — around the clock.</p></div>' +
    '<div><h4>Platform</h4><ul>' +
    '<li><a href="/platform">Platform overview</a></li>' +
    '<li><a href="/inbound-agent">Inbound Agent</a></li>' +
    '<li><a href="/recall-agent">Recall Agent</a></li>' +
    '<li><a href="/outbound-agent">Outbound Agent</a></li>' +
    '<li><a href="/care-agent">Care Management Agent</a></li>' +
    '<li><a href="' + HOME + '#security">Security &amp; integrations</a></li></ul></div>' +
    '<div><h4>Resources</h4><ul>' +
    '<li><a href="/case-studies">Case Studies</a></li>' +
    '<li><a href="/blog">Blog</a></li>' +
    '<li><a href="/faqs">FAQs</a></li></ul></div>' +
    '<div><h4>Get started</h4><ul>' +
    '<li><a href="' + DEMO + '">Book a demo</a></li>' +
    '<li><a href="https://trust.delve.co/clinekt-health" target="_blank" rel="noopener">Trust Center</a></li></ul></div>' +
    '</div>' +
    '<div class="ck-foot-bot"><p>© 2026 Clinekt Health</p>' +
    '<div class="ck-legal"><a href="/terms-of-service">Terms of Service</a><a href="/privacy-policy">Privacy Policy</a><a href="/patient-privacy-policy">Patient Privacy Policy</a><a href="https://trust.delve.co/clinekt-health" target="_blank" rel="noopener">Trust Center</a></div>' +
    '</div></div></footer>';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var f = document.createElement('link');
  f.rel = 'stylesheet';
  f.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(f);

  function retarget() {
    // Point legacy in-content links at the new pages so old CTAs don't lead back into the old site.
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (h === '/book-a-demo' || h === '/book-a-demo-old' || h === 'https://www.clinekthealth.com/book-a-demo' || h === 'https://clinekthealth.com/book-a-demo') a.setAttribute('href', DEMO);
      else if (h === '/' || h === '/old-home' || h === 'https://www.clinekthealth.com/' || h === 'https://clinekthealth.com/') a.setAttribute('href', HOME);
    });
  }
  function scrubBrand() {
    // Legacy CMS copy may still reference the retired OrthoCheck name; normalize to Clinekt in rendered text.
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = walker.nextNode())) {
      if (/orthocheck/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/OrthoCheck AI/gi, 'Clinekt').replace(/OrthoCheck/gi, 'Clinekt');
    }
  }
  function inject() {
    // Remove (not just hide) the legacy chrome so the rendered DOM is clean for crawlers.
    document.querySelectorAll('.master_navigation, section.footer').forEach(function (el) { el.remove(); });
    document.body.insertAdjacentHTML('afterbegin', nav);
    document.body.insertAdjacentHTML('beforeend', foot);
    retarget();
    scrubBrand();
    scrubIntegrations();
  }
  if (document.body) { inject(); } else { document.addEventListener('DOMContentLoaded', inject); }
})();

/* H5 (HighFive) dental practice logos → home-page marquee.
   The home embed sits at ~47K of Webflow's 50K embed limit, so the marquee
   additions live here instead. Only the 10 largest H5 groups ship here so the ortho logos still dominate the strip. The marquee track is two identical halves
   (loop animates translateX(-50%)); we append the H5 set to each half and
   scale the animation duration so scroll speed stays constant. */
(function () {
  var mq = document.getElementById('marquee');
  if (!mq || mq.getAttribute('data-h5')) return;
  var base = 'https://cdn.jsdelivr.net/gh/tbram2/clinekt-leakage-calculator@875120c/site-assets/media/logos/h5/';
  var logos = [
    ['memphis-endodontics', 'Memphis Endodontics'],
    ['north-mississippi-omfs', 'North Mississippi OMFS'],
    ['sexton-oms', 'Sexton Oral & Maxillofacial Surgery'],
    ['koslin-kahn', 'Koslin & Kahn Oral and Facial Surgery'],
    ['ofs-east-alabama', 'Oral & Facial Surgery of East Alabama'],
    ['endodontic-associates', 'Endodontic Associates'],
    ['brookwood-endodontics', 'Brookwood Endodontics'],
    ['oms-of-the-shoals', 'OMS of the Shoals'],
    ['alabama-oral-facial-surgery', 'Alabama Oral & Facial Surgery'],
    ['endodontic-associates-ms', 'Endodontic Associates of Mississippi']
  ];
  function makeSet() {
    var f = document.createDocumentFragment();
    logos.forEach(function (l) {
      var img = new Image();
      img.src = base + l[0] + '.png';
      img.alt = l[1];
      img.decoding = 'async';
      f.appendChild(img);
    });
    return f;
  }
  var kids = mq.children.length;
  if (kids < 2 || kids % 2 !== 0) return;
  var half = kids / 2;
  mq.insertBefore(makeSet(), mq.children[half]);
  mq.appendChild(makeSet());
  // duration scales with track length, x0.8 so the strip runs slightly faster than the old baseline (Taylor 2026-07-20)
  var cs = window.getComputedStyle(mq).animationDuration;
  var secs = parseFloat(cs) || 80;
  mq.style.animationDuration = Math.round(secs * (half + logos.length) / half * 0.8) + 's';
  mq.setAttribute('data-h5', '1');
})();

/* Footer social icons (LinkedIn + X). Appends to whichever footer variant the page has:
   .foot-brand (embed-built pages: home, specialties, faqs, etc.) or .ck-brand (legacy
   chrome-swap footer injected above). Runs after the swap IIFE, so both exist by now. */
(function () {
  function addSocials() {
    if (document.querySelector('.ck-social')) return;
    var brand = document.querySelector('.foot-brand') || document.querySelector('.ck-brand');
    if (!brand) return;
    var st = document.createElement('style');
    st.textContent = '.ck-social{display:flex;gap:14px;margin-top:18px}.ck-social a{display:inline-flex;color:#9A9AA0;transition:color .18s}.ck-social a:hover{color:#1D1D1F}.ck-social svg{width:18px;height:18px}';
    document.head.appendChild(st);
    var d = document.createElement('div');
    d.className = 'ck-social';
    d.innerHTML =
      '<a href="https://www.linkedin.com/company/clinekt-health-1/" target="_blank" rel="noopener" aria-label="Clinekt Health on LinkedIn">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><path d="M13.2807 13.281H11.0582V9.80031C11.0582 8.97029 11.0434 7.90183 9.90225 7.90183C8.74467 7.90183 8.56758 8.80616 8.56758 9.73988V13.2808H6.34507V6.12306H8.47871V7.10123H8.50858C8.94365 6.35735 9.75257 5.91305 10.6137 5.945C12.8664 5.945 13.2817 7.42672 13.2817 9.35438L13.2807 13.281ZM3.83727 5.14464C3.12495 5.14478 2.5474 4.56739 2.54726 3.85508C2.54713 3.14273 3.1245 2.56517 3.83678 2.56503C4.54911 2.56489 5.12665 3.14228 5.12679 3.85459C5.12692 4.56694 4.54959 5.14454 3.83727 5.14464ZM4.94852 13.281H2.72369V6.12306H4.94852V13.281ZM14.3887 0.501033H1.60686C1.00277 0.494207 0.50738 0.978113 0.5 1.58222V14.4176C0.507137 15.022 1.00246 15.5064 1.60686 15.4999H14.3887C14.9944 15.5075 15.4916 15.0231 15.5 14.4176V1.58132C15.4914 0.976 14.994 0.492128 14.3887 0.500097V0.501033Z" fill="currentColor"/></svg></a>' +
      '<a href="https://x.com/clinekthealth" target="_blank" rel="noopener" aria-label="Clinekt Health on X">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none"><path d="M12.6009 0.75H15.0544L9.69434 6.89151L16 15.25H11.0627L7.19566 10.1795L2.77087 15.25H0.31595L6.04904 8.68086L0 0.75H5.06262L8.55811 5.38377L12.6009 0.75ZM11.7399 13.7775H13.0993L4.32392 2.14493H2.86506L11.7399 13.7775Z" fill="currentColor"/></svg></a>';
    brand.appendChild(d);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', addSocials); } else { addSocials(); }
})();

/* Embed footer "Platform" column, site-wide: point the agent links at their agent
   pages (the embeds ship #platform anchors), rename Care Agent -> Care Management
   Agent, and append Platform overview + Care Management Agent links when missing. */
(function () {
  var AGENT_PAGES = { 'Inbound Agent': '/inbound-agent', 'Recall Agent': '/recall-agent', 'Outbound Agent': '/outbound-agent' };
  function fixFooter() {
    document.querySelectorAll('.foot-top h4').forEach(function (h) {
      if (h.textContent.trim() !== 'Platform') return;
      var ul = h.parentElement.querySelector('ul');
      if (!ul) return;
      ul.querySelectorAll('a').forEach(function (a) {
        var t = a.textContent.trim();
        if (AGENT_PAGES[t]) a.setAttribute('href', AGENT_PAGES[t]);
        if (t === 'Care Agent') a.textContent = 'Care Management Agent';
      });
      var care = ul.querySelector('a[href="/care-agent"]');
      if (!care) {
        var li = document.createElement('li');
        li.innerHTML = '<a href="/care-agent">Care Management Agent</a>';
        var ob = ul.querySelector('a[href="/outbound-agent"]');
        var anchor = ob ? ob.closest('li') : null;
        if (anchor && anchor.nextSibling) { ul.insertBefore(li, anchor.nextSibling); } else { ul.appendChild(li); }
      }
      if (!ul.querySelector('a[href="/platform"]')) {
        var li2 = document.createElement('li');
        li2.innerHTML = '<a href="/platform">Platform overview</a>';
        ul.insertBefore(li2, ul.firstChild);
      }
    });
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', fixFooter); } else { fixFooter(); }
})();
