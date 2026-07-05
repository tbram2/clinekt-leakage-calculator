/* Clinekt interim chrome swap: replaces the OLD site's nav + footer with the new-design
   header/footer on legacy pages (FAQs, Blog, Case Studies, Integrations, legal), so
   visitors coming from home-v2 / book-a-demo-v2 never fall back into the old site.
   Loaded site-wide; the guard below makes it a no-op on the new embed-built pages.
   AT GO-LIVE: change HOME to '/' and DEMO to '/book-a-demo', bump ?v= in site custom code. */
(function () {
  if (document.querySelector('.ck-nav')) return;

  // The nine specialty landing pages — desktop Solutions dropdown + mobile Solutions group.
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
  var solLinks = SOLUTIONS.map(function (s) { return '<a href="' + s[1] + '">' + s[0] + '</a>'; }).join('');
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

  // EHR compatibility strip + commercial terms, injected above the CTA on home + specialty pages.
  // Text wordmarks only (trademark-safe compatibility list); below the fold so no CLS risk.
  function ehrStrip() {
    var paths = ['/', '/orthopedics', '/physical-therapy', '/oral-surgery', '/dermatology', '/ophthalmology', '/urology', '/primary-care', '/cardiology', '/pediatrics'];
    var p = location.pathname.replace(/\/+$/, '') || '/';
    if (paths.indexOf(p) === -1) return;
    if (document.getElementById('ck-ehr')) return;
    var anchor = document.querySelector('.cta-wrap');
    if (!anchor) { var c = document.querySelector('div.cta, section.cta'); if (c) anchor = c.closest('section') || c; }
    if (!anchor) return;
    var ehrs = ['Epic', 'Cerner', 'athenahealth', 'ModMed', 'NextGen', 'eClinicalWorks', 'AdvancedMD', 'Greenway', 'Veradigm'];
    var st = document.createElement('style');
    st.textContent = '#ck-ehr{padding:72px 24px;text-align:center;font-family:Inter,system-ui,-apple-system,sans-serif}' +
      '#ck-ehr .ck-ehr-label{font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#0071E3;margin-bottom:26px}' +
      '#ck-ehr .ck-ehr-row{display:flex;flex-wrap:wrap;justify-content:center;gap:14px 34px;max-width:880px;margin:0 auto 28px}' +
      '#ck-ehr .ck-ehr-row span{font-size:17px;font-weight:600;color:#9A9AA0;letter-spacing:-.01em}' +
      '#ck-ehr .ck-ehr-terms{font-size:15px;color:#56565C}' +
      '#ck-ehr .ck-ehr-terms b{color:#1D1D1F;font-weight:600}';
    document.head.appendChild(st);
    var sec = document.createElement('section');
    sec.id = 'ck-ehr';
    sec.innerHTML = '<div class="ck-ehr-label">Works alongside your EHR</div>' +
      '<div class="ck-ehr-row">' + ehrs.map(function (e) { return '<span>' + e + '</span>'; }).join('') + '</div>' +
      '<div class="ck-ehr-terms"><b>Flat subscription</b> &middot; <b>No long-term contracts</b> &middot; <b>Live same day</b></div>';
    anchor.parentNode.insertBefore(sec, anchor);
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
    var navM = embedNav.querySelector('.nav-m');
    if (navM && !navM.querySelector('details')) {
      var mFoot = navM.querySelector('.nav-m-foot');
      navM.innerHTML =
        '<a href="/#platform">Platform</a>' +
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
    ehrStrip();
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
    '<div class="ck-links"><a href="/#platform">Platform</a><div class="ck-drop"><button type="button" class="ck-drop-btn">Solutions</button><div class="ck-drop-menu">' + solLinks + '</div></div><a href="/#security">Security</a><div class="ck-drop"><button type="button" class="ck-drop-btn">Company</button><div class="ck-drop-menu"><a href="/case-studies">Case Studies</a><a href="/faqs">FAQs</a><a href="/blog">Blog &amp; News</a></div></div></div>' +
    '<div class="ck-cta"><a class="ck-signin" href="https://portal.clinekthealth.com/login">Sign in</a><a class="ck-btn" href="' + DEMO + '">Book a Demo</a><label for="ckTgl" class="ck-burger" aria-label="Menu"><span></span><span></span><span></span></label></div>' +
    '</div>' +
    '<div class="ck-m">' +
    '<a href="/#platform">Platform</a>' +
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
    '<li><a href="' + HOME + '#platform">Inbound Agent</a></li>' +
    '<li><a href="' + HOME + '#platform">Recall Agent</a></li>' +
    '<li><a href="' + HOME + '#platform">Outbound Agent</a></li>' +
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
