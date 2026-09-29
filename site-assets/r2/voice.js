/* Clinekt voice agent (homepage hero). Built by webflow-push/r2/make_webflow.py; edit make_home.py. */
var AGENT_ID = "agent_6401kz4n64k7esd9x4ssbh6srrf6";

  var card = document.getElementById("ckvCard"),
      orb = document.getElementById("ckvOrb"),
      state = document.getElementById("ckvState"),
      after = document.getElementById("ckvAfter");
  var conv = null, connecting = false, sdkPromise = null, gen = 0;

  function setState(txt, cls){
    state.textContent = txt;
    state.className = "ckv-state" + (cls ? " " + cls : "");
  }
  function setMode(mode){
    card.classList.remove("ckv-live","ckv-live-session","ckv-listening","ckv-speaking","ckv-connecting");
    if(mode === "connecting"){ card.classList.add("ckv-connecting"); }
    if(mode === "listening"){ card.classList.add("ckv-live","ckv-live-session","ckv-listening"); }
    if(mode === "speaking"){ card.classList.add("ckv-live","ckv-live-session","ckv-speaking"); }
  }
  function loadSdk(){
    if(!sdkPromise) sdkPromise = import("https://cdn.jsdelivr.net/npm/@elevenlabs/client@1.16.0/+esm");
    return sdkPromise;
  }
  function friendly(err){
    var m = String(err && (err.message || err) || "");
    if(/NotAllowedError|Permission|denied/i.test(m)) return "Microphone access is blocked. Allow it in your browser and try again.";
    if(/not allowed to connect|allowlist|allowed/i.test(m)) return "The agent isn't available from this address right now.";
    return "Couldn't connect right now. Please try again in a moment.";
  }

  function mkOpts(g){
    return {
      agentId: AGENT_ID,
      onConnect: function(){ if(g !== gen) return; connecting = false; setState("Connected. Say hello", "ckv-on"); setMode("listening"); },
      onDisconnect: function(){ if(g !== gen) return; if(!conv && !connecting) return; conv = null; connecting = false; ended(); },
      onModeChange: function(m){ if(g !== gen) return; setMode(m.mode === "speaking" ? "speaking" : "listening"); setState(m.mode === "speaking" ? "Agent speaking…" : "Listening. Go ahead", "ckv-on"); },
      onError: function(e){ if(g === gen) console.error("[ckv] agent error", e); }
    };
  }
  async function start(){
    connecting = true;
    var g = ++gen;
    setMode("connecting"); setState("Connecting…");
    after.style.display = "none";
    var watchdog = setTimeout(function(){
      if(g !== gen || !connecting) return;
      gen++; connecting = false;
      var c = conv; conv = null;
      try{ if(c) c.endSession(); }catch(e){}
      setMode("idle"); setState("Couldn't connect right now. Please try again in a moment.", "ckv-err");
    }, 15000);
    try{
      var sdk = await loadSdk();
      var c;
      try{
        c = await sdk.Conversation.startSession(Object.assign({ connectionType: "websocket" }, mkOpts(g)));
      }catch(first){
        console.warn("[ckv] websocket failed, retrying webrtc", first);
        if(g !== gen) return;
        g = ++gen;
        c = await sdk.Conversation.startSession(Object.assign({ connectionType: "webrtc" }, mkOpts(g)));
      }
      if(g !== gen){ try{ c.endSession(); }catch(e){} return; }
      clearTimeout(watchdog);
      conv = c;
    }catch(err){
      console.error("[ckv] connect failed", err);
      clearTimeout(watchdog);
      if(g !== gen) return;
      conv = null; connecting = false;
      setMode("idle"); setState(friendly(err), "ckv-err");
    }
  }
  async function stop(){
    gen++;
    var c = conv; conv = null;
    setState("Ending…");
    try{ if(c) await c.endSession(); }catch(e){}
    ended();
  }
  function ended(){
    setMode("idle");
    setState("That was the real agent, live. Imagine it answering for your practice.");
    after.style.display = "block";
  }
  orb.addEventListener("click", function(){
    if(connecting) return;
    if(conv) stop(); else start();
  });
  document.getElementById("ckvAgain").addEventListener("click", function(){
    after.style.display = "none";
    setState("Tap the orb to start talking to the live agent");
  });
  /* the pill under the orb is a second way to press the orb */
  document.getElementById("ckvTap").addEventListener("click", function(){ orb.click(); });
  /* every "talk to the agent" button on this page starts the conversation here, in the hero */
  [].slice.call(document.querySelectorAll('a[href="#talk"]')).forEach(function(a){
    a.addEventListener("click", function(e){ e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); if(!conv && !connecting) start(); });
  });
