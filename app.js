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
    moda: '<path d="M8 3 3 6l2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
    calzado: '<path d="M3 16c0-3 1-7 3-9l4 3c2 1 5 2 8 3 2 .5 3 2 3 3v2H3z"/>',
    perfumeria: '<rect x="6" y="9" width="12" height="12" rx="2"/><path d="M10 9V6h4v3M12 3v3"/>',
    electrodomesticos: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 9h14M9 6h.01"/>',
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
      antes: col("antes", "anterior"), cat: col("categor"), specs: col("caracter", "especific", "descrip"),
      fotos: col("foto", "imagen"), video: col("video"), peso: col("peso"), dest: col("destac", "ganador"), ocultar: col("ocultar", "agotado"), enc: col("encargo")
    };
    const g = (r, k) => (c[k] >= 0 ? (r[c[k]] || "").trim() : "");
    return rows.map((r, i) => ({
      id: i,
      nombre: g(r, "nombre"),
      precio: num(g(r, "precio")),
      antes: num(g(r, "antes")),
      cat: g(r, "cat") || "Otros",
      specs: g(r, "specs").split(/\n|;|•/).map(s => s.trim()).filter(Boolean),
      fotos: g(r, "fotos").split(/[\s,]+/).filter(u => /^(https?:|img\/)/.test(u)).map(toImg),
      video: toVideo(g(r, "video")),
      peso: num(g(r, "peso")) || 1,
      dest: si(g(r, "dest")),
      ocultar: si(g(r, "ocultar")),
      enc: si(g(r, "enc"))
    })).filter(p => p.nombre && p.precio && !p.ocultar).reverse(); // lo más nuevo primero
  }

  // ---------- Estado ----------
  let productos = [], filtro = "Todos", busqueda = "";
  const ENC = "Por encargo", E = T.encargo || { anticipo: 0.4, dias: 20 };
  const pct = Math.round(E.anticipo * 100);
  const anticipo = v => Math.ceil(v * E.anticipo / 1000) * 1000;
  const listaCats = () => { const c = ["Todos", ...new Set(productos.map(p => p.cat))]; c.push(ENC); return c; };
  const enCat = (p, c) => c === "Todos" || (c === ENC ? p.enc : p.cat === c);
  let carrito = [];
  try { carrito = JSON.parse(localStorage.getItem("jp-carrito") || "[]"); } catch { }
  const guardar = () => { try { localStorage.setItem("jp-carrito", JSON.stringify(carrito)); } catch { } };

  // ---------- Vitrina ----------
  function categorias() {
    const cats = listaCats();
    $("icons").innerHTML = ""; $("nav").innerHTML = "";
    const all = document.createElement("button"); all.type = "button"; all.className = "all"; all.textContent = "☰ Categorías";
    all.setAttribute("aria-haspopup", "true"); all.setAttribute("aria-expanded", "false");
    all.onclick = e => { e.stopPropagation(); menuCats(all); };
    $("nav").append(all);
    cats.forEach(c => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-pressed", c === filtro);
      b.innerHTML = `<svg viewBox="0 0 24 24">${icon(c)}</svg>${esc(c)}`;
      b.onclick = () => { filtro = c; pintar(); };
      $("icons").append(b);
      const n = document.createElement("button"); n.type = "button"; n.textContent = c; n.setAttribute("aria-pressed", c === filtro);
      n.onclick = () => { filtro = c; pintar(); $("vitrina").scrollIntoView(); };
      $("nav").append(n);
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
      const n = productos.filter(p => enCat(p, c)).length;
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "menuitem");
      if (c === filtro) b.className = "on";
      b.innerHTML = `<svg viewBox="0 0 24 24">${icon(c)}</svg><span>${esc(c)}</span><small>${n}</small>`;
      b.onclick = () => { filtro = c; busqueda = ""; $("q").value = ""; cerrarMenu(); pintar(); $("vitrina").scrollIntoView({ behavior: "smooth" }); };
      m.append(b);
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
    let lista = productos.filter(p => enCat(p, filtro) && (!q || norm(p.nombre + " " + p.cat + " " + p.specs.join(" ")).includes(q)));
    if (filtro === "Todos" && !q) lista = [...lista.filter(p => p.dest), ...lista.filter(p => !p.dest)];
    $("titulo").textContent = q ? `Resultados para “${busqueda}”` : filtro === "Todos" ? "Productos destacados" : filtro;
    $("count").textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
    const grid = $("grid"); grid.innerHTML = "";
    $("enc-intro").hidden = filtro !== ENC || !!q;
    if (filtro === ENC && !q) $("enc-intro").innerHTML = `<h3>⏳ Aparta productos innovadores</h3>
      <p>Productos novedosos que traemos <b>bajo pedido</b>. Así funciona:</p>
      <ol><li>Eliges el producto y lo apartas pagando solo el <b>${pct}%</b> de su valor.</li>
      <li>Lo recibes en máximo <b>${E.dias} días hábiles</b> después de confirmar tu pago.</li>
      <li>Pagas el resto cuando llegue. Si no llega a tiempo, te devolvemos tu anticipo.</li></ol>
      <a href="legal.html#encargo">Ver condiciones</a>`;
    if (!lista.length) { grid.innerHTML = filtro === ENC && !q ? '<p class="empty">Muy pronto publicaremos aquí productos innovadores para apartar. ¿Buscas algo en especial? Escríbenos por WhatsApp y te lo conseguimos.</p>' : '<p class="empty">No encontramos productos. Prueba con otra búsqueda.</p>'; return; }
    lista.forEach(p => {
      const off = p.antes > p.precio ? Math.round(100 - p.precio * 100 / p.antes) : 0;
      const el = document.createElement("article"); el.className = "card";
      el.innerHTML = `<button class="open" type="button" aria-label="Ver ${esc(p.nombre)}">
        <div class="media">${p.fotos[0] ? `<img src="${esc(p.fotos[0])}" alt="" loading="lazy">` : '<span class="ph">J&amp;P</span>'}
        ${p.dest ? '<span class="badge">Destacado</span>' : ""}${off ? `<span class="badge off">-${off}%</span>` : ""}${p.enc ? '<span class="badge enc">⏳ Por encargo</span>' : ""}</div>
        <div class="body"><h3>${esc(p.nombre)}</h3>
        <ul class="specs">${p.specs.slice(0, 2).map(s => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="price"><b>${fmt(p.precio)}</b>${off ? `<s>${fmt(p.antes)}</s>` : ""}</div>
        ${p.enc ? `<p class="sep">Sepáralo con <b>${fmt(anticipo(p.precio))}</b> · llega en ${E.dias} días hábiles</p>` : ""}</div></button>
        <button class="buy" type="button">${p.enc ? "Separar por encargo" : "Agregar al carrito"}</button>`;
      el.querySelector(".open").onclick = () => abrir(p);
      el.querySelector(".buy").onclick = e => { agregar(p, 1); e.target.textContent = "Agregado ✓"; aviso(`✨ ¡Buena elección! ${p.nombre} ya está en tu carrito`); };
      grid.append(el);
    });
  }

  // ---------- Detalle ----------
  let actual = null, cant = 1;
  function abrir(p) {
    actual = p; cant = 1; $("d-cant").textContent = 1;
    $("d-cat").textContent = p.cat; $("d-nombre").textContent = p.nombre;
    $("d-precio").innerHTML = `<b>${fmt(p.precio)}</b>${p.antes > p.precio ? `<s>${fmt(p.antes)}</s>` : ""}`;
    $("d-specs").innerHTML = p.specs.map(s => `<li>${esc(s)}</li>`).join("");
    $("d-enc").hidden = !p.enc;
    if (p.enc) $("d-enc").innerHTML = `<b>⏳ Producto por encargo</b>
      <span>Sepáralo con el ${pct}%: <b>${fmt(anticipo(p.precio))}</b>. El resto (${fmt(p.precio - anticipo(p.precio))}) lo pagas cuando llegue.</span>
      <span>Llega en máximo ${E.dias} días hábiles después de confirmar tu pago.</span>`;
    $("d-agregar").textContent = p.enc ? "Separar por encargo" : "Agregar al carrito";
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
  $("d-agregar").onclick = () => { agregar(actual, cant); $("detalle").close(); abrirCarrito(); };
  $("d-ws").onclick = () => ws(`⛰️✨ *¡Hola, ${T.nombre}!*\n\nMe interesa este producto 👇\n🔸 *${actual.nombre}*\n💰 ${fmt(actual.precio)}\n\n¿Me dan más información? 🙌`);

  // ---------- Carrito ----------
  function agregar(p, n) {
    const it = carrito.find(i => i.nombre === p.nombre);
    if (it) it.cant += n; else carrito.push({ nombre: p.nombre, precio: p.precio, peso: p.peso, foto: p.fotos[0] || "", enc: !!p.enc, cant: n });
    guardar(); contador();
  }
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
        <div><p>${i.enc ? '<span class="tag-enc">⏳ Por encargo</span> ' : ""}${esc(i.nombre)}</p><small>${fmt(i.precio)} c/u · ${fmt(i.precio * i.cant)}</small>
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
    const z = T.envios[$("c-zona").value];
    const env = envio(z, kg);
    const subEnc = carrito.filter(i => i.enc).reduce((a, i) => a + i.precio * i.cant, 0);
    const subDisp = sub - subEnc;
    const ant = carrito.filter(i => i.enc).reduce((a, i) => a + anticipo(i.precio) * i.cant, 0);
    const ahora = subEnc ? subDisp + ant + (subDisp ? env : 0) : sub + env;
    const luego = sub + env - ahora;
    $("c-tot").innerHTML = `<div><span>Productos</span><span>${fmt(sub)}</span></div>
      <div><span>Envío a ${esc(z.zona)}</span><span>${fmtEnv(env)}</span></div>
      <div class="g"><span>Total</span><span>${fmt(sub + env)}</span></div>
      ${subEnc ? `<div class="enc-box"><div><span>💳 Pagas ahora${subDisp ? "" : ` (anticipo ${pct}%)`}</span><span>${fmt(ahora)}</span></div>
      <div><span>⏳ Pagas al recibir el encargo</span><span>${fmt(luego)}</span></div>
      <small>Los productos por encargo llegan en máximo ${E.dias} días hábiles después de confirmar tu pago.</small></div>` : ""}`;
    return { sub, kg, env, z, subEnc, ahora, luego };
  }
  $("c-zona").onchange = totales;
  $("c-form").addEventListener("submit", e => {
    e.preventDefault();
    const { sub, env, z, subEnc, ahora, luego } = totales();
    const lineas = carrito.map(i => `🔸 ${i.cant} × ${i.nombre}${i.enc ? " ⏳ *(por encargo)*" : ""}\n      ${fmt(i.precio * i.cant)}`).join("\n");
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
  ["c-zona"].forEach(id => {
    const grupos = {};
    T.envios.forEach((z, i) => {
      const g = z.grupo || "Destinos";
      if (!grupos[g]) { grupos[g] = document.createElement("optgroup"); grupos[g].label = g; $(id).append(grupos[g]); }
      grupos[g].append(new Option(z.valor ? `${z.zona} · ${fmt(z.valor)}` : `${z.zona} · Gratis`, i));
    });
  });
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
  contador(); cargar();
})();
