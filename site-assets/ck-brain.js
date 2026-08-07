/* ck-brain.js — Clinekt neural sphere: 3D dot brain, links, agent pulses.
   Transparent bg; size <canvas class="ckbrain"> via CSS. */
(function () {
  'use strict';
  var TAU = Math.PI * 2, N = 260, CAM = 3.2, rnd = Math.random;
  var AG = [['#0071E3', 'Inbound'], ['#6F2DAA', 'Recall'], ['#119D57', 'Outbound'], ['#C26A12', 'Care Mgmt']];
  var reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* fibonacci sphere */
  var PTS = [], GA = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < N; i++) {
    var fy = 1 - 2 * (i + 0.5) / N, fr = Math.sqrt(Math.max(0, 1 - fy * fy));
    PTS.push([Math.cos(GA * i) * fr, fy, Math.sin(GA * i) * fr]);
  }
  /* links: 300 shortest 3D pairs, precomputed */
  var LINKS = (function () {
    var all = [], a, b;
    for (a = 0; a < N; a++) for (b = a + 1; b < N; b++) {
      var dx = PTS[a][0] - PTS[b][0], dy = PTS[a][1] - PTS[b][1], dz = PTS[a][2] - PTS[b][2];
      var q = dx * dx + dy * dy + dz * dz;
      if (q < 0.09) all.push([a, b, q]);
    }
    all.sort(function (u, v) { return u[2] - v[2]; });
    return all.slice(0, 300);
  })();

  function start(cv) {
    if (cv.__ckbrain) return;
    cv.__ckbrain = 1;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var labels = cv.getAttribute('data-labels') !== 'off';
    var W = 0, H = 0, R = 0, CX = 0, CY = 0;
    var nodes = [], pulses = [], rips = [], proj = new Float32Array(N * 3);
    var t = 0, last = 0, due = 0.6, raf = 0, seen = true;

    function size() {
      var b = cv.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) return false;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = b.width; H = b.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      CX = W / 2; CY = H / 2; R = 0.34 * Math.min(W, H);
      var wide = W >= H;
      var xs = wide ? [0.14, 0.86] : [0.28, 0.72];
      var ys = wide ? [0.22, 0.78] : [0.10, 0.90];
      for (var i = 0; i < 4; i++)
        nodes[i] = { x: W * xs[i % 2], y: H * ys[i < 2 ? 0 : 1], c: AG[i][0], l: AG[i][1] };
      return true;
    }

    function spawn() {
      var nd = nodes[(rnd() * 4) | 0];
      var dx = nd.x - CX, dy = nd.y - CY, dl = Math.sqrt(dx * dx + dy * dy) || 1;
      var ex = CX + dx / dl * R * 1.02, ey = CY + dy / dl * R * 1.02;
      var toAgent = rnd() >= 0.35;
      var x0 = toAgent ? ex : nd.x, y0 = toAgent ? ey : nd.y;
      var x2 = toAgent ? nd.x : ex, y2 = toAgent ? nd.y : ey;
      var vx = x2 - x0, vy = y2 - y0, vl = Math.sqrt(vx * vx + vy * vy) || 1;
      var off = vl * (0.12 + rnd() * 0.18) * (rnd() < 0.5 ? -1 : 1);
      pulses.push({ p: 0, dur: 0.9 + rnd() * 0.5, c: nd.c, x0: x0, y0: y0, x2: x2, y2: y2,
        x1: (x0 + x2) / 2 - vy / vl * off, y1: (y0 + y2) / 2 + vx / vl * off });
    }

    function step(dt) {
      if (t >= due) {
        due = t + 1 + rnd() * 0.2;
        if (pulses.length < 3) spawn();
      }
      for (var i = pulses.length - 1; i >= 0; i--) {
        var u = pulses[i];
        u.p += dt / u.dur;
        if (u.p >= 1) {
          rips.push({ x: u.x2, y: u.y2, c: u.c, a: 0 });
          pulses.splice(i, 1);
        }
      }
      for (i = rips.length - 1; i >= 0; i--)
        if ((rips[i].a += dt / 0.55) >= 1) rips.splice(i, 1);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i, k;
      /* soft core glow */
      var g = ctx.createRadialGradient(CX, CY, 0, CX, CY, R * 1.5);
      g.addColorStop(0, 'rgba(0,113,227,0.20)');
      g.addColorStop(0.55, 'rgba(0,113,227,0.07)');
      g.addColorStop(1, 'rgba(0,113,227,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(CX, CY, R * 1.5, 0, TAU); ctx.fill();

      /* rotate + project (camera 3.2R) */
      var ry = t * TAU / 14, rx = 0.12 * Math.sin(t * 0.5);
      var cA = Math.cos(ry), sA = Math.sin(ry), cB = Math.cos(rx), sB = Math.sin(rx);
      for (i = 0; i < N; i++) {
        var p = PTS[i];
        var x = p[0] * cA + p[2] * sA, z = p[2] * cA - p[0] * sA;
        var yv = p[1] * cB - z * sB;
        z = p[1] * sB + z * cB;
        var s = R * CAM / (CAM - z);
        proj[i * 3] = CX + x * s;
        proj[i * 3 + 1] = CY + yv * s;
        proj[i * 3 + 2] = (z + 1) / 2; /* depth 0..1 */
      }
      /* links */
      ctx.lineWidth = 1;
      for (i = 0; i < LINKS.length; i++) {
        var a3 = LINKS[i][0] * 3, b3 = LINKS[i][1] * 3;
        var d = (proj[a3 + 2] + proj[b3 + 2]) / 2;
        ctx.strokeStyle = 'rgba(59,165,240,' + (0.03 + 0.16 * d * d).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(proj[a3], proj[a3 + 1]); ctx.lineTo(proj[b3], proj[b3 + 1]); ctx.stroke();
      }
      /* dots: #3BA5F0->#7FB6F5 by depth */
      for (i = 0; i < N; i++) {
        var dp = proj[i * 3 + 2];
        ctx.fillStyle = 'rgba(' + Math.round(59 + 68 * dp) + ',' + Math.round(165 + 17 * dp) + ',' +
          Math.round(240 + 5 * dp) + ',' + (0.25 + 0.7 * dp).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(proj[i * 3], proj[i * 3 + 1], 1.2 + 1.4 * dp, 0, TAU); ctx.fill();
      }
      /* agent nodes */
      for (i = 0; i < 4; i++) {
        var nd = nodes[i];
        ctx.strokeStyle = nd.c; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, 9, 0, TAU); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = nd.c;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, 5, 0, TAU); ctx.fill();
        if (labels) {
          ctx.fillStyle = 'rgba(255,255,255,0.78)';
          ctx.font = '11px Inter,sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(nd.l, nd.x, Math.min(nd.y + 24, H - 5));
        }
      }
      /* pulses on quadratic beziers */
      for (i = 0; i < pulses.length; i++) {
        var u = pulses[i], e = u.p * u.p * (3 - 2 * u.p);
        ctx.fillStyle = u.c;
        for (k = 4; k >= 0; k--) {
          var te = e - k * 0.05;
          if (te < 0) continue;
          var mt = 1 - te;
          ctx.globalAlpha = (1 - k / 5) * (k ? 0.5 : 1) * Math.min(1, u.p * 6);
          ctx.beginPath();
          ctx.arc(mt * mt * u.x0 + 2 * mt * te * u.x1 + te * te * u.x2,
            mt * mt * u.y0 + 2 * mt * te * u.y1 + te * te * u.y2, 2.5 - k * 0.35, 0, TAU);
          ctx.fill();
        }
      }
      /* arrival rips */
      ctx.lineWidth = 1.5;
      for (i = 0; i < rips.length; i++) {
        var rp = rips[i];
        ctx.globalAlpha = 0.7 * (1 - rp.a);
        ctx.strokeStyle = rp.c;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, 5 + 13 * rp.a, 0, TAU); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      if (!seen || document.hidden) { raf = 0; return; }
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 0.016;
      last = now; t += dt;
      step(dt); draw();
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (reduced || raf || !seen || document.hidden || !W) return;
      last = 0; raf = requestAnimationFrame(loop);
    }
    function halt() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    if (window.ResizeObserver)
      new ResizeObserver(function () { if (size()) { draw(); play(); } }).observe(cv);
    if (!reduced) {
      if (window.IntersectionObserver)
        new IntersectionObserver(function (es) {
          seen = es[es.length - 1].isIntersecting;
          if (seen) play(); else halt();
        }).observe(cv);
      document.addEventListener('visibilitychange', function () { if (document.hidden) halt(); else play(); });
    }
    if (size()) { draw(); play(); } /* reduced motion: one static frame */
  }

  function scan(root) {
    var list = (root && root.querySelectorAll ? root : document)
      .querySelectorAll('canvas.ckbrain,canvas[data-ckbrain]');
    for (var i = 0; i < list.length; i++) start(list[i]);
  }
  function boot() {
    scan();
    if (window.MutationObserver && document.body)
      new MutationObserver(function () { scan(); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.ckBrainScan = scan;
})();
