// Portada: el minero pica oro y los animales de la Serranía de San Lucas cuentan datos al tocarlos
(() => {
  const mina = document.getElementById("mina"), minero = document.getElementById("minero"), dato = document.getElementById("dato"), oro = document.getElementById("oro");
  if (!mina || !minero) return;
  const ANIMALES = {
    jaguar: "🐆 <b>Jaguar</b>: el felino más grande de América recorre los bosques de la Serranía de San Lucas. ¡Grrr!",
    mono: "🐒 <b>Mono araña café</b>: está en peligro crítico y aún vive en los bosques del Sur de Bolívar. Usa la cola como una quinta mano.",
    paujil: "🐦 <b>Paujil de pico azul</b>: ave que solo existe en Colombia y está en peligro crítico. La Serranía de San Lucas es uno de sus refugios.",
    teta: "⛰️ <b>Teta de San Lucas</b>: el cerro que es orgullo de la Serranía de San Lucas y del Sur de Bolívar."
  };
  const FRASES = [
    "¡Toc, toc! En el Sur de Bolívar el oro se saca con berraquera. ⛏️",
    "La minería es tradición de muchas familias del Sur de Bolívar.",
    "¡Rumbo a la Teta de San Lucas, con el carrito lleno! 🛒",
    "Desde la mina hasta tu vereda: en <b>J&amp;P del Sur</b> te llevamos lo que necesitas. 🚚"
  ];
  let f = 0, pepitas = 0, t;
  const quitarPausa = () => mina.classList.remove("pausa");

  function decir(html, el, ms = 6500) {
    dato.innerHTML = html;
    const m = mina.getBoundingClientRect(), r = el.getBoundingClientRect(), w = dato.offsetWidth;
    const cx = r.left + r.width / 2 - m.left;
    const left = Math.max(4, Math.min(cx - 40, m.width - w - 4));
    dato.style.left = left + "px";
    dato.style.bottom = (m.bottom - r.top + 10) + "px";
    dato.style.setProperty("--px", Math.max(12, Math.min(cx - left - 6, w - 24)) + "px");
    dato.classList.add("on");
    clearTimeout(t); t = setTimeout(() => { dato.classList.remove("on"); quitarPausa(); }, ms);
  }
  const punto = (el, fx, fy) => { const m = mina.getBoundingClientRect(), r = el.getBoundingClientRect(); return [r.left - m.left + r.width * fx, r.top - m.top + r.height * fy]; };
  const efecto = (cls, x, y, vars) => { const s = document.createElement("span"); s.className = cls; s.style.left = x + "px"; s.style.top = y + "px"; for (const k in vars) s.style.setProperty(k, vars[k]); mina.append(s); setTimeout(() => s.remove(), 2300); return s; };

  function confeti() {
    const cols = ["#e3b23c", "#f2c84b", "#fff3b0", "#d9a441", "#ffffff"], w = mina.offsetWidth;
    for (let i = 0; i < 36; i++) { const s = efecto("confeti", Math.random() * w, -10, { "--dx": (Math.random() * 80 - 40) + "px" }); s.style.background = cols[i % cols.length]; s.style.animationDelay = Math.random() * .4 + "s"; }
  }

  minero.addEventListener("click", () => {
    mina.classList.add("pausa");
    minero.classList.remove("golpe"); void minero.offsetWidth; minero.classList.add("golpe");
    for (let g = 0; g < 3; g++) setTimeout(() => {
      const [x, y] = punto(minero, .2, .92);
      for (let i = 0; i < 5; i++) efecto("chispa", x, y, { "--dx": (Math.random() * 30 - 15) + "px", "--dy": (-Math.random() * 22 - 4) + "px" });
      const [cx] = punto(minero, .72, .4);
      efecto("pepita", x, y - 6, { "--dx": (cx - x) + "px" });
    }, 220 + g * 360);
    pepitas++;
    oro.hidden = false; oro.querySelector("b").textContent = pepitas; oro.classList.remove("pop"); void oro.offsetWidth; oro.classList.add("pop");
    let msg = FRASES[f++ % FRASES.length];
    if (pepitas === 5) msg = "¡Vas muy bien, minero! Ya llevas <b>5 pepitas</b>. ✨";
    if (pepitas === 10) { msg = "🏅 ¡Ya eres un verdadero <b>minero del Sur de Bolívar</b>! 10 pepitas de oro."; confeti(); }
    decir(msg, minero);
  });

  mina.querySelectorAll("[data-k]").forEach(el => el.addEventListener("click", () => {
    el.classList.remove("activo"); void el.offsetWidth; el.classList.add("activo");
    setTimeout(() => el.classList.remove("activo"), 2000);
    decir(ANIMALES[el.dataset.k], el, 7500);
  }));

  setTimeout(() => { if (!dato.classList.contains("on")) decir("¡Hola! Tócame para picar oro, y toca los animales de la Serranía ⛏️🐆", minero, 4500); }, 2500);
})();
