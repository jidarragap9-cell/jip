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
  garantia: "según el producto (se indica en cada producto)",

  // Tu número de WhatsApp con indicativo de Colombia (57), sin espacios ni "+".
  // Aquí llegan los pedidos.
  whatsapp: "573177986779",

  // Enlace CSV de la hoja de Google con tus productos
  // (Archivo > Compartir > Publicar en la web > Formato CSV).
  // Mientras esté vacío, la tienda muestra los productos de "productos.csv".
  hojaCSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfONhHMWE0cfWH-95ZF38e0RQ9hM9EFcJu5pfFrgHQtEtKZTywAVakTQS_DQVKFWVcl-GvlNi7PT7Y/pub?gid=0&single=true&output=csv",

  // Ofertas de hoy: URL de la aplicación web de Apps Script de la hoja (termina en /exec).
  // Mientras esté vacía, la sección de ofertas no aparece.
  ofertasURL: "",

  // Envíos: ahora están en el archivo envios.js (Santa Rosa, veredas y todo el país).

  // Formas de pago que se muestran al cliente.
  // Productos POR ENCARGO: el cliente separa con un anticipo y llega en X días hábiles.
  // En productos.csv escribe "Sí" en la columna "Encargo".
  // Subcategorías del menú (se pueden agregar más). En la hoja, columna "Subcategoría".
  subcategorias: {
    "Tecnología": ["Cargadores", "Cables", "Audífonos", "Relojes inteligentes", "Accesorios para celular"],
    "Belleza": ["Maquillaje", "Cuidado del cabello", "Cuidado de la piel", "Perfumes", "Uñas"],
    "Moda": ["Gorras", "Bolsos y billeteras", "Relojes", "Gafas", "Ropa"],
    "Calzado": ["Tenis hombre", "Tenis mujer", "Sandalias", "Zapatos"],
    "Hogar": ["Cocina", "Decoración", "Organización", "Limpieza"]
  },
  encargo: { anticipo: 50000, dias: 20 }, // anticipo fijo en pesos por unidad (si es menor que 1, se toma como %)

  // Llave Bre-B y QR que se muestran en la portada. qr: ruta de la imagen, ej. "img/qr-breb.png".
  breb: { llave: "", qr: "" },

  pagos: ["Llave Bre-B", "Nequi", "PSE", "Tarjeta", "Contraentrega"]
};
