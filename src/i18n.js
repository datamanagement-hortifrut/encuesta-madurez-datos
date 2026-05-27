/**
 * i18n.js — Traducciones español / inglés
 */
export const TRANSLATIONS = {
  es: {
    // App header
    appTitle:       'Encuesta Madurez de Datos',
    appSubtitle:    'Hortifrut',

    // Login
    loginTitle:     'Encuesta de Madurez de Datos',
    loginSubtitle:  'Hortifrut · Datos Corporativos',
    loginDesc:      'Ingresa tu correo corporativo para acceder a la encuesta que corresponde a tu perfil.',
    loginEmailLabel:'Correo corporativo',
    loginEmailPh:   'tu.nombre@hortifrut.com',
    loginBtn:       'Acceder a mi encuesta',
    loginBtnMs:     'Iniciar sesión con Microsoft',
    loginNote:      'Solo empleados de Hortifrut con cuenta corporativa pueden acceder.',
    loginVerifying: 'Verificando…',
    loginSearching: 'Buscando tu perfil…',

    // Not found
    notFoundTitle:  'Cuenta no encontrada',
    notFoundDesc:   'El correo {email} no está registrado como participante de esta encuesta.',
    notFoundHelp:   'Si crees que esto es un error, contacta al equipo de Datos.',
    notFoundBtn:    'Intentar con otro correo',

    // Loading
    loadingInit:    'Iniciando…',
    loadingProfile: 'Identificando tu perfil…',
    loadingLogin:   'Iniciando sesión…',

    // Survey header
    progress:       'Progreso total',
    answered:       'respondidas',
    editMode:       '✏️ Modo edición — tus respuestas anteriores están precargadas.',

    // Navigation
    prev:           '← Anterior',
    next:           'Siguiente →',
    finish:         '✓ Finalizar encuesta',
    answerAll:      'Responde todas las preguntas de esta dimensión para continuar.',

    // Review
    reviewTitle:    'Resumen de tu encuesta',
    reviewTitleEdit:'Revisión de cambios',
    reviewDesc:     'Revisa tus respuestas antes de enviar.',
    reviewDescEdit: 'Revisa tus respuestas actualizadas antes de guardar.',
    reviewEditBanner:'✏️ Al enviar, reemplazarás tus respuestas anteriores.',
    respondent:     'ENCUESTADO',
    dimComplete:    '✓ Completa',
    editAnswers:    '← Editar respuestas',
    submit:         '📤 Enviar respuestas',
    saveChanges:    '💾 Guardar cambios',
    sending:        'Guardando…',
    missingQ:       'Faltan {n} preguntas sin responder.',

    // Already answered
    alreadyTitle:   'Ya respondiste esta encuesta',
    alreadyDate:    'Última respuesta:',
    alreadyHint:    'Puedes editar — tus respuestas anteriores estarán precargadas.',
    alreadyEdit:    '✏️ Editar mis respuestas',
    alreadyNew:     '🔄 Empezar de cero',

    // Success
    successTitleNew:  '¡Gracias, {name}!',
    successTitleEdit: '¡Listo, {name}!',
    successMsgNew:    'Tus respuestas han sido registradas exitosamente.',
    successMsgEdit:   'Tus respuestas han sido actualizadas correctamente.',
    successSub:       'Tu opinión es clave para la estrategia de datos de Hortifrut.',
    successClose:     'Puedes cerrar esta ventana.',

    // Sending overlay
    overlayNew:     'Guardando tus respuestas…',
    overlayEdit:    'Actualizando tus respuestas…',
    overlayWarn:    'No cierres esta ventana',

    // Logout
    logout:         'Cerrar sesión',

    // Dimension
    dimOf:          'de',
    dimAnswered:    'preguntas respondidas en esta dimensión',
  },

  en: {
    appTitle:       'Data Maturity Survey',
    appSubtitle:    'Hortifrut',

    loginTitle:     'Data Maturity Survey',
    loginSubtitle:  'Hortifrut · Corporate Data',
    loginDesc:      'Enter your corporate email to access the survey that matches your profile.',
    loginEmailLabel:'Corporate email',
    loginEmailPh:   'your.name@hortifrut.com',
    loginBtn:       'Access my survey',
    loginBtnMs:     'Sign in with Microsoft',
    loginNote:      'Only Hortifrut employees with a corporate account can access.',
    loginVerifying: 'Verifying…',
    loginSearching: 'Looking up your profile…',

    notFoundTitle:  'Account not found',
    notFoundDesc:   'The email {email} is not registered as a survey participant.',
    notFoundHelp:   'If you think this is an error, contact the Data team.',
    notFoundBtn:    'Try a different email',

    loadingInit:    'Starting…',
    loadingProfile: 'Identifying your profile…',
    loadingLogin:   'Signing in…',

    progress:       'Overall progress',
    answered:       'answered',
    editMode:       '✏️ Edit mode — your previous answers are pre-loaded.',

    prev:           '← Previous',
    next:           'Next →',
    finish:         '✓ Finish survey',
    answerAll:      'Answer all questions in this dimension to continue.',

    reviewTitle:    'Survey summary',
    reviewTitleEdit:'Review changes',
    reviewDesc:     'Review your answers before submitting.',
    reviewDescEdit: 'Review your updated answers before saving.',
    reviewEditBanner:'✏️ Submitting will replace your previous answers.',
    respondent:     'RESPONDENT',
    dimComplete:    '✓ Complete',
    editAnswers:    '← Edit answers',
    submit:         '📤 Submit answers',
    saveChanges:    '💾 Save changes',
    sending:        'Saving…',
    missingQ:       '{n} questions still unanswered.',

    alreadyTitle:   'You already completed this survey',
    alreadyDate:    'Last response:',
    alreadyHint:    'You can edit — your previous answers will be pre-loaded.',
    alreadyEdit:    '✏️ Edit my answers',
    alreadyNew:     '🔄 Start over',

    successTitleNew:  'Thank you, {name}!',
    successTitleEdit: 'Done, {name}!',
    successMsgNew:    'Your answers have been successfully recorded.',
    successMsgEdit:   'Your answers have been successfully updated.',
    successSub:       'Your input is key to Hortifrut\'s data strategy.',
    successClose:     'You may close this window.',

    overlayNew:     'Saving your answers…',
    overlayEdit:    'Updating your answers…',
    overlayWarn:    'Do not close this window',

    logout:         'Sign out',

    dimOf:          'of',
    dimAnswered:    'questions answered in this dimension',
  }
}

// Reemplazar placeholders {key} con valores
export function t(lang, key, vars = {}) {
  const str = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.es[key] ?? key
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), str)
}

// Detectar idioma del navegador como default
export function detectLang() {
  const nav = navigator.language || 'es'
  return nav.startsWith('en') ? 'en' : 'es'
}
