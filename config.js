// ============================================================
//  CONFIGURACIÓN DE LA TIENDA  ·  Solo edita lo que está aquí
// ============================================================
window.TIENDA = {
  nombre: "J&P del Sur",
  lema: "Tu mundo en un solo lugar",

  // Datos legales del vendedor (obligatorios por ley). Completa cuando tengas RUT/NIT.
  empresa: {
    titular: "Jonatan Idarraga Parra y Jenny Idarraga Parra",
    nit: "En trámite",
    direccion: "Santa Rosa del Sur, Bolívar, Colombia",
    correo: "jipdelsur2026@gmail.com",
    telefono: "317 798 6779"
  },

  // Garantía que ofreces si el producto no indica otra.
  // Si no la anuncias, la ley asume 1 año para productos nuevos.
  garantia: "1 año",

  // Tu número de WhatsApp con indicativo de Colombia (57), sin espacios ni "+".
  // Aquí llegan los pedidos.
  whatsapp: "573177986779",

  // Enlace CSV de la hoja de Google con tus productos
  // (Archivo > Compartir > Publicar en la web > Formato CSV).
  // Mientras esté vacío, la tienda muestra los productos de "productos.csv".
  hojaCSV: "",

  // Tarifas de envío. Cambia los valores por los de las transportadoras.
  // base = valor fijo del envío; porKg = valor por cada kilo.
  envios: [
    { zona: "Santa Rosa del Sur · casco urbano",        base: 6000,  porKg: 1500, tiempo: "Mismo día" },
    { zona: "Zona minera cercana (hasta 1 h)",          base: 15000, porKg: 2500, tiempo: "1 a 2 días" },
    { zona: "Zona minera lejana (más de 1 h, trocha)",  base: 28000, porKg: 4000, tiempo: "2 a 4 días" },
    { zona: "Simití / Morales",                         base: 18000, porKg: 3000, tiempo: "2 a 3 días" }
  ],

  // Formas de pago que se muestran al cliente.
  pagos: ["Nequi", "PSE", "Tarjeta", "Contraentrega"]
};
