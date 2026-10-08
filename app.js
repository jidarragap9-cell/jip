(() => {
  const T = window.TIENDA;
  const $ = id => document.getElementById(id);
  const fmt = n => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

  const ICON = {
    todos: '<rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/>',
    tecnologia: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
    celulares: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
    herramientas: '<path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2 2 0 0 1-3-3z"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>',
    hogar: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    ropa: '<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
    calzado: '<path d="M3 16c0-3 1-7 3-9l4 3c2 1 5 2 8 3 2 .5 3 2 3 3v2H3z"/>',
    perfumeria: '<rect x="6" y="9" width="12" height="12" rx="2"/><path d="M10 9V6h4v3M12 3v3"/>',
    electrodomesticos: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 9h14M9 6h.01"/>',
    belleza: '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z"/>',
    "ofertas de hoy": '<path d="M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8 0 4 3 7 7 7z"/>',
    "por encargo": '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
    otros: '<circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'
  };
  const icon = c => ICON[norm(c)] || ICON.otros;

  // ---------- CSV ----------
  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') q = false;
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim()));
  }
  const num = v => Number(String(v || "").replace(/[^\d.,]/g, "").replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", ".")) || 0;
  const si = v => ["si", "sí", "x", "true", "1", "yes"].includes(norm(v));

  // Enlaces de Google Drive → imagen o video que se puede mostrar
  const driveId = u => (u.match(/[?&]id=([\w-]+)/) || u.match(/\/d\/([\w-]+)/) || [])[1];
  const toImg = u => { const id = /drive\.google\.com/.test(u) && driveId(u); return id ? `https://lh3.googleusercontent.com/d/${id}=w1000` : u; };
  function toVideo(u) {
    if (!u) return "";
    const yt = u.match(/(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const id = /drive\.google\.com/.test(u) && driveId(u);
    return id ? `https://drive.google.com/file/d/${id}/preview` : "";
  }

  function toProducts(rows) {
    const head = rows.shift().map(norm);
    const col = (...keys) => head.findIndex(h => keys.some(k => h.includes(k)));
    const c = {
      nombre: col("nombre", "producto"), precio: head.findIndex(h => h.startsWith("precio") && !h.includes("antes")),
      antes: col("antes", "anterior"), cat: head.findIndex(h => h.startsWith("categor")), sub: col("subcat"), specs: col("caracter", "especific", "descrip"),
      fotos: col("foto", "imagen"), video: col("video"), peso: col("peso"), dest: col("destac", "ganador"), ocultar: col("ocultar", "agotado"), enc: col("encargo"), gar: col("garant"), tallas: col("talla"), cod: col("codigo")
    };
    const g = (r, k) => (c[k] >= 0 ? (r[c[k]] || "").trim() : "");
    return rows.map((r, i) => ({
      id: i,
      nombre: g(r, "nombre"),
      precio: num(g(r, "precio")),
      antes: num(g(r, "antes")),
      cat: g(r, "cat") || "Otros",
      sub: g(r, "sub"),
      specs: g(r, "specs").split(/\n|;|•/).map(s => s.trim()).filter(Boolean),
      fotos: g(r, "fotos").split(/[\s,]+/).filter(u => /^(https?:|img\/)/.test(u)).map(toImg),
      video: toVideo(g(r, "video")),
      peso: num(g(r, "peso")) || 1,
      dest: si(g(r, "dest")),
      ocultar: si(g(r, "ocultar")),
      enc: si(g(r, "enc")),
      gar: g(r, "gar"),
      cod: g(r, "cod"),
      // Tallas: "S, M, L:0" → la que tiene :0 está agotada
      tallas: g(r, "tallas").split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).map(leerTalla)
    })).filter(p => p.nombre && (p.precio || p.enc) && !p.ocultar).reverse(); // lo más nuevo primero
  }

  // ---------- Estado ----------
  let productos = [], ofertas = [], filtro = "Todos", subf = "", busqueda = "";
  const ENC = "Por encargo", HOT = "Ofertas de hoy", E = T.encargo || { anticipo: 0.4, dias: 20 };
  const pct = Math.round(E.anticipo * 100);
  const anticipo = v => E.anticipo < 1 ? Math.ceil(v * E.anticipo / 1000) * 1000 : Math.min(E.anticipo, v);
  const antTxt = E.anticipo < 1 ? `el ${pct}% de su valor` : fmt(E.anticipo);
  const vigentes = () => ofertas.filter(o => o.vence > Date.now());
  const todos = () => [...vigentes(), ...productos];
  const listaCats = () => { const c = ["Todos", ...new Set(todos().map(p => p.cat))]; if (vigentes().length) c.splice(1, 0, HOT); c.push(ENC); return c; };
  const enCat = (p, c) => c === "Todos" || (c === HOT ? p.hot : c === ENC ? p.enc : p.cat === c && (!subf || norm(p.sub) === norm(subf)));
  // Oferta: precio fijo por tiempo limitado, se aparta como un encargo
  const quedan = v => { const m = Math.max(0, Math.round((v - Date.now()) / 60000)), h = Math.floor(m / 60); return h >= 24 ? `${Math.floor(h / 24)} d ${h % 24} h` : h ? `${h} h ${m % 60} min` : `${m} min`; };
  const conPrecio = p => !p.enc || p.hot;
  const subsDe = c => { const l = [...((T.subcategorias || {})[c] || [])]; todos().forEach(p => { if (p.cat === c && p.sub && !l.some(x => norm(x) === norm(p.sub))) l.push(p.sub); }); return l; };
  const elegir = (c, s = "") => { filtro = c; subf = s; busqueda = ""; $("q").value = ""; cerrarMenu(); pintar(); $("vitrina").scrollIntoView({ behavior: "smooth" }); };
  let carrito = [];
  try { carrito = JSON.parse(localStorage.getItem("jp-carrito") || "[]").filter(i => !i.vence || i.vence > Date.now()); } catch { }
  const guardar = () => { try { localStorage.setItem("jp-carrito", JSON.stringify(carrito)); } catch { } };

  // ---------- Vitrina ----------
  function categorias() {
    const cats = listaCats().filter(c => c !== HOT);
    $("icons").innerHTML = ""; $("nav").innerHTML = "";
    const all = document.createElement("button"); all.type = "button"; all.className = "all"; all.textContent = "☰ Categorías";
    all.setAttribute("aria-haspopup", "true"); all.setAttribute("aria-expanded", "false");
    all.onclick = e => { e.stopPropagation(); menuCats(all); };
    $("nav").append(all);
    cats.forEach(c => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-pressed", c === filtro);
      b.innerHTML = `<svg viewBox="0 0 24 24">${icon(c)}</svg>${esc(c)}`;
      b.onclick = () => { filtro = c; subf = ""; pintar(); };
      $("icons").append(b);
    });
  }
  // Menú desplegable de categorías
  function cerrarMenu() {
    const m = $("menuCats"); if (m) m.remove();
    document.querySelectorAll(".cats .all").forEach(b => b.setAttribute("aria-expanded", "false"));
  }
  function menuCats(btn) {
    if ($("menuCats")) { cerrarMenu(); return; }
    const m = document.createElement("div"); m.id = "menuCats"; m.setAttribute("role", "menu");
    const cats = listaCats();
    cats.forEach(c => {
      const subs = c === "Todos" || c === ENC || c === HOT ? [] : subsDe(c);
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitem");
      if (c === filtro) b.className = "on";
      b.innerHTML = `<svg viewBox="0 0 24 24">${icon(c)}</svg><span>${esc(c)}</span>${subs.length ? '<i class="chev" aria-hidden="true"></i>' : ""}`;
      m.append(b);
      if (!subs.length) { b.onclick = () => elegir(c); return; }
      const box = document.createElement("div"); box.className = "subs"; box.hidden = c !== filtro;
      b.setAttribute("aria-expanded", !box.hidden);
      [["Ver todo en " + c, ""], ...subs.map(s => [s, s])].forEach(([t, s]) => {
        const x = document.createElement("button"); x.type = "button"; x.setAttribute("role", "menuitem"); x.textContent = t;
        if (c === filtro && s === subf) x.className = "on";
        x.onclick = () => elegir(c, s); box.append(x);
      });
      b.onclick = () => { m.querySelectorAll(".subs").forEach(o => { if (o !== box) { o.hidden = true; o.previousElementSibling.setAttribute("aria-expanded", "false"); } }); box.hidden = !box.hidden; b.setAttribute("aria-expanded", !box.hidden); };
      m.append(box);
    });
    const r = btn.getBoundingClientRect();
    m.style.top = (r.bottom + 6) + "px"; m.style.left = Math.max(8, r.left) + "px";
    document.body.append(m); btn.setAttribute("aria-expanded", "true");
  }
  document.addEventListener("click", e => { if (!e.target.closest("#menuCats")) cerrarMenu(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarMenu(); });
  window.addEventListener("scroll", cerrarMenu, { passive: true });
  window.addEventListener("resize", cerrarMenu);

  function pintar() {
    categorias();
    const q = norm(busqueda);
    pintarHot(q);
    let lista = todos().filter(p => !(filtro === "Todos" && !q && p.hot)).filter(p => enCat(p, filtro) && (!q || norm(p.nombre + " " + p.cod + " " + p.cat + " " + p.specs.join(" ")).includes(q)));
    if (filtro === "Todos" && !q) lista = [...lista.filter(p => p.dest), ...lista.filter(p => !p.dest)];
    $("titulo").textContent = q ? `Resultados para “${busqueda}”` : filtro === "Todos" ? "Productos destacados" : subf ? `${filtro} › ${subf}` : filtro;
    const grid = $("grid"); grid.innerHTML = "";
    $("enc-intro").hidden = filtro !== ENC || !!q;
    if (filtro === ENC && !q) $("enc-intro").innerHTML = `<h3>⏳ Aparta productos innovadores</h3>
      <p>Productos novedosos que traemos <b>bajo pedido</b>. Así funciona:</p>
      <ol><li>Eliges el producto y nos escribes por WhatsApp para darte el <b>precio</b>.</li>
      <li>Lo apartas pagando solo <b>${antTxt}</b>.</li>
      <li>Lo recibes en máximo <b>${E.dias} días hábiles</b> después de confirmar tu pago.</li>
      <li>Pagas el resto cuando llegue. Si no llega a tiempo, te devolvemos tu anticipo.</li></ol>
      <a href="legal.html#encargo">Ver condiciones</a>`;
    if (!lista.length) { grid.innerHTML = filtro === ENC && !q ? '<p class="empty">Muy pronto publicaremos aquí productos innovadores para apartar. ¿Buscas algo en especial? Escríbenos por WhatsApp y te lo conseguimos.</p>' : subf && !q ? `<p class="empty">Muy pronto tendremos productos de <b>${esc(subf)}</b>. ¿Buscas algo en especial? Escríbenos por WhatsApp y te lo conseguimos.</p>` : '<p class="empty">No encontramos productos. Prueba con otra búsqueda.</p>'; return; }
    lista.forEach(p => grid.append(tarjeta(p)));
  }
  // Franja "Ofertas de hoy" arriba de la vitrina
  function pintarHot(q) {
    const l = vigentes(), ver = filtro === "Todos" && !q && l.length;
    $("hot").hidden = !ver; if (!ver) return;
    $("hot-grid").innerHTML = ""; l.forEach(p => $("hot-grid").append(tarjeta(p)));
  }
  function tarjeta(p) {
      // descuentos de 90 % o más son un error de datos: no se muestran
      const off0 = p.antes > p.precio ? Math.round(100 - p.precio * 100 / p.antes) : 0, off = off0 < 90 ? off0 : 0;
      const el = document.createElement("article"); el.className = "card";
      el.innerHTML = `<button class="open" type="button" aria-label="Ver ${esc(p.nombre)}">
        <div class="media">${p.fotos[0] ? `<img src="${esc(p.fotos[0])}" alt="" loading="lazy">` : '<span class="ph">J&amp;P</span>'}
        ${p.hot && off ? '<span class="badge hot">🔥 Promoción</span>' : p.dest && !p.hot ? '<span class="badge">Destacado</span>' : ""}${off ? `<span class="badge off">-${off}%</span>` : ""}${p.hot ? `<span class="badge reloj">⏱ Termina en ${quedan(p.vence)}</span>` : p.enc ? '<span class="badge enc">⏳ Por encargo</span>' : '<span class="badge ya">✅ Entrega inmediata</span>'}</div>
        <div class="body"><h3>${esc(p.nombre)}</h3>
        ${p.hot ? "" : `<ul class="specs">${p.specs.slice(0, 2).map(s => `<li>${esc(s)}</li>`).join("")}</ul>`}
        ${p.hot ? `<div class="price">${conPres(p) ? "<small>Desde</small> " : ""}<b>${fmt(p.precio)}</b>${off ? `<s>${fmt(p.antes)}</s>` : ""}</div><p class="sep">⏳ Por encargo · apártalo con <b>${fmt(anticipo(p.precio))}</b> · llega en ${E.dias} días hábiles</p>` : p.enc ? `<div class="price cot"><b>Precio a consultar</b></div><p class="sep">Apártalo con <b>${antTxt}</b> · llega en ${E.dias} días hábiles</p>` : `<div class="price"><b>${fmt(p.precio)}</b>${off ? `<s>${fmt(p.antes)}</s>` : ""}</div>`}${p.tallas.length ? `<div class="mini-tallas">${p.tallas.map(x => `<span class="${x.ok ? "" : "off"}">${convTalla(x.t, tipoTalla(p))[0]}</span>`).join("")}</div>` : ""}</div></button>
        <button class="buy" type="button">${p.tallas.length ? (p.hot ? "Apartar" : "Comprar") : p.hot ? "Apartar" : p.enc ? "💬 Cotizar por WhatsApp" : "Agregar al carrito"}</button>`;
      el.querySelector(".open").onclick = () => abrir(p);
      el.querySelector(".buy").onclick = e => { if (p.tallas.length) return abrir(p); if (!conPrecio(p)) return cotizar(p); agregar(p, 1); e.target.textContent = "Agregado ✓"; preguntar(p); };
      return el;
  }

  // Talla u opción: "38", "38:0" (agotada) o "8 oz=125000" (presentación con su propio precio)
  function leerTalla(s) { const [a, n] = s.split(":").map(x => x.trim()); const [t, pr] = a.split("=").map(x => x.trim()); return { t, ok: n === undefined || num(n) > 0, precio: num(pr || 0) }; }
  const conPres = p => p.tallas.some(x => x.precio);
  // ---------- Tallas: la hoja guarda la talla americana; se muestra la colombiana ----------
  const tipoTalla = p => { const s = norm(p.sub + " " + p.nombre); if (p.cat === "Calzado") return /mujer/.test(s) ? "zm" : "zh"; if (/gorra/.test(s)) return "gorra"; if (p.cat === "Ropa") return "ropa"; return ""; };
  const ZAP = { zh: 30, zm: 30 }; // talla colombiana ≈ talla US + este número
  const ROPA = { XS: "XS", S: "S", M: "M", L: "L", XL: "XL", XXL: "XXL" };
  function convTalla(t, tipo) {
    const n = parseFloat(String(t).replace(",", "."));
    if (ZAP[tipo] && !isNaN(n)) return [String(n + ZAP[tipo]).replace(".", ","), `US ${String(n).replace(".", ",")}`];
    if (tipo === "ropa" && ROPA[t.toUpperCase()]) return [t.toUpperCase(), `US ${t.toUpperCase()}`];
    return [t, ""];
  }
  const tabla = (h, f) => `<table><tr>${h.map(x => `<th>${x}</th>`).join("")}</tr>${f.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;
  const GUIA = {
    zh: tabla(["Colombia", "US", "Largo del pie"], [["37", "7", "25 cm"], ["38", "8", "26 cm"], ["39", "9", "27 cm"], ["39,5", "9,5", "27,5 cm"], ["40", "10", "28 cm"], ["41", "11", "29 cm"], ["42", "12", "30 cm"]]) + "<p>Mide tu pie del talón a la punta del dedo más largo. Si quedas entre dos tallas, elige la más grande.</p>",
    zm: tabla(["Colombia", "US", "Largo del pie"], [["35", "5", "22 cm"], ["36", "6", "23 cm"], ["37", "7", "24 cm"], ["38", "8", "25 cm"], ["38,5", "8,5", "25,5 cm"], ["39", "9", "26 cm"], ["40", "10", "27 cm"]]) + "<p>Mide tu pie del talón a la punta del dedo más largo. Si quedas entre dos tallas, elige la más grande.</p>",
    ropa: tabla(["Talla", "Pecho", "Cintura"], [["S", "86 a 94 cm", "71 a 79 cm"], ["M", "94 a 102 cm", "79 a 87 cm"], ["L", "102 a 110 cm", "87 a 95 cm"], ["XL", "110 a 118 cm", "95 a 103 cm"], ["XXL", "118 a 126 cm", "103 a 111 cm"]]) + "<p>Las tallas americanas suelen ser un poco más amplias. Si dudas, escríbenos por WhatsApp y te ayudamos.</p>",
    gorra: "<p>Talla única con correa ajustable: le queda a la mayoría de adultos (54 a 60 cm de contorno de cabeza).</p>"
  };

  // ---------- Detalle ----------
  let actual = null, cant = 1, talla = "", precioSel = 0;
  function abrir(p) {
    actual = p; cant = 1; talla = ""; precioSel = 0; $("d-cant").textContent = 1;
    const tipo = tipoTalla(p);
    $("d-tallas").hidden = !p.tallas.length; $("d-tallas").innerHTML = p.tallas.length ? `<p>${conPres(p) ? "Elige la presentación" : "Elige tu talla <small>(talla colombiana)</small>"}</p><div class="ops"></div>${GUIA[tipo] ? `<details class="guia"><summary>📏 Guía de tallas</summary>${GUIA[tipo]}</details>` : ""}` : "";
    p.tallas.forEach(({ t, ok, precio }) => {
      const [co, us] = precio || !ok && conPres(p) ? [t, ok ? fmt(precio) : ""] : convTalla(t, tipo);
      const b = document.createElement("button"); b.type = "button"; b.disabled = !ok;
      b.innerHTML = `<b>${esc(co)}</b>${us ? `<small>${esc(us)}</small>` : ""}`;
      b.setAttribute("aria-pressed", "false"); if (!ok) b.title = "Agotada";
      b.onclick = () => { talla = precio ? co : us ? `${co} (${us})` : co; precioSel = precio; if (precio) $("d-precio").innerHTML = `<b>${fmt(precio)}</b>`; $("d-tallas").querySelectorAll(".ops button").forEach(x => x.setAttribute("aria-pressed", x === b)); };
      $("d-tallas").querySelector(".ops").append(b);
    });
    $("d-cat").textContent = p.cat; $("d-nombre").textContent = p.nombre; $("d-cod").textContent = p.cod ? `Ref. ${p.cod}` : "";
    $("d-precio").innerHTML = !conPrecio(p) ? "<b>Precio a consultar</b>" : `<b>${fmt(p.precio)}</b>${p.antes > p.precio && p.antes < p.precio * 10 ? `<s>${fmt(p.antes)}</s>` : ""}`;
    $("d-specs").innerHTML = p.specs.map(s => `<li>${esc(s)}</li>`).join("");
    $("d-enc").hidden = !p.enc;
    if (p.hot) $("d-enc").innerHTML = `<b>${p.antes > p.precio ? "🔥 Promoción" : "⏱ Precio"} por tiempo limitado · termina en ${quedan(p.vence)}</b>
      <span>Producto por encargo: lo apartas con <b>${fmt(anticipo(p.precio))}</b> y el resto lo pagas cuando llegue.</span>
      <span>El precio queda fijo si lo apartas antes de que termine la oferta. Llega en máximo ${E.dias} días hábiles después de confirmar tu pago.</span>`;
    else if (p.enc) $("d-enc").innerHTML = `<b>⏳ Producto por encargo</b>
      <span>Escríbenos por WhatsApp y te damos el precio. Lo apartas con <b>${antTxt}</b> y el resto lo pagas cuando llegue.</span>
      <span>Llega en máximo ${E.dias} días hábiles después de confirmar tu pago.</span>`;
    $("d-gar").innerHTML = `🛡️ <b>Garantía:</b> ${esc(p.gar || "por defectos de fábrica, consúltala por WhatsApp antes de comprar")} · <a href="legal.html#garantias" target="_blank">condiciones</a>`;
    $("d-agregar").style.display = conPrecio(p) ? "" : "none"; $("d-agregar").textContent = p.hot ? "Apartar" : "Agregar al carrito"; $("d-menos").parentElement.style.display = conPrecio(p) ? "" : "none";
    $("d-ws").textContent = conPrecio(p) ? "Preguntar por WhatsApp" : "💬 Cotizar por WhatsApp";
    const medios = [...p.fotos.map(src => ({ t: "img", src })), ...(p.video ? [{ t: "vid", src: p.video }] : [])];
    const ver = m => { $("d-main").innerHTML = !m ? '<span class="ph">J&amp;P</span>' : m.t === "img" ? `<img src="${esc(m.src)}" alt="${esc(p.nombre)}">` : `<iframe src="${esc(m.src)}" allow="autoplay; encrypted-media" allowfullscreen title="Video"></iframe>`; };
    ver(medios[0]);
    $("d-th").innerHTML = "";
    if (medios.length > 1) medios.forEach(m => {
      const b = document.createElement("button"); b.type = "button";
      b.innerHTML = m.t === "img" ? `<img src="${esc(m.src)}" alt="">` : "▶ Video";
      b.onclick = () => ver(m); $("d-th").append(b);
    });
    $("detalle").showModal();
  }
  $("d-menos").onclick = () => { cant = Math.max(1, cant - 1); $("d-cant").textContent = cant; };
  $("d-mas").onclick = () => { cant++; $("d-cant").textContent = cant; };
  const sinTalla = () => { if (actual.tallas.length && !talla) { aviso(conPres(actual) ? "👉 Primero elige la presentación" : "👟 Primero elige tu talla"); $("d-tallas").scrollIntoView({ behavior: "smooth", block: "center" }); return true; } };
  const conSel = () => precioSel ? { ...actual, precio: precioSel } : actual;
  $("d-agregar").onclick = () => { if (sinTalla()) return; agregar(conSel(), cant, talla); $("detalle").close(); preguntar(actual, talla); };
  const cotizar = (p, t = "") => ws(`⛰️✨ *¡Hola, ${T.nombre}!*\n\nQuiero cotizar este producto *por encargo* 👇\n🔸 *${p.nombre}*${p.cod ? ` (Ref. ${p.cod})` : ""}${t ? `\n📏 Talla: *${t}*` : ""}\n\n¿Cuál es el precio para apartarlo? 🙌`);
  $("d-ws").onclick = () => !conPrecio(actual) ? cotizar(actual, talla) : ws(`⛰️✨ *¡Hola, ${T.nombre}!*\n\nMe interesa este producto 👇\n🔸 *${actual.nombre}*${actual.cod ? ` (Ref. ${actual.cod})` : ""}${talla ? `\n📏 ${precioSel ? "Presentación" : "Talla"}: *${talla}*` : ""}\n💰 ${fmt(conSel().precio)}\n\n¿Me dan más información? 🙌`);

  // ---------- Carrito ----------
  function agregar(p, n, t = "") {
    const it = carrito.find(i => i.nombre === p.nombre && (i.talla || "") === t);
    if (it) it.cant += n; else carrito.push({ nombre: p.nombre, cod: p.cod, talla: t, precio: p.precio, peso: p.peso, foto: p.fotos[0] || "", enc: !!p.enc, vence: p.vence || 0, cant: n });
    guardar(); contador();
  }
  function preguntar(p, t = "") {
    $("l-nombre").textContent = p.nombre + (t ? ` · Talla ${t}` : "");
    $("l-foto").src = p.fotos[0] || ""; $("l-foto").hidden = !p.fotos[0];
    $("listo").showModal();
  }
  $("l-seguir").onclick = () => $("listo").close();
  $("l-carrito").onclick = () => { $("listo").close(); abrirCarrito(); };
  $("listo").addEventListener("click", e => { if (e.target === $("listo")) $("listo").close(); });
  let avisoT;
  function aviso(txt) {
    let t = $("aviso");
    if (!t) { t = document.createElement("div"); t.id = "aviso"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = txt; t.classList.add("on");
    clearTimeout(avisoT); avisoT = setTimeout(() => t.classList.remove("on"), 2600);
  }
  const contador = () => { $("nCart").textContent = carrito.reduce((a, i) => a + i.cant, 0); };
  const envio = z => z.valor || 0;
  const fmtEnv = v => (v ? fmt(v) : "Gratis");
  function abrirCarrito() { pintarCarrito(); $("carrito").showModal(); }
  function pintarCarrito() {
    const box = $("c-items");
    if (!carrito.length) { box.innerHTML = '<p class="empty">Tu carrito está vacío.</p>'; $("c-form").hidden = true; return; }
    $("c-form").hidden = false;
    box.innerHTML = "";
    carrito.forEach((i, k) => {
      const d = document.createElement("div"); d.className = "item";
      d.innerHTML = `${i.foto ? `<img src="${esc(i.foto)}" alt="">` : '<span class="mini"></span>'}
        <div><p>${i.enc ? '<span class="tag-enc">⏳ Por encargo</span> ' : ""}${esc(i.nombre)}${i.talla ? ` · <b>Talla ${esc(i.talla)}</b>` : ""}</p><small>${fmt(i.precio)} c/u · ${fmt(i.precio * i.cant)}</small>
          <div class="qty sm"><button type="button" class="m" aria-label="Quitar una unidad">−</button><span>${i.cant}</span><button type="button" class="p" aria-label="Agregar una unidad">+</button></div></div>
        <button class="x" type="button">Quitar</button>`;
      const cambiar = n => { i.cant += n; if (i.cant < 1) carrito.splice(k, 1); guardar(); contador(); pintarCarrito(); };
      d.querySelector(".m").onclick = () => cambiar(-1);
      d.querySelector(".p").onclick = () => cambiar(1);
      d.querySelector(".x").onclick = () => { carrito.splice(k, 1); guardar(); contador(); pintarCarrito(); };
      box.append(d);
    });
    totales();
  }
  function totales() {
    const sub = carrito.reduce((a, i) => a + i.precio * i.cant, 0);
    const kg = carrito.reduce((a, i) => a + i.peso * i.cant, 0);
    const z = destino();
    const env = envio(z, kg);
    const subEnc = carrito.filter(i => i.enc).reduce((a, i) => a + i.precio * i.cant, 0);
    const subDisp = sub - subEnc;
    const ant = carrito.filter(i => i.enc).reduce((a, i) => a + anticipo(i.precio) * i.cant, 0);
    const ahora = subEnc ? subDisp + ant + (subDisp ? env : 0) : sub + env;
    const luego = sub + env - ahora;
    $("c-tot").innerHTML = `<div><span>Productos</span><span>${fmt(sub)}</span></div>
      <div><span>Envío a ${esc(z.zona)}</span><span>${fmtEnv(env)}</span></div>
      <div class="g"><span>Total</span><span>${fmt(sub + env)}</span></div>
      ${subEnc ? `<div class="enc-box"><div><span>💳 Pagas ahora${subDisp ? "" : ` (anticipo)`}</span><span>${fmt(ahora)}</span></div>
      <div><span>⏳ Pagas al recibir el encargo</span><span>${fmt(luego)}</span></div>
      <small>Los productos por encargo llegan en máximo ${E.dias} días hábiles después de confirmar tu pago.</small></div>` : ""}`;
    return { sub, kg, env, z, subEnc, ahora, luego };
  }
  $("c-form").addEventListener("submit", e => {
    e.preventDefault();
    if (destino().pendiente) { aviso("📍 Elige el departamento y el municipio del envío"); $("c-dep").focus(); return; }
    const { sub, env, z, subEnc, ahora, luego } = totales();
    const lineas = carrito.map(i => `🔸 ${i.cant} × ${i.nombre}${i.cod ? ` [${i.cod}]` : ""}${i.talla ? ` (talla ${i.talla})` : ""}${i.vence ? " 🔥 *(oferta)*" : ""}${i.enc ? " ⏳ *(por encargo)*" : ""}\n      ${fmt(i.precio * i.cant)}`).join("\n");
    ws([
      `⛰️✨ *¡Hola, ${T.nombre}!* ✨⛰️`,
      `Encontré oro en su tienda y quiero hacer este pedido 🛒`,
      ``,
      `📦 *MI PEDIDO*`,
      lineas,
      ``,
      `💰 Productos: ${fmt(sub)}`,
      `🚚 Envío a ${z.zona}: ${env ? fmt(env) : "¡Gratis! 🎉"}`,
      `🏆 *TOTAL: ${fmt(sub + env)}*`,
      ...(subEnc ? [``, `⏳ *ENCARGO* (llega en máx. ${E.dias} días hábiles)`, `💳 Pago ahora: ${fmt(ahora)}`, `📦 Pago al recibir: ${fmt(luego)}`] : []),
      ``,
      `📋 *MIS DATOS*`,
      `👤 Nombre: ${$("c-nombre").value}`,
      `📍 Entrega: ${$("c-dir").value}`,
      ...($("c-dir2").value.trim() ? [`🏠 Referencia: ${$("c-dir2").value.trim()}`] : []),
      `💳 Pago: ${$("c-pago").value}`,
      ``,
      `Quedo atento a la confirmación. ¡Gracias! 🙌`
    ].join("\n"));
  });
  // En computador WhatsApp Escritorio daña los emojis; WhatsApp Web los muestra bien.
  const movil = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const ws = texto => window.open(`https://${movil ? "api" : "web"}.whatsapp.com/send?phone=${T.whatsapp}&text=${encodeURIComponent(texto)}`, "_blank", "noopener");

  // ---------- Envíos y demás ----------
  const EV = window.ENVIOS, tipo = () => (document.querySelector('[name="c-tipo"]:checked') || {}).value;
  EV.local.slice(1).forEach(z => $("c-ver").add(new Option(`${z.zona} · ${fmt(z.valor)}`, z.id)));
  $("c-dep").add(new Option("Elige el departamento", ""));
  EV.deptos.forEach((d, i) => $("c-dep").add(new Option(d.d, i)));
  const llenarMun = () => {
    const d = EV.deptos[$("c-dep").value];
    $("c-mun").innerHTML = ""; $("c-mun").add(new Option(d ? "Elige el municipio" : "Primero elige el departamento", ""));
    if (d) d.m.forEach(m => $("c-mun").add(new Option(m, m)));
  };
  llenarMun();
  function destino() {
    const t = tipo();
    if (t === "ver") return EV.local.find(z => z.id === $("c-ver").value) || EV.local[1];
    if (t === "nac") {
      const d = EV.deptos[$("c-dep").value], m = $("c-mun").value;
      if (!d || !m) return { zona: "(elige departamento y municipio)", valor: 0, pendiente: true };
      const esp = EV.especiales[`${d.d}|${m}`], tf = EV.tarifas[d.z];
      return { zona: `${m}, ${d.d}`, valor: (esp || tf).valor, tiempo: (esp || tf).tiempo, via: esp ? esp.via : EV.via };
    }
    return EV.local[0];
  }
  const cambioDestino = () => {
    const t = tipo();
    $("c-ver").hidden = t !== "ver"; $("c-nac").hidden = t !== "nac";
    const z = destino();
    $("c-envinfo").textContent = z.pendiente ? "Elige tu departamento y municipio para ver el valor del envío." : `Envío: ${z.valor ? fmt(z.valor) : "Gratis"}${z.tiempo ? ` · llega en ${z.tiempo}` : ""}. Valor estimado, te lo confirmamos por WhatsApp.`;
    totales();
  };
  document.querySelectorAll('[name="c-tipo"]').forEach(x => x.onchange = cambioDestino);
  $("c-ver").onchange = cambioDestino;
  $("c-dep").onchange = () => { llenarMun(); cambioDestino(); };
  $("c-mun").onchange = cambioDestino;
  cambioDestino();

  // ---------- Carrusel de la portada ----------
  (() => {
    const sl = [...document.querySelectorAll("#slides .slide")], dots = $("dots");
    if (sl.length < 2) return;
    let i = 0, t;
    const ir = n => {
      sl[i].classList.remove("on"); sl[i].setAttribute("aria-hidden", "true"); dots.children[i].setAttribute("aria-selected", "false");
      i = (n + sl.length) % sl.length;
      sl[i].classList.add("on"); sl[i].removeAttribute("aria-hidden"); dots.children[i].setAttribute("aria-selected", "true");
    };
    sl.forEach((_, n) => { const b = document.createElement("button"); b.type = "button"; b.role = "tab"; b.setAttribute("aria-label", `Panel ${n + 1}`); b.setAttribute("aria-selected", n === 0); b.onclick = () => { ir(n); play(); }; dots.append(b); });
    const play = () => { clearInterval(t); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) t = setInterval(() => ir(i + 1), 6500); };
    const box = $("slides");
    box.addEventListener("mouseenter", () => clearInterval(t)); box.addEventListener("mouseleave", play);
    let x0 = null;
    box.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { ir(i + (dx < 0 ? 1 : -1)); play(); } x0 = null; });
    play();
  })();
  const B = T.breb || {};
  if (B.llave) $("llave").textContent = B.llave;
  if (B.qr) $("qr").innerHTML = `<img src="${esc(B.qr)}" alt="Código QR Bre-B de J&amp;P del Sur">`;
  T.pagos.forEach(p => { $("c-pago").add(new Option(p)); $("pagos").insertAdjacentHTML("beforeend", `<span class="chip">${esc(p)}</span>`); });
  $("anio").textContent = `© ${new Date().getFullYear()} ${T.nombre}`;
  $("abrirCarrito").onclick = abrirCarrito;
  document.querySelectorAll("[data-close]").forEach(b => b.onclick = () => b.closest("dialog").close());
  document.querySelectorAll("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); }));
  $("buscar").onsubmit = e => { e.preventDefault(); busqueda = $("q").value.trim(); pintar(); $("vitrina").scrollIntoView(); };
  $("q").oninput = () => { busqueda = $("q").value.trim(); pintar(); };

  // ---------- Carga de productos ----------
  async function cargar() {
    const fuentes = [T.hojaCSV, "productos.csv"].filter(Boolean);
    for (const url of fuentes) {
      try {
        const r = await fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now());
        if (!r.ok) throw 0;
        productos = toProducts(parseCSV(await r.text()));
        if (productos.length) break;
      } catch { }
    }
    pintar();
  }
  // Ofertas de hoy: las publica el botón de ofertas en la hoja y se ocultan solas al vencer
  async function cargarOfertas() {
    if (!T.ofertasURL) return;
    try {
      const r = await fetch(T.ofertasURL + "?accion=ofertas&t=" + Date.now());
      ofertas = (await r.json()).map((o, i) => ({
        id: "hot" + i, hot: true, enc: true, nombre: o.nombre, precio: num(o.precio), antes: num(o.antes), cat: o.cat || "Otros", sub: o.sub || "", cod: "",
        specs: o.specs || [], fotos: (o.fotos || []).map(toImg), video: "", peso: 1, dest: false, gar: "por defectos de fábrica", vence: Date.parse(o.vence),
        tallas: String(o.tallas || "").split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).map(leerTalla)
      })).filter(o => o.nombre && o.precio && o.vence > Date.now());
      pintar();
    } catch { }
  }
  // Cada minuto se actualiza el contador y desaparecen las ofertas vencidas
  setInterval(() => { if (ofertas.length && !$("detalle").open) pintar(); }, 60000);
  contador(); cargar(); cargarOfertas();
})();
