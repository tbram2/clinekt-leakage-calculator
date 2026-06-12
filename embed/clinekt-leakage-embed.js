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
  frame.style.cssText = "width:100%;border:0;display:block;min-height:760px;background:transparent;overflow:hidden";
  target.appendChild(frame);

  var frameOrigin;
  try { frameOrigin = new URL(src, location.href).origin; } catch (e) { frameOrigin = null; }

  window.addEventListener("message", function (e) {
    if (frameOrigin && e.origin !== frameOrigin) return;
    if (e.source !== frame.contentWindow) return;
    if (e.data && typeof e.data.clinektLeakageHeight === "number") {
      frame.style.height = (Math.ceil(e.data.clinektLeakageHeight) + 2) + "px";
      frame.style.minHeight = "0";
    }
  });
})();
