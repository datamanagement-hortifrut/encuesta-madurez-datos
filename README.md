# Encuesta de Madurez de Datos — Hortifrut

Aplicación web de encuesta para el grupo **G1 – Alta Dirección & C-Level**.  
Las respuestas se guardan automáticamente en **Google Sheets** a través de un Google Apps Script.

---

## Arquitectura

```
Encuestado (navegador)
    │  POST JSON
    ▼
Google Apps Script Web App   ←── actúa como API
    │  escribe fila
    ▼
Google Sheets (hoja "Respuestas_G1")
```

---

## Setup en 5 pasos

### 1 · Crear el Google Sheet

1. Abre [sheets.google.com](https://sheets.google.com) y crea un nuevo spreadsheet.  
   Nómbralo: `Encuesta Madurez Datos – Hortifrut`
2. La hoja `Respuestas_G1` y sus encabezados se crean solos al recibir la primera respuesta.

---

### 2 · Crear el Apps Script

1. En el spreadsheet: **Extensiones → Apps Script**
2. Borra el código existente y pega el contenido de [`scripts/appscript.js`](scripts/appscript.js)
3. Guarda el proyecto (Ctrl+S). Nómbralo: `Encuesta API`

---

### 3 · Desplegar el Apps Script como Web App

1. Clic en **Implementar → Nueva implementación**
2. Tipo: **Aplicación web**
3. Configurar:
   - **Ejecutar como:** Yo (tu cuenta de Google)
   - **Quién tiene acceso:** Cualquier usuario
4. Clic en **Implementar**
5. Autoriza los permisos cuando te lo pida
6. **Copia la URL** del deployment (formato: `https://script.google.com/macros/s/ABC.../exec`)

---

### 4 · Configurar la app

```bash
# Clona el repo
git clone https://github.com/TU_ORG/encuesta-madurez-datos.git
cd encuesta-madurez-datos

# Instala dependencias
npm install

# Crea el archivo de configuración
cp .env.example .env
```

Edita `.env` y pega la URL del paso anterior:

```env
VITE_SHEET_URL=https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec
```

---

### 5 · Desarrollo y build

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

## Deploy en GitHub Pages

```bash
# Instala gh-pages
npm install -D gh-pages

# Agrega en package.json:
# "homepage": "https://TU_ORG.github.io/encuesta-madurez-datos",
# "deploy": "gh-pages -d dist"

npm run build
npm run deploy
```

> ⚠️ **Importante:** Al hacer build para GitHub Pages, `VITE_SHEET_URL` se embebe en el bundle.  
> La URL del Apps Script es pública de todas formas (es la que recibe los POST), así que esto es seguro.

---

## Estructura del proyecto

```
encuesta-madurez-datos/
├── src/
│   ├── App.jsx              # Componente principal con el flujo completo
│   ├── main.jsx             # Entry point React
│   ├── index.css            # Estilos globales
│   ├── googleSheets.js      # Servicio de envío a Google Sheets
│   ├── questions.json       # 105 preguntas con opciones de respuesta
│   ├── employees_g1.json    # 27 empleados del grupo G1
│   └── groupCodes.json      # Mapa grupo_audiencia → código
├── scripts/
│   └── appscript.js         # Código para Google Apps Script
├── .env.example             # Template de variables de entorno
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Flujo de la encuesta

```
1. Lookup       → el encuestado busca su nombre
2. Survey       → responde dimensión por dimensión (no puede avanzar sin completar)
3. Review       → resumen, puede volver a editar
4. Submit       → POST a Apps Script → fila en Google Sheets
5. Success      → pantalla de confirmación
```

---

## Google Sheets — estructura de columnas

| Timestamp | Email | Nombre | Cargo | País | Grupo | Grupo Nombre | P0201 | P0202 | … | P2205 |
|-----------|-------|--------|-------|------|-------|--------------|-------|-------|---|-------|

- Cada celda de pregunta contiene el **ID de la respuesta seleccionada** (ej: `R020103`)
- Si el mismo email vuelve a responder, la fila se **actualiza** (no duplica)

---

## Escalabilidad — agregar más grupos

Para crear el formulario del grupo G2:

1. Copia `src/App.jsx` → `src/App_G2.jsx`
2. Cambia `GROUP_CODE = 'G2'`, `GROUP_NAME`, `employees_g2.json`
3. En `appscript.js` agrega los IDs de preguntas de G2 y el nombre de hoja `Respuestas_G2`
4. Crea una nueva ruta o página separada

---

## Tecnologías

- **React 18** + **Vite 5**
- **Google Apps Script** (backend serverless sin costo)
- **Google Sheets** (base de datos)
- CSS puro (sin dependencias de UI)
