/* Clinekt Leakage Calculator — Webflow embed loader.

   Paste this into a Webflow Embed element (or before </body>):

     <div id="clinekt-leakage-calculator"></div>
     <script src="https://YOUR-HOST/clinekt-leakage-embed.js"
             data-src="https://YOUR-HOST/clinekt-leakage-calculator.html"></script>

   It injects the calculator into that div inside an iframe and keeps the
   iframe height matched to the content, so it sits in the page like a
   native section. Webflow CSS cannot affect the calculator and vice versa. */
(function () {
  "use strict";
  var script = document.currentScript;
  var src = (script && script.getAttribute("data-src")) ||
    "https://tbram2.github.io/clinekt-leakage-calculator/clinekt-leakage-calculator.html";

  var target = document.getElementById("clinekt-leakage-calculator");
  if (!target && script) {
    target = document.createElement("div");
    script.parentNode.insertBefore(target, script);
  }
  if (!target || target.querySelector("iframe")) return;

  var frame = document.createElement("iframe");
  var params = "embed=1";
  var leadHook = script && script.getAttribute("data-lead-webhook");
  if (leadHook) params += "&leadhook=" + encodeURIComponent(leadHook);
  frame.src = src + (src.indexOf("?") > -1 ? "&" : "?") + params;
  frame.title = "Clinekt Leakage Calculator";
  frame.loading = "lazy";
  frame.setAttribute("scrolling", "no");
  frame.style.cssText = "width:100%;max-width:100%;border:0;display:block;min-height:760px;background:transparent;overflow:hidden";
  target.style.maxWidth = "100%";
  target.style.overflowX = "hidden";
  target.appendChild(frame);

  var appliedH = 0;
  var frameOrigin;
  try { frameOrigin = new URL(src, location.href).origin; } catch (e) { frameOrigin = null; }

  // Lead capture relay: Webflow only stores form submissions whose Origin
  // matches the site's domains, so the iframe posts lead data up to this
  // script (running on the Webflow site) and we submit it from here.
  var WF_FORM = "https://formdata.webflow.com/api/v1/form/698f93a6f3fe10ac9229e2b4";
  var WF_PAGE_ID = "698f93a7f3fe10ac9229e7fc";
  var WF_ELEMENT_ID = "2537b3c8-a4ee-a1b5-f95e-dec209ce3a62";
  function submitLead(d) {
    try {
      var body = new URLSearchParams();
      body.append("name", "clinectleakagefill");
      body.append("pageId", WF_PAGE_ID);
      body.append("elementId", WF_ELEMENT_ID);
      body.append("source", location.href);
      body.append("test", "false");
      body.append("dolphin", "false");
      Object.keys(d).forEach(function (k) { body.append("fields[" + k + "]", String(d[k])); });
      fetch(WF_FORM, { method: "POST", body: body, keepalive: true }).catch(function () {});
    } catch (err) {}
  }

  window.addEventListener("message", function (e) {
    if (frameOrigin && e.origin !== frameOrigin) return;
    if (e.source !== frame.contentWindow) return;
    if (e.data && typeof e.data.clinektLeakageHeight === "number") {
      var h = Math.ceil(e.data.clinektLeakageHeight);
      // Tolerance band: the content re-measures itself after every resize we
      // apply, oscillating by a pixel or two forever. Swallow tiny deltas.
      if (Math.abs(h - appliedH) > 8) {
        appliedH = h;
        frame.style.height = h + "px";
        frame.style.minHeight = "0";
      }
    }
    if (e.data && e.data.clinektLead) submitLead(e.data.clinektLead);
  });
})();
