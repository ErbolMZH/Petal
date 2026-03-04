/* ===================================
   🌹 Падающие лепестки розы — 8 Марта
   Вставь перед </body>:
   <script src="petals.js"></script>
   =================================== */

(function () {

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&display=swap');

    .petal {
      position: fixed;
      top: -80px;
      pointer-events: none;
      z-index: 99990;
      user-select: none;
      animation: petal-fall linear forwards;
      opacity: 0;
    }

    @keyframes petal-fall {
      0%   { opacity: 0;   transform: translateY(0)     translateX(0)               rotate(0deg)           scale(1);    }
      6%   { opacity: 0.9; }
      50%  {               transform: translateY(50vh)  translateX(var(--sway-mid)) rotate(var(--rot-mid)) scale(0.95); }
      92%  { opacity: 0.7; }
      100% { opacity: 0;   transform: translateY(115vh) translateX(var(--sway))     rotate(var(--rot))     scale(0.8);  }
    }

    .petal-label {
      position: fixed;
      top: -60px;
      pointer-events: none;
      z-index: 99991;
      user-select: none;
      white-space: nowrap;
      font-family: 'Playfair Display', 'Georgia', serif;
      font-style: italic;
      font-size: var(--label-size);
      color: var(--label-color);
      text-shadow:
        0 1px 6px rgba(219, 39, 119, 0.25),
        0 0 12px rgba(253, 164, 175, 0.2);
      opacity: 0;
      animation: label-fall linear forwards;
      letter-spacing: 0.04em;
    }

    @keyframes label-fall {
      0%   { opacity: 0;   transform: translateY(0)     translateX(0)                 rotate(var(--rot-start)) scale(1);    }
      8%   { opacity: 0.7; }
      50%  {               transform: translateY(50vh)  translateX(var(--sway-mid))   rotate(var(--rot-mid))   scale(0.97); }
      90%  { opacity: 0.5; }
      100% { opacity: 0;   transform: translateY(115vh) translateX(var(--sway))       rotate(var(--rot))       scale(0.85); }
    }
  `;
  document.head.appendChild(style);

  // Палитра оттенков лепестка розы
  const COLORS = [
    '#f9a8d4',
    '#f472b6',
    '#ec4899',
    '#fda4af',
    '#fb7185',
    '#fce7f3',
    '#db2777',
  ];

  // Цвета для надписей (нежные, слегка прозрачные)
  const LABEL_COLORS = [
    'rgba(244,114,182,0.72)',
    'rgba(236,72,153,0.65)',
    'rgba(251,113,133,0.68)',
    'rgba(249,168,212,0.75)',
    'rgba(219,39,119,0.60)',
  ];

  let _id = 0;
  function makePetalSVG(color, opacity) {
    const id = 'pg' + (++_id);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 55" width="100%" height="100%">
      <defs>
        <radialGradient id="${id}" cx="40%" cy="30%" r="65%">
          <stop offset="0%"   stop-color="white"   stop-opacity="0.5"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <path d="M20 54 C10 45 2 38 2 26 C2 14 8 4 20 2 C32 4 38 14 38 26 C38 38 30 45 20 54 Z"
            fill="url(#${id})" opacity="${opacity}"/>
      <path d="M20 52 Q18 35 20 4"        stroke="white" stroke-width="0.6" stroke-opacity="0.3" fill="none"/>
      <path d="M20 35 Q14 28 10 20"       stroke="white" stroke-width="0.4" stroke-opacity="0.2" fill="none"/>
      <path d="M20 35 Q26 28 30 20"       stroke="white" stroke-width="0.4" stroke-opacity="0.2" fill="none"/>
    </svg>`;
  }

  function spawnPetal() {
    const wrap = document.createElement('div');
    wrap.className = 'petal';

    const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
    const opacity = 0.75 + Math.random() * 0.25;
    const size    = 22 + Math.random() * 46;
    const left    = Math.random() * 105 - 2;
    const dur     = 6 + Math.random() * 9;
    const delay   = Math.random() * 1.5;
    const swayMid = (Math.random() - 0.5) * 80;
    const sway    = swayMid + (Math.random() - 0.5) * 120;
    const rotMid  = (Math.random() - 0.5) * 180;
    const rot     = rotMid + (Math.random() - 0.5) * 360;

    wrap.style.cssText = `
      left: ${left}vw;
      width: ${size}px;
      height: ${size * 0.45}px;
      --sway-mid: ${swayMid}px;
      --sway: ${sway}px;
      --rot-mid: ${rotMid}deg;
      --rot: ${rot}deg;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      filter: drop-shadow(0 2px 6px rgba(219,39,119,0.2));
    `;

    wrap.innerHTML = makePetalSVG(color, opacity);
    document.body.appendChild(wrap);

    setTimeout(() => wrap.remove(), (dur + delay) * 1000 + 400);
  }

  function spawnLabel() {
    const el = document.createElement('div');
    el.className = 'petal-label';
    el.textContent = 'С 8 Марта';

    const color    = LABEL_COLORS[Math.floor(Math.random() * LABEL_COLORS.length)];
    const size     = 11 + Math.random() * 7;           // 11–18px — меньше лепестков
    const left     = Math.random() * 100;
    const dur      = 8 + Math.random() * 9;            // чуть медленнее — плавнее
    const delay    = Math.random() * 2;
    const swayMid  = (Math.random() - 0.5) * 60;
    const sway     = swayMid + (Math.random() - 0.5) * 100;
    const rotStart = (Math.random() - 0.5) * 20;       // лёгкий начальный наклон
    const rotMid   = rotStart + (Math.random() - 0.5) * 25;
    const rot      = rotMid   + (Math.random() - 0.5) * 30;

    el.style.cssText = `
      left: ${left}vw;
      --label-size: ${size}px;
      --label-color: ${color};
      --sway-mid: ${swayMid}px;
      --sway: ${sway}px;
      --rot-start: ${rotStart}deg;
      --rot-mid: ${rotMid}deg;
      --rot: ${rot}deg;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay) * 1000 + 400);
  }

  // Начальный залп лепестков
  for (let i = 0; i < 14; i++) {
    setTimeout(spawnPetal, Math.random() * 3500);
  }

  // Начальная пара надписей
  for (let i = 0; i < 2; i++) {
    setTimeout(spawnLabel, 1500 + Math.random() * 4000);
  }

  // Постоянный поток лепестков
  setInterval(spawnPetal, 550);

  // Редкие надписи — примерно 1 на каждые ~11 лепестков
  setInterval(spawnLabel, 6000 + Math.random() * 2000);

})();