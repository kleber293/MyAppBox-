// ==== COSMOS CANVAS ====
const canvas = document.getElementById('cosmosCanvas');
const ctx = canvas.getContext('2d');

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initStars();
});

let mouse = { x: W / 2, y: H / 2 };
document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// --- Estrelas ---
const STAR_COUNT = 180;
let stars = [];

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color: ['#a5b4fc','#c4b5fd','#93c5fd','#ffffff'][Math.floor(Math.random()*4)]
    });
  }
}
initStars();

// --- Nebulosas ---
const nebulae = [
  { x: 0.15, y: 0.2,  r: 320, c: 'rgba(124,83,255,0.07)'  },
  { x: 0.8,  y: 0.75, r: 280, c: 'rgba(167,139,250,0.06)' },
  { x: 0.5,  y: 0.5,  r: 200, c: 'rgba(56,189,248,0.05)'  },
  { x: 0.9,  y: 0.1,  r: 180, c: 'rgba(99,102,241,0.06)'  },
];

// --- Shooting stars ---
let shooters = [];
function spawnShooter() {
  shooters.push({
    x: Math.random() * W,
    y: Math.random() * H * 0.5,
    len: Math.random() * 120 + 60,
    speed: Math.random() * 8 + 5,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
    alpha: 1,
    life: 1
  });
}
setInterval(spawnShooter, 2800);

// --- Draw cosmos ---
function drawCosmos() {
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  nebulae.forEach(n => {
    const grd = ctx.createRadialGradient(n.x*W, n.y*H, 0, n.x*W, n.y*H, n.r);
    grd.addColorStop(0, n.c);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(n.x*W, n.y*H, n.r, 0, Math.PI*2);
    ctx.fill();
  });

  const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
  mg.addColorStop(0, 'rgba(124,131,255,0.06)');
  mg.addColorStop(1, 'transparent');
  ctx.fillStyle = mg;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI*2);
  ctx.fill();

  stars.forEach(s => {
    s.alpha += s.twinkleSpeed * s.twinkleDir;
    if (s.alpha >= 0.95 || s.alpha <= 0.1) s.twinkleDir *= -1;

    const dx = (mouse.x / W - 0.5) * s.speed * 18;
    const dy = (mouse.y / H - 0.5) * s.speed * 18;

    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = s.color;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = s.r * 3;
    ctx.beginPath();
    ctx.arc(s.x + dx, s.y + dy, s.r, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  });

  shooters = shooters.filter(s => s.life > 0);
  shooters.forEach(s => {
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.life -= 0.018;
    s.alpha = s.life;

    const tx = s.x - Math.cos(s.angle) * s.len;
    const ty = s.y - Math.sin(s.angle) * s.len;
    const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, `rgba(200,210,255,${s.alpha})`);

    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();
    ctx.restore();
  });

  requestAnimationFrame(drawCosmos);
}
drawCosmos();


// ==== TRILHA SUTIL DO MOUSE ====
const TRAIL_MAX = 60;       // mais pontos = rastro mais longo e suave
const FADE_SPEED = 0.025;   // fade mais lento para suavidade
const MIN_DIST = 3;         // distância mínima entre pontos (interpola se maior)
const trail = [];

const trailColors = ['#a5b4fc', '#c4b5fd', '#818cf8'];

let lastMouse = null;

document.addEventListener('mousemove', (e) => {
  const nx = e.clientX, ny = e.clientY;

  if (lastMouse) {
    const dx = nx - lastMouse.x;
    const dy = ny - lastMouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Interpola pontos intermediários para preencher gaps em movimentos rápidos
    if (dist > MIN_DIST) {
      const steps = Math.ceil(dist / MIN_DIST);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        trail.push({
          x: lastMouse.x + dx * t,
          y: lastMouse.y + dy * t,
          opacity: 1.0
        });
        if (trail.length > TRAIL_MAX) trail.shift();
      }
    }
  } else {
    trail.push({ x: nx, y: ny, opacity: 1.0 });
  }

  lastMouse = { x: nx, y: ny };
});

const trailCanvas = document.createElement('canvas');
trailCanvas.style.cssText = 'position:fixed;inset:0;z-index:9997;pointer-events:none;';
trailCanvas.width  = window.innerWidth;
trailCanvas.height = window.innerHeight;
document.body.appendChild(trailCanvas);
const tctx = trailCanvas.getContext('2d');

window.addEventListener('resize', () => {
  trailCanvas.width  = window.innerWidth;
  trailCanvas.height = window.innerHeight;
});

function drawTrail() {
  tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  // Fade out todos os pontos a cada frame
  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].opacity -= FADE_SPEED;
  }

  // Remove pontos totalmente transparentes
  while (trail.length > 0 && trail[0].opacity <= 0) trail.shift();

  if (trail.length > 1) {
    // Desenha como um path contínuo suavizado com quadraticCurveTo
    for (let i = 1; i < trail.length; i++) {
      const t = i / trail.length;
      const prev = trail[i - 1];
      const curr = trail[i];

      const pointOpacity = Math.max(0, curr.opacity);
      const alpha = t * 0.38 * pointOpacity;
      const width = t * 2.2 + 0.4;
      const color = trailColors[Math.floor(t * trailColors.length) % trailColors.length];

      if (alpha <= 0) continue;

      tctx.save();
      tctx.globalAlpha = alpha;
      tctx.strokeStyle = color;
      tctx.lineWidth = width;
      tctx.shadowColor = color;
      tctx.shadowBlur = 5;
      tctx.lineCap = 'round';
      tctx.lineJoin = 'round';
      tctx.beginPath();
      // Ponto médio para curva suave
      const mx = (prev.x + curr.x) / 2;
      const my = (prev.y + curr.y) / 2;
      tctx.moveTo(prev.x, prev.y);
      tctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      tctx.stroke();
      tctx.restore();
    }
  }

  requestAnimationFrame(drawTrail);
}
drawTrail();  


// ==== GLOW INTERNO NOS CARDS ====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});


// ==== EFEITO 3D TILT ====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-4px) scale(1.02) rotateX(${-dy*8}deg) rotateY(${dx*8}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});


// ==== RIPPLE EFFECT ====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width  = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});


// ==== ANIMAÇÃO STAGGER ====
const cards = document.querySelectorAll('.card');
cards.forEach((card, i) => {
  card.style.animationDelay = `${0.04 * i + 0.3}s`;
});


// ==== BUSCA ====
const searchInput = document.getElementById('searchInput');
const clearBtn    = document.getElementById('clearBtn');
const noResults   = document.getElementById('noResults');
const searchTerm  = document.getElementById('searchTerm');
let activeFilter  = 'all';

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const name     = card.dataset.name.toLowerCase();
    const category = card.dataset.category;
    const matchSearch   = name.includes(query);
    const matchCategory = activeFilter === 'all' || category === activeFilter;
    if (matchSearch && matchCategory) { card.classList.remove('hidden'); visible++; }
    else card.classList.add('hidden');
  });
  noResults.classList.toggle('visible', visible === 0);
  if (visible === 0) searchTerm.textContent = searchInput.value;
  clearBtn.classList.toggle('visible', query.length > 0);
}

searchInput.addEventListener('input', filterCards);
clearBtn.addEventListener('click', () => { searchInput.value = ''; filterCards(); searchInput.focus(); });

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) { e.preventDefault(); searchInput.focus(); }
  if (e.key === 'Escape') { searchInput.blur(); searchInput.value = ''; filterCards(); }
});


// ==== FILTROS ====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    filterCards();
  });
});
