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

  // Tarifas de envío ESTIMADAS. Se confirman al cliente por WhatsApp.
  // base = valor fijo; porKg = valor por cada kilo; via = quién lleva el paquete.
  // Para envío gratis pon base: 0 y porKg: 0.
  envios: [
    { zona: "Santa Rosa del Sur · casco urbano", base: 0, porKg: 0, tiempo: "Mismo día", via: "Entrega propia" },
    { zona: "Minas y veredas cercanas (hasta 1 h)", base: 15000, porKg: 2000, tiempo: "1 a 2 días", via: "Transportador local" },
    { zona: "Minas lejanas (más de 1 h o trocha)", base: 30000, porKg: 3500, tiempo: "2 a 4 días", via: "Transportador local" },
    { zona: "Simití", base: 12000, porKg: 2000, tiempo: "1 a 2 días", via: "Coop. Transportadores del Sur de Bolívar / Inter Rapidísimo" },
    { zona: "San Pablo", base: 18000, porKg: 2500, tiempo: "2 a 3 días", via: "Coop. Transportadores del Sur de Bolívar / Inter Rapidísimo" },
    { zona: "Otra ciudad de Colombia", base: 18000, porKg: 4000, tiempo: "3 a 6 días", via: "Inter Rapidísimo / Servientrega / Coordinadora" }
  ],

  // Formas de pago que se muestran al cliente.
  pagos: ["Nequi", "PSE", "Tarjeta", "Contraentrega"]
};
