/* Related-resources sections (home #ck-wo2h, /orthopedics #ck-wo2).
   History: these began 2026-08-27 as the WO-A2 internal-link strips; on 2026-09-18
   each page's strips were consolidated into ONE designed "Resources" section
   (classes ck-rr*). The ids are unchanged so existing checks keep working.
   The sections are native Webflow elements appended at body level, outside the
   page embeds (they survive a page-embed rewrite). This script, loaded deferred
   after chrome.js in document order, does two things:

     body                                  after this script
     +-- page embed                        +-- page embed
     |     ... sections                    |     ... sections
     |     closing CTA                     |     #ck-wo2h / #ck-wo2   <-- moved here
     |     (home: static footer)           |     closing CTA
     +-- #ck-wo2h / #ck-wo2                |     (home: static footer)
     +-- this script                       +-- this script

   1. Moves the section to directly above the page's closing CTA (home .cta-wrap,
      /orthopedics .pv-cta-wrap) so the page still ends on the CTA. If the CTA is
      not found, home falls back to the old spot above the static <footer>; on
      /orthopedics the section then simply stays above the chrome.js footer.
   2. Sets the Inter font stack on the section. Webflow's style engine can drop
      the font-family because Inter is loaded per page, not installed site-wide. */
(function () {
  var FONT = "'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif";
  function place(id, ctaSel, fallbackSel) {
    var sec = document.getElementById(id);
    if (!sec) return;
    sec.style.fontFamily = FONT;
    var anchor = document.querySelector(ctaSel) || (fallbackSel && document.querySelector(fallbackSel));
    if (anchor && anchor.parentNode && sec.nextElementSibling !== anchor) anchor.parentNode.insertBefore(sec, anchor);
  }
  place('ck-wo2h', '.cta-wrap', 'footer');
  place('ck-wo2', '.pv-cta-wrap', null);
})();
