/* WO-A2 internal-link strips (home #ck-wo2h, /orthopedics #ck-wo2).
   The strips are native Webflow elements appended at body level because the pages
   themselves are single HtmlEmbeds with no API write path into the embed code.
   This script (loaded deferred, after chrome.js and the #ckvh voice module in
   document order) does two things:
   1. Home: moves #ck-wo2h from body-end to directly above the static <footer>
      inside the page embed — same self-relocation pattern #ckvh already uses.
      On /orthopedics no move is needed: chrome.js runs earlier and appends its
      footer after the strip, so the strip is already above the footer.
   2. Both pages: sets the Inter font stack on the strip copy — Webflow's style
      engine dropped the font-family when the strip styles were created because
      Inter is loaded per-page via Google Fonts, not installed as a site font. */
(function () {
  var FONT = "'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif";
  ['ck-wo2h', 'ck-wo2'].forEach(function (id) {
    var sec = document.getElementById(id);
    if (!sec) return;
    var ps = sec.querySelectorAll('.ck-wo2-p');
    for (var i = 0; i < ps.length; i++) ps[i].style.fontFamily = FONT;
  });
  var h = document.getElementById('ck-wo2h');
  var f = document.querySelector('footer');
  if (h && f && f.parentNode && h.nextElementSibling !== f) f.parentNode.insertBefore(h, f);
})();
