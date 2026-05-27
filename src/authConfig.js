/**
 * authConfig.js — Configuración de Azure AD / Microsoft Entra ID
 * ──────────────────────────────────────────────────────────────
 * PASOS PARA CONFIGURAR EN AZURE:
 *
 * 1. Portal Azure (portal.azure.com) → Microsoft Entra ID
 * 2. Registros de aplicaciones → Nueva registro
 *    - Nombre: "Encuesta Madurez Datos Hortifrut"
 *    - Tipos de cuenta: "Solo cuentas de este directorio organizativo"
 *    - URI de redirección: Aplicación de página única (SPA)
 *      → https://TU_USUARIO.github.io/encuesta-madurez-datos/
 *      → http://localhost:5173  (para desarrollo local)
 * 3. Copiar:
 *    - "Id. de aplicación (cliente)" → VITE_AZURE_CLIENT_ID en .env
 *    - "Id. de directorio (inquilino)" → VITE_AZURE_TENANT_ID en .env
 * 4. En "Autenticación" → habilitar "Tokens de acceso" y "Tokens de id."
 *
 * NO se necesita crear secreto de cliente (es una SPA pública).
 */

export const msalConfig = {
  auth: {
    clientId:    import.meta.env.VITE_AZURE_CLIENT_ID  || 'TU_CLIENT_ID',
    authority:  `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'TU_TENANT_ID'}`,
    redirectUri: window.location.origin + window.location.pathname.replace(/\/[^/]*\.html$/, '/'),
  },
  cache: {
    cacheLocation:        'sessionStorage', // no persiste entre pestañas por privacidad
    storeAuthStateInCookie: false,
  },
}

// Permisos que pedimos: solo perfil básico y email
export const loginRequest = {
  scopes: ['User.Read'],
}
