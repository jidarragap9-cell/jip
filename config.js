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

  // Envíos: un valor PROMEDIO fijo por destino (no depende del peso).
  // Para agregar un municipio copia una línea. valor: 0 = envío gratis.
  // Si un pedido es muy pesado, el valor final se ajusta por WhatsApp.
  envios: [
    { grupo: "Santa Rosa del Sur", zona: "Santa Rosa del Sur · casco urbano", valor: 0, tiempo: "Mismo día", via: "Entrega propia" },
    { grupo: "Minas y veredas", zona: "Mina o vereda cercana (hasta 1 h)", valor: 20000, tiempo: "1 a 2 días", via: "Transportador local" },
    { grupo: "Minas y veredas", zona: "Mina lejana (más de 1 h o trocha)", valor: 35000, tiempo: "2 a 4 días", via: "Transportador local" },
    { grupo: "Municipios del Sur de Bolívar", zona: "Simití", valor: 15000, tiempo: "1 a 2 días", via: "Coop. Transportadores del Sur de Bolívar" },
    { grupo: "Municipios del Sur de Bolívar", zona: "San Pablo", valor: 22000, tiempo: "2 a 3 días", via: "Coop. Transportadores del Sur de Bolívar" },
    { grupo: "Municipios del Sur de Bolívar", zona: "Morales", valor: 20000, tiempo: "2 a 3 días", via: "Coop. Transportadores del Sur de Bolívar" },
    { grupo: "Municipios del Sur de Bolívar", zona: "Montecristo", valor: 30000, tiempo: "2 a 4 días", via: "Transportador regional" },
    { grupo: "Municipios del Sur de Bolívar", zona: "Cantagallo", valor: 22000, tiempo: "2 a 3 días", via: "Transportador regional" },
    { grupo: "Municipios del Sur de Bolívar", zona: "Arenal", valor: 25000, tiempo: "2 a 4 días", via: "Transportador regional" },
    { grupo: "Municipios del Sur de Bolívar", zona: "Río Viejo", valor: 25000, tiempo: "2 a 4 días", via: "Transportador regional" },
    { grupo: "Municipios del Sur de Bolívar", zona: "Tiquisio", valor: 30000, tiempo: "3 a 5 días", via: "Transportador regional" },
    { grupo: "Otras ciudades", zona: "Barrancabermeja", valor: 20000, tiempo: "2 a 3 días", via: "Inter Rapidísimo / Servientrega / Coordinadora" },
    { grupo: "Otras ciudades", zona: "Aguachica", valor: 20000, tiempo: "2 a 3 días", via: "Inter Rapidísimo / Servientrega / Coordinadora" },
    { grupo: "Otras ciudades", zona: "Bucaramanga", valor: 22000, tiempo: "2 a 4 días", via: "Inter Rapidísimo / Servientrega / Coordinadora" },
    { grupo: "Otras ciudades", zona: "Otra ciudad de Colombia", valor: 25000, tiempo: "3 a 6 días", via: "Inter Rapidísimo / Servientrega / Coordinadora" }
  ],

  // Formas de pago que se muestran al cliente.
  pagos: ["Nequi", "PSE", "Tarjeta", "Contraentrega"]
};
