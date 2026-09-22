(() => {
  const screen = document.getElementById('screen');
  const lcd = document.getElementById('lcd');
  const gameboy = document.querySelector('.gameboy');

  const menu = [
    ['START SIGNAL', 'demo'],
    ['ABOUT GAME', 'about'],
    ['STORY', 'story'],
    ['FEATURES', 'features'],
    ['DEV STATUS', 'dev'],
    ['GALLERY', 'gallery']
  ];
  let mode = 'boot';
  let selected = 0;
  let audioEnabled = true;
  let audioCtx = null;
  let demo = { x: 74, y: 83, message: 'SIGNAL FOUND. MOVE WITH D-PAD. A = INSPECT.' };

  function tone(freq = 220, duration = .05, type = 'square', volume = .03) {
    if (!audioEnabled) return;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type; osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }
  function clickSound(){ tone(130,.035,'square',.025); }
  function selectSound(){ tone(360,.05,'square',.025); setTimeout(()=>tone(520,.07,'square',.02),40); }
  function backSound(){ tone(170,.07,'square',.02); }
  function bootSound(){
    [196,246,293,392].forEach((f,i)=>setTimeout(()=>tone(f,.12,'square',.025),i*120));
  }

  function boot() {
    mode = 'boot';
    screen.innerHTML = `<div class="boot"><div class="boot-mark">MENOCLONE</div><div class="boot-sub">MNC GAMING SYSTEM</div><div class="boot-bar"><i></i></div><div class="boot-sub">SIGNAL LOST // GB-001</div></div>`;
    bootSound();
    setTimeout(renderMenu, 1850);
  }

  function renderMenu() {
    mode = 'menu';
    screen.innerHTML = `
      <div class="menu-title">SIGNAL LOST</div>
      <div class="menu-sub">MNC / 2027 / ORIGINALITY HAS ORIGINS.</div>
      ${menu.map((m,i)=>`<div class="menu-item ${i===selected?'active':''}">${i===selected?'▶ ':''}${m[0]}</div>`).join('')}
      <div class="menu-help">D-PAD MOVE&nbsp;&nbsp; A SELECT&nbsp;&nbsp; START DEMO</div>`;
  }

  const pages = {
    about: `<div class="screen-page"><h2>ABOUT SIGNAL LOST</h2><p>A GAME BOY-INSPIRED EXPLORATION RPG FROM MENOCLONE GAMING.</p><p>SEARCH THE CITY FOR A TRANSMISSION THAT SHOULD NOT EXIST.</p><span class="tag">RPG</span><span class="tag">EXPLORATION</span><span class="tag">PUZZLES</span><span class="tag">MYSTERY</span><div class="back">B = BACK</div></div>`,
    story: `<div class="screen-page"><h2>THE STORY</h2><p>THE CITY'S NIGHTLY BROADCAST SUDDENLY GOES SILENT.</p><p>YOUR HANDHELD RECEIVER CATCHES ONE IMPOSSIBLE SIGNAL: A UFO MARKED MNC.</p><p>FOLLOW THE TRACE. COLLECT FRAGMENTS. FIND OUT WHO CUT THE SIGNAL — AND WHY.</p><div class="back">B = BACK</div></div>`,
    features: `<div class="screen-page"><h2>CORE LOOP</h2><p>▶ EXPLORE CONNECTED DISTRICTS</p><p>▶ COLLECT SIGNAL FRAGMENTS</p><p>▶ INVESTIGATE PEOPLE + PLACES</p><p>▶ UNLOCK HIDDEN ROUTES</p><p>▶ SURVIVE SIGNAL EVENTS</p><p>▶ DISCOVER THE ORIGIN</p><div class="back">B = BACK</div></div>`,
    dev: `<div class="screen-page"><h2>DEV STATUS</h2><p>STATUS: IN DEVELOPMENT</p><p>TARGET: 2027</p><p>PALETTE: DMG 4-COLOR</p><p>ENGINE: GB STUDIO</p><p>FOCUS: MOBILE-FIRST / PHYSICAL CART FEEL / ORIGINAL HARDWARE AESTHETIC</p><div class="back">B = BACK</div></div>`,
    gallery: `<div class="screen-page"><h2>DEV FILES</h2><p>GB-001 — CHARACTER CONCEPT</p><p>GB-002 — CITY TEST</p><p>GB-003 — UFO SIGNAL</p><p>GB-004 — DMG PALETTE LOCK</p><p>SCROLL DOWN OUTSIDE THE DEVICE TO VIEW THE CURRENT VISUAL DEVELOPMENT SHEET.</p><div class="back">B = BACK</div></div>`
  };

  function openPage(id) {
    if (id === 'demo') return startDemo();
    mode = id;
    screen.innerHTML = pages[id];
  }

  function startDemo() {
    mode = 'demo';
    demo = { x: 74, y: 83, message: 'SIGNAL FOUND. MOVE WITH D-PAD. A = INSPECT.' };
    renderDemo();
  }

  function renderDemo() {
    screen.innerHTML = `
      <div class="demo-map">
        <div class="building one"></div><div class="sign">MNC</div>
        <div class="building two"></div><div class="ufo-icon">⌁</div>
        <div class="road"></div>
        <div class="hud">SIG: ${Math.max(1, 99-Math.round(Math.hypot(demo.x-126,demo.y-35)))}%</div>
        <div class="player" style="left:${demo.x}px;top:${demo.y}px"></div>
        <div class="demo-msg">${demo.message}</div>
      </div>`;
  }

  function demoMove(dx, dy) {
    demo.x = Math.max(4, Math.min(147, demo.x + dx));
    demo.y = Math.max(7, Math.min(105, demo.y + dy));
    demo.message = 'FOLLOW THE STRONGEST SIGNAL.';
    renderDemo();
  }

  function inspect() {
    const nearUfo = Math.hypot(demo.x-126,demo.y-35) < 35;
    const nearSign = Math.hypot(demo.x-35,demo.y-38) < 35;
    if (nearUfo) demo.message = 'MNC SIGNAL: "ORIGINALITY HAS ORIGINS."';
    else if (nearSign) demo.message = 'THE TAG IS FRESH. SOMEONE WAS HERE.';
    else demo.message = 'NOTHING HERE. KEEP SEARCHING.';
    renderDemo();
  }

  function handle(key) {
    lcd.focus({preventScroll:true});
    if (mode === 'boot') return;
    if (mode === 'menu') {
      if (key === 'up') { selected = (selected - 1 + menu.length) % menu.length; clickSound(); renderMenu(); }
      if (key === 'down') { selected = (selected + 1) % menu.length; clickSound(); renderMenu(); }
      if (key === 'a' || key === 'right') { selectSound(); openPage(menu[selected][1]); }
      if (key === 'start') { selectSound(); startDemo(); }
      if (key === 'select') { audioEnabled = !audioEnabled; screen.querySelector('.menu-help').textContent = `AUDIO ${audioEnabled?'ON':'OFF'} // A SELECT // START DEMO`; if(audioEnabled) selectSound(); }
      return;
    }
    if (mode === 'demo') {
      if (key === 'up') { clickSound(); demoMove(0,-6); }
      if (key === 'down') { clickSound(); demoMove(0,6); }
      if (key === 'left') { clickSound(); demoMove(-6,0); }
      if (key === 'right') { clickSound(); demoMove(6,0); }
      if (key === 'a') { selectSound(); inspect(); }
      if (key === 'b') { backSound(); renderMenu(); }
      if (key === 'select') { gameboy.classList.toggle('crt-off'); clickSound(); }
      return;
    }
    if (key === 'b' || key === 'left') { backSound(); renderMenu(); }
  }

  document.querySelectorAll('[data-key]').forEach(btn => {
    btn.addEventListener('pointerdown', e => { e.preventDefault(); handle(btn.dataset.key); });
  });

  document.addEventListener('keydown', e => {
    const map = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', z:'a', Z:'a', x:'b', X:'b', Enter:'start', Shift:'select', Escape:'b' };
    if (map[e.key]) { e.preventDefault(); handle(map[e.key]); }
  });

  screen.addEventListener('click', () => { if (mode === 'boot') return; if (mode !== 'demo') handle('a'); });
  boot();
})();
