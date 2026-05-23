/* ================================================
   BIRTHDAY WEBSITE — script.js  (v3)
   Flow: Counter → Cake (4-tier, orb rings, burst)
         → Countdown → Card + Song → Gallery → Video Surprise
   ================================================ */

const $    = id  => document.getElementById(id);
const sleep = ms => new Promise(res => setTimeout(res, ms));

let carouselIndex = 0;
const TOTAL_SLIDES = 3;

/* ================================================
   PARTICLE CANVAS — background stars/glitter
   ================================================ */
(function initParticleCanvas() {
  const canvas = $('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 160; i++) {
    particles.push({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.9 + 0.2,
      speed: Math.random() * 0.00018 + 0.00004,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.045 + 0.01,
      color: ['#ffffff','#ffd700','#ff69b4','#b44fff','#00e5ff','#ffffff'][Math.floor(Math.random()*6)],
      opacity: Math.random() * 0.75 + 0.25,
    });
  }

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.twinkle += p.twinkleSpeed;
      p.x += p.speed;
      if (p.x > 1) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * (0.5 + 0.5 * Math.sin(p.twinkle));
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();
})();

/* ================================================
   FLOATING OPENING EMOJI PARTICLES
   ================================================ */
function spawnFloatingParticles() {
  const container = $('floatingParticles');
  const emojis = ['✨','💖','⭐','🌟','💫','🎉','🎊','💎','🔮','🌸'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'fp-item';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left    = Math.random() * 100 + 'vw';
    el.style.bottom  = '-60px';
    el.style.fontSize = (16 + Math.random() * 20) + 'px';
    const dur = 6 + Math.random() * 8;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = (Math.random() * dur) + 's';
    container.appendChild(el);
  }
}

/* ================================================
   FLOATING DUMBBELLS
   ================================================ */
function spawnDumbbells() {
  const layer = $('dumbbellLayer');
  const items = ['🏋️','💪','🥊','🔥','⚡','🏋️‍♀️'];
  for (let i = 0; i < 10; i++) {
    const el = document.createElement('div');
    el.className = 'db-item';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (14 + Math.random() * 14) + 'px';
    const dur = 14 + Math.random() * 22;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = (Math.random() * dur) + 's';
    layer.appendChild(el);
  }
}

/* ================================================
   CONFETTI HELPERS
   ================================================ */
function burstConfetti(opts = {}) {
  confetti({
    particleCount: 120, spread: 80, origin: { y: 0.5 },
    colors: ['#ff2d78','#ffd700','#b44fff','#ff69b4','#ffffff','#ffaa00'],
    startVelocity: 40, ticks: 200,
    ...opts,
  });
}

function bigExplosion() {
  [{ x:.2,y:.6 },{ x:.5,y:.5 },{ x:.8,y:.6 },{ x:.1,y:.3 },{ x:.9,y:.3 }]
    .forEach((o, i) => setTimeout(() => confetti({
      particleCount: 110, spread: 110, origin: o,
      colors: ['#ff2d78','#ffd700','#b44fff','#ff69b4','#ffffff'],
      startVelocity: 55, ticks: 320, shapes: ['circle','square'],
    }), i * 110));
}

function massiveConfetti() {
  let n = 0;
  const iv = setInterval(() => {
    burstConfetti({
      particleCount: 90, spread: 130,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      startVelocity: 65,
    });
    if (++n > 9) clearInterval(iv);
  }, 180);
}

/* ================================================
   SCREEN SHAKE
   ================================================ */
function screenShake() {
  document.body.classList.add('shaking');
  setTimeout(() => document.body.classList.remove('shaking'), 700);
}

/* ================================================
   ORB RINGS around cake
   Concentric spinning rings with glowing dots
   ================================================ */
function buildOrbRings() {
  const container = $('orbRings');
  const rings = [
    { size: 220, color: '#ff2d78',  dur: 5,  dotSize: 9  },
    { size: 300, color: '#ffd700',  dur: 8,  dotSize: 7  },
    { size: 380, color: '#b44fff',  dur: 12, dotSize: 6  },
    { size: 460, color: '#00e5ff',  dur: 18, dotSize: 5  },
  ];

  rings.forEach(({ size, color, dur, dotSize }) => {
    // Main ring element
    const ring = document.createElement('div');
    ring.className = 'orb-ring';
    ring.style.cssText = `
      width:${size}px; height:${size}px;
      border-color:${color}22;
      border-style:solid; border-width:1px;
      animation-duration:${dur}s;
      color:${color};
    `;

    // Multiple dots evenly spread around the ring
    const dotCount = Math.round(size / 55);
    for (let d = 0; d < dotCount; d++) {
      const dot = document.createElement('div');
      const angleDeg = (360 / dotCount) * d;
      const rad = angleDeg * Math.PI / 180;
      const r   = size / 2;
      dot.style.cssText = `
        position:absolute;
        width:${dotSize}px; height:${dotSize}px;
        border-radius:50%;
        background:${color};
        box-shadow:0 0 ${dotSize * 2}px ${dotSize}px ${color}88;
        top:50%; left:50%;
        transform:translate(-50%,-50%)
          translate(${Math.cos(rad)*r}px, ${Math.sin(rad)*r}px);
        animation:orbDotPulse ${1.2 + Math.random()}s ease-in-out infinite alternate;
        animation-delay:${d * 0.15}s;
      `;
      ring.appendChild(dot);
    }
    container.appendChild(ring);
  });
}

// CSS for dot pulse (injected once)
const orbStyle = document.createElement('style');
orbStyle.textContent = `
  @keyframes orbDotPulse {
    0%   { opacity:.4; transform:translate(-50%,-50%) translate(var(--ox,0px),var(--oy,0px)) scale(.7); }
    100% { opacity:1;  transform:translate(-50%,-50%) translate(var(--ox,0px),var(--oy,0px)) scale(1.2); }
  }
`;
document.head.appendChild(orbStyle);

/* ================================================
   CAKE BURST PARTICLES (explode from cake on rise)
   ================================================ */
function cakeBurst() {
  const layer = $('cakeBurstLayer');
  const stars = ['✨','⭐','💖','🌟','💫','★','✦','✧'];
  for (let i = 0; i < 28; i++) {
    const el   = document.createElement('div');
    el.className = 'burst-star';
    el.textContent = stars[Math.floor(Math.random() * stars.length)];
    const angle = Math.random() * 360;
    const dist  = 90 + Math.random() * 160;
    el.style.setProperty('--bx', Math.cos(angle * Math.PI/180) * dist + 'px');
    el.style.setProperty('--by', Math.sin(angle * Math.PI/180) * dist + 'px');
    el.style.animationDuration = (0.9 + Math.random() * 0.8) + 's';
    el.style.animationDelay    = (Math.random() * 0.4) + 's';
    el.style.fontSize = (14 + Math.random() * 14) + 'px';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

/* ================================================
   SPARKLE FIELD (orbiting the cake)
   ================================================ */
function spawnSparkles() {
  const field = $('sparkleField');
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const angle = Math.random() * 360;
    const dist  = 60 + Math.random() * 240;
    s.style.left = '50%'; s.style.top = '55%';
    s.style.setProperty('--tx', Math.cos(angle * Math.PI/180) * dist + 'px');
    s.style.setProperty('--ty', Math.sin(angle * Math.PI/180) * dist + 'px');
    const dur = 2 + Math.random() * 3.5;
    s.style.animationDuration = dur + 's';
    s.style.animationDelay   = (Math.random() * dur) + 's';
    // Alternate colours
    const cols = ['#ffd700','#ff69b4','#b44fff','#00e5ff','#ffffff'];
    s.style.background = cols[Math.floor(Math.random() * cols.length)];
    s.style.boxShadow  = `0 0 6px 2px ${s.style.background}88`;
    s.style.width  = (4 + Math.random() * 5) + 'px';
    s.style.height = s.style.width;
    field.appendChild(s);
  }
}

/* ================================================
   BLOW CANDLES
   ================================================ */
function blowCandles() {
  document.querySelectorAll('.flame').forEach(f => f.classList.add('off'));
  $('smokeContainer').classList.add('visible');
}

/* ================================================
   HAPPY BIRTHDAY MELODY — Web Audio API
   ================================================ */
let audioCtx   = null;
let songStopped = false;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playNote(ctx, freq, start, dur, vol = 0.36) {
  if (songStopped) return;
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(vol,  ctx.currentTime + start + 0.04);
  gain.gain.setValueAtTime(vol,            ctx.currentTime + start + dur - 0.07);
  gain.gain.linearRampToValueAtTime(0,     ctx.currentTime + start + dur);
  osc.start(ctx.currentTime + start);
  osc.stop( ctx.currentTime + start + dur + 0.05);
}

function playHappyBirthday() {
  songStopped = false;
  const ctx = getAudioCtx();
  const N = {
    C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392.00,A4:440.00,
    C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,
  };
  const Q=0.42, H=Q*2, DH=Q*3, E=Q/2, DQ=Q*1.5;
  const verse=[
    [N.C4,DQ],[N.C4,E],[N.D4,Q],[N.C4,Q],[N.F4,Q],[N.E4,H],
    [N.C4,DQ],[N.C4,E],[N.D4,Q],[N.C4,Q],[N.G4,Q],[N.F4,H],
    [N.C4,DQ],[N.C4,E],[N.C5,Q],[N.A4,Q],[N.F4,Q],[N.E4,Q],[N.D4,Q],
    [N.A4,DQ],[N.A4,E],[N.A4,Q],[N.F4,Q],[N.G4,Q],[N.F4,DH],
  ];
  let t = 0.3;
  verse.forEach(([f,d])=>{ if(f>0) playNote(ctx,f,t,d*0.92,0.35); t+=d; });
  const SHIFT=4/3; t+=0.3;
  verse.forEach(([f,d])=>{ if(f>0) playNote(ctx,f*SHIFT,t,d*0.92,0.40); t+=d; });
  // Flourish
  t+=0.2;
  [[N.C5,E],[N.E5,E],[N.G5,E],[N.C5*SHIFT,H]].forEach(([f,d])=>{
    if(f>0) playNote(ctx,f,t,d,0.3); t+=d;
  });
}

function stopSong() {
  songStopped = true;
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
}

/* ================================================
   BIRTHDAY CARD POPUP
   ================================================ */
async function showCard() {
  const overlay = $('cardOverlay');
  overlay.classList.remove('hidden');
  await sleep(50);
  overlay.classList.add('visible');
  playHappyBirthday(); // 🎵 play birthday song
}

$('closeCard').addEventListener('click', async () => {
  stopSong();
  const overlay = $('cardOverlay');
  overlay.classList.remove('visible');
  await sleep(600);
  overlay.classList.add('hidden');

  // Show gallery
  const gallery = $('gallerySection');
  gallery.classList.remove('hidden');
  gallery.style.opacity = '0';
  gallery.style.transition = 'opacity 1s ease';
  await sleep(50);
  gallery.style.opacity = '1';

  startFloatingHearts(4, 8000);
});

/* ================================================
   COUNTDOWN 3 → 2 → 1
   ================================================ */
async function runCountdown() {
  const overlay = $('countdownOverlay');
  const numEl   = $('countdownNumber');
  overlay.classList.add('visible');

  for (let n = 3; n >= 1; n--) {
    numEl.style.animation = 'none';
    void numEl.offsetWidth; // reflow to restart animation
    numEl.style.animation = '';
    numEl.textContent = n;
    await sleep(1000);
  }

  overlay.classList.remove('visible');
  blowCandles();
  await sleep(400);
  bigExplosion();
  screenShake();
  await sleep(800);
  massiveConfetti();
  await sleep(1400);
  await showCard();
}

/* ================================================
   MAIN CINEMATIC FLOW
   ================================================ */
async function runOpeningCounter() {
  spawnFloatingParticles();
  spawnDumbbells();

  const counterEl  = $('mainCounter');
  const openScreen = $('openingScreen');

  for (let i = 0; i <= 19; i++) {
    counterEl.textContent = i;
    counterEl.classList.remove('pop');
    void counterEl.offsetWidth;
    counterEl.classList.add('pop');

    if (i > 0 && i % 5 === 0) {
      burstConfetti({ particleCount:40, spread:60, origin:{y:.4}, startVelocity:25 });
    }

    let delay = i < 10 ? 180 : i < 16 ? 250 : i < 18 ? 400 : i === 18 ? 600 : 950;
    await sleep(delay);
  }

  // 19 hit — big moment
  bigExplosion();
  screenShake();
  await sleep(400);
  massiveConfetti();

  // Fade out opening
  openScreen.style.transition = 'opacity 0.9s ease';
  openScreen.style.opacity = '0';
  openScreen.style.pointerEvents = 'none';
  await sleep(900);
  openScreen.classList.remove('active');

  // Fade in cake screen
  const cakeScreen = $('cakeScreen');
  cakeScreen.classList.add('active');

  // Build orb rings & sparkles
  buildOrbRings();
  spawnSparkles();
  await sleep(400);

  // Rise cake with burst
  $('cakeWrapper').classList.add('risen');
  await sleep(600);
  cakeBurst();

  await sleep(900);

  // Show wish text (high above cake)
  $('wishText').classList.add('visible');
  await sleep(2000);

  // Countdown
  await runCountdown();
}

/* ================================================
   CAROUSEL
   ================================================ */
function initCarousel() {
  const track = $('carouselTrack');
  const dotsC = $('carouselDots');

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsC.appendChild(dot);
  }

  function goTo(idx) {
    carouselIndex = (idx + TOTAL_SLIDES) % TOTAL_SLIDES;
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i === carouselIndex));
  }

  $('prevBtn').addEventListener('click', () => goTo(carouselIndex - 1));
  $('nextBtn').addEventListener('click', () => goTo(carouselIndex + 1));
  setInterval(() => goTo(carouselIndex + 1), 4000);
}

/* ================================================
   FLOATING HEARTS
   ================================================ */
function startFloatingHearts(count = 6, interval = 2000) {
  const layer  = $('heartsLayer');
  const hearts = ['❤️','💖','💗','💓','💞','💕','🌸'];

  const spawn = () => {
    for (let i = 0; i < count; i++) {
      const h = document.createElement('div');
      h.className = 'heart-float';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.bottom = '-60px';
      h.style.fontSize = (18 + Math.random() * 22) + 'px';
      const dur = 5 + Math.random() * 5;
      h.style.animationDuration = dur + 's';
      h.style.animationDelay   = Math.random() + 's';
      layer.appendChild(h);
      setTimeout(() => h.remove(), (dur + 2) * 1000);
    }
  };

  spawn();
  return setInterval(spawn, interval);
}

/* ================================================
   VIDEO POPUP
   ================================================ */
function openVideoPopup() {
  const overlay = $('videoOverlay');
  const video   = $('surpriseVideo');
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      // Auto-play the video
      video.currentTime = 0;
      video.play().catch(() => {}); // silently ignore if autoplay blocked
    });
  });
}

function closeVideoPopup() {
  const overlay = $('videoOverlay');
  const video   = $('surpriseVideo');
  video.pause();
  overlay.classList.remove('visible');
  setTimeout(() => overlay.classList.add('hidden'), 500);
}

$('closeVideo').addEventListener('click', closeVideoPopup);

// Close on backdrop click
$('videoOverlay').addEventListener('click', (e) => {
  if (e.target === $('videoOverlay')) closeVideoPopup();
});

/* ================================================
   SURPRISE BUTTON
   ================================================ */
$('surpriseBtn').addEventListener('click', async () => {
  // Confetti explosion
  massiveConfetti();
  await sleep(200);
  confetti({
    particleCount: 220, spread: 170,
    origin: { y: 0.6 },
    colors: ['#ff2d78','#ffd700','#b44fff','#ff69b4','#ffffff','#00ffff'],
    startVelocity: 75, ticks: 420, shapes: ['star'],
  });

  // Hearts
  startFloatingHearts(14, 99999);
  setTimeout(() => { $('heartsLayer').innerHTML = ''; }, 8000);

  // Background flash
  $('gallerySection').classList.add('surprise-flash');
  setTimeout(() => $('gallerySection').classList.remove('surprise-flash'), 1800);

  screenShake();

  await sleep(500);
  burstConfetti({ particleCount:150, spread:120, origin:{x:.15,y:.3}, startVelocity:55, shapes:['circle'] });
  burstConfetti({ particleCount:150, spread:120, origin:{x:.85,y:.3}, startVelocity:55, shapes:['circle'] });

  // Open video popup after brief fireworks
  await sleep(900);
  openVideoPopup();
});

/* ================================================
   SUBTLE MOUSE PARALLAX
   ================================================ */
document.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth  - 0.5) * 18;
  const my = (e.clientY / window.innerHeight - 0.5) * 18;
  $('particleCanvas').style.transform = `translate(${mx * 0.28}px, ${my * 0.28}px)`;
});

/* ================================================
   BOOT
   ================================================ */
initCarousel();
window.addEventListener('load', () => setTimeout(runOpeningCounter, 600));
