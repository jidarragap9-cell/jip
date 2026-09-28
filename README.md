# J&P del Sur · Tienda online

Página de la tienda. Es gratis de alojar (GitHub Pages); solo se paga el dominio.

- **Productos:** se cargan desde un Formulario de Google.
- **Pedidos:** llegan a tu WhatsApp con el detalle y el valor del envío.
- **Configuración:** todo lo que se edita está en `config.js`.

---

## 1. Poner la página en línea (una sola vez)

1. En GitHub, abre este repositorio y entra a **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**. Luego elige la rama **main** y la carpeta **/ (root)** y pulsa **Save**.
3. En unos minutos aparece la dirección de tu página en esa misma pantalla.

## 2. Poner tu WhatsApp

1. Abre `config.js` y pulsa el lápiz ✏️ para editar.
2. Cambia `573000000000` por tu número: primero `57` y luego el celular, sin espacios.
3. Pulsa **Commit changes**.

## 3. Cargar productos con un Formulario de Google

### Crear el formulario (una sola vez)

En [forms.google.com](https://forms.google.com) crea un formulario con estas preguntas. Los títulos deben quedar exactamente así:

| Pregunta | Tipo | ¿Obligatoria? |
|---|---|---|
| Nombre | Respuesta corta | Sí |
| Precio | Respuesta corta (solo números) | Sí |
| Precio antes | Respuesta corta (para mostrar descuento) | No |
| Categoría | Desplegable: Tecnología, Herramientas, Hogar, Moda, Perfumería, Calzado… | Sí |
| Características | Párrafo (una por línea) | No |
| Fotos | Subir archivos (imágenes, hasta 10) | Sí |
| Video | Respuesta corta (enlace de YouTube) | No |
| Peso kg | Respuesta corta | No |
| Destacado | Opción múltiple: Sí / No | No |

### Conectarlo a la tienda (una sola vez)

1. En la pestaña **Respuestas**, pulsa **Vincular con Hojas de cálculo** para crear la hoja.
2. En Google Drive busca la carpeta donde se guardan las fotos del formulario y compártela con **Cualquier persona con el enlace → Lector**. Sin este paso, las fotos no se ven en la página.
3. En la hoja entra a **Archivo → Compartir → Publicar en la web**. Elige la hoja de respuestas y el formato **CSV**, pulsa **Publicar** y copia el enlace.
4. Pega ese enlace en `config.js`, en `hojaCSV: ""`, entre las comillas.

### Uso diario

Llena el formulario desde el celular. El producto aparece en la página en unos 5 minutos.

- **Ocultar un producto agotado:** agrega en la hoja una columna llamada **Ocultar** y escribe **sí** en la fila del producto.
- **Cambiar un precio:** edítalo directamente en la hoja.

## 4. Dominio propio (jipdelsur.com)

1. Compra el dominio en Cloudflare, Namecheap o GoDaddy. Cuesta alrededor de USD 10 a 15 al año.
2. En la configuración DNS del dominio crea estos registros:
   - Cuatro registros **A** con estas IP: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y `185.199.111.153`.
   - Un registro **CNAME** con nombre `www` que apunte a `jidarragap9-cell.github.io`.
3. En **Settings → Pages → Custom domain** escribe `jipdelsur.com`, pulsa **Save** y activa **Enforce HTTPS**.

## Tarifas de envío

Están en `config.js`, en la sección `envios`. Cada zona tiene:

- **base:** valor fijo del envío.
- **porKg:** valor por cada kilo.
- **tiempo:** tiempo de entrega que ve el cliente.

Cambia los valores de ejemplo por los reales de las transportadoras.
