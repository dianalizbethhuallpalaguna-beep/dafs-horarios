# DAFS · Horarios de Laboratorios de Física

Primera versión de la página web para publicar en GitHub Pages.

## Qué incluye

- Página responsive para celulares.
- 7 pestañas de horarios.
- Datos iniciales tomados del Word entregado.
- Búsqueda por carrera/docente/grupo.
- Filtro por día.
- Modo pantalla institucional.
- QR dinámico y permanente: apunta a la URL actual de la página.
- Carrusel promocional preparado para fotos y videos.
- Sin Java, Python, Node.js ni servidor local para publicar.

## Importante sobre el documento fuente

El Word contiene 5 tablas principales, una sección de Mecánica A repetida y un espacio reservado para el séptimo horario no incluido todavía. Por eso esta primera versión conserva la información sin inventar datos y deja dos espacios editables.

## Cómo probarlo

1. Descomprime el ZIP.
2. Abre `index.html` con Chrome.
3. Para probar modo pantalla, abre:
   `index.html?modo=pantalla`
4. El QR local no será útil hasta publicar la página en Internet.

## Cómo publicar gratis en GitHub Pages

1. Crea una cuenta en https://github.com/
2. Crea un repositorio público, por ejemplo `dafs-horarios`.
3. Sube todo el contenido de esta carpeta al repositorio.
4. Ve a `Settings` → `Pages`.
5. En `Build and deployment`, selecciona `Deploy from a branch`.
6. Elige `main` y carpeta `/root`.
7. Guarda.
8. GitHub mostrará la URL pública.

La página genera el QR usando automáticamente esa URL pública, por lo que no necesitas crear otro QR cada mes.

## Para actualizar horarios

Los datos están en:
`js/schedules.js`

Las fotografías deben colocarse en:
`assets/fotos/`

Los videos en:
`assets/videos/`

## Próximo paso recomendado

Cuando se tengan las fotos y videos reales, se reemplazarán los espacios de demostración por un carrusel audiovisual. También conviene confirmar el séptimo horario y revisar la duplicación de Mecánica A antes de la publicación definitiva.
