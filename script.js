const boot=document.querySelector('#boot'),site=document.querySelector('#site'),start=document.querySelector('#start'),skip=document.querySelector('#skip'),menu=document.querySelector('#menu'),nav=document.querySelector('#nav');
let timer;function ready(){start.disabled=false;document.querySelector('.boot-message').textContent='Ready to play!';boot.classList.remove('boot-loading')}
function showBoot(){site.classList.add('hidden');boot.classList.remove('hidden');start.disabled=true;document.querySelector('.boot-message').textContent='Getting things ready...';const bar=document.querySelector('.boot-load span');bar.style.animation='none';void bar.offsetWidth;bar.style.animation='';clearTimeout(timer);timer=setTimeout(ready,window.matchMedia('(prefers-reduced-motion: reduce)').matches?100:2500)}
function enter(){clearTimeout(timer);boot.classList.add('hidden');site.classList.remove('hidden');sessionStorage.setItem('mncBooted','1');window.scrollTo(0,0)}
start.addEventListener('click',enter);skip.addEventListener('click',enter);
document.addEventListener('keydown',e=>{if(!boot.classList.contains('hidden')&&['Enter',' '].includes(e.key)&&!e.repeat){if(!start.disabled){e.preventDefault();enter()}}});
document.querySelector('#reboot').addEventListener('click',()=>{sessionStorage.removeItem('mncBooted');nav.classList.remove('open');menu.setAttribute('aria-expanded','false');showBoot()});
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));document.querySelector('#year').textContent=new Date().getFullYear();if(sessionStorage.getItem('mncBooted')==='1')enter();else showBoot();

// Caption-free development gallery: advances every 3 seconds, supports swipe and dots.
(()=>{const viewport=document.querySelector('#development-gallery');if(!viewport)return;const track=viewport.querySelector('.gallery-track');const slides=[...track.children];const dots=[...document.querySelectorAll('.gallery-dots button')];let current=0,interval,touchStart=null;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');function go(index){current=(index+slides.length)%slides.length;track.style.transform=`translateX(-${current*100}%)`;dots.forEach((dot,i)=>{dot.classList.toggle('active',i===current);if(i===current)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')})}function stop(){clearInterval(interval)}function play(){stop();if(!reduced.matches)interval=setInterval(()=>go(current+1),3000)}dots.forEach((dot,i)=>dot.addEventListener('click',()=>{go(i);play()}));viewport.addEventListener('touchstart',e=>{touchStart=e.touches[0].clientX;stop()},{passive:true});viewport.addEventListener('touchend',e=>{if(touchStart!==null){const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>40)go(current+(delta<0?1:-1));touchStart=null}play()},{passive:true});viewport.addEventListener('mouseenter',stop);viewport.addEventListener('mouseleave',play);viewport.addEventListener('focusin',stop);viewport.addEventListener('focusout',play);document.addEventListener('visibilitychange',()=>document.hidden?stop():play());reduced.addEventListener?.('change',play);go(0);play()})();

// Retro UI audio: opt-in, synthesized locally using Web Audio (no external audio assets).
(()=>{const toggle=document.querySelector('#sound-toggle');let ctx=null,enabled=false;function beep(freq=520,duration=.07,type='square',volume=.022){if(!enabled)return;try{ctx??=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();const osc=ctx.createOscillator(),gain=ctx.createGain(),now=ctx.currentTime;osc.type=type;osc.frequency.setValueAtTime(freq,now);gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.001,now+duration);osc.connect(gain).connect(ctx.destination);osc.start(now);osc.stop(now+duration)}catch(e){}}
function melody(){[392,523,659].forEach((f,i)=>setTimeout(()=>beep(f,.12,'triangle',.035),i*105))}
toggle.addEventListener('click',()=>{enabled=!enabled;toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'♫ SOUND ON':'♫ SOUND OFF';if(enabled)melody()});
document.addEventListener('pointerover',e=>{if(e.target.closest('a,button,.game-card'))beep(420,.025,'sine',.008)});
document.addEventListener('click',e=>{if(e.target.closest('a,button')){beep(660,.055);if(e.target.closest('#start,#reboot'))setTimeout(melody,80)}});
})();

/* To connect the live player, enter the public KICK channel username below.
   This is a setup note for maintainers and is not shown on the website. */
const KICK_CHANNEL = '';
(function configureKickStream(){
  const username = KICK_CHANNEL.trim().replace(/^@/, '');
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return;
  const frame = document.getElementById('stream-frame');
  const iframe = document.createElement('iframe');
  iframe.src = 'https://player.kick.com/' + encodeURIComponent(username);
  iframe.title = 'MENOCLONE GAMING live stream on KICK';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  iframe.allowFullscreen = true;
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.replaceChildren(iframe);
  document.getElementById('kick-channel-link').href = 'https://kick.com/' + encodeURIComponent(username);
})();
