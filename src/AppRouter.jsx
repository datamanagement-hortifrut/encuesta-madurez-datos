/**
 * AppRouter.jsx — Sin SSO.
 * Flujo: el empleado ingresa su email → se detecta su grupo
 * → responde directamente la encuesta de su grupo.
 * Un solo link para los 11 grupos.
 */
import { useState, createContext, useContext } from 'react'
import { resolveGroup }     from './groupResolver.js'
import { getExistingAnswers } from './googleSheets.js'
import { LoginEmail, NotFoundScreen, LoadingScreen } from './LoginScreen.jsx'
import SurveyApp from './SurveyApp.jsx'
import questionsAll from './data/questions.json'
import { detectLang, t } from './i18n.js'

export const LangContext = createContext({ lang:'es', setLang:()=>{} })
export const useLang = () => useContext(LangContext)

export default function AppRouter() {
  const [lang,     setLang]    = useState(detectLang)
  const [screen,   setScreen]  = useState('login')   // login | loading | notfound | survey
  const [email,    setEmail]   = useState('')
  const [error,    setError]   = useState(null)
  const [loading,  setLoading] = useState(false)
  const [resolved, setResolved] = useState(null)

  const handleEmailSubmit = async (submittedEmail) => {
    setLoading(true)
    setError(null)
    setEmail(submittedEmail)
    setScreen('loading')

    try {
      // 1. Buscar en qué grupo está el email
      const match = await resolveGroup(submittedEmail)
      if (!match) {
        setScreen('notfound')
        return
      }

      // 2. Filtrar preguntas de su grupo
      const questions = questionsAll.filter(q => q.grupos.includes(match.group.code))

      // 3. Verificar si ya respondió antes (para precargar respuestas)
      const prior = await getExistingAnswers(submittedEmail)

      setResolved({
        group:    match.group,
        employee: {
          ...match.employee,
          email: submittedEmail,
        },
        questions,
        prior: prior.found ? prior : null,
      })
      setScreen('survey')

    } catch {
      setError(lang === 'en'
        ? 'Connection error. Please try again.'
        : 'Error de conexión. Inténtalo de nuevo.')
      setScreen('login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setScreen('login')
    setResolved(null)
    setEmail('')
    setError(null)
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>

      {screen === 'login' && (
        <LoginEmail
          lang={lang}
          setLang={setLang}
          onSubmit={handleEmailSubmit}
          loading={loading}
          error={error}
        />
      )}

      {screen === 'loading' && (
        <LoadingScreen lang={lang} message={t(lang, 'loadingProfile')} />
      )}

      {screen === 'notfound' && (
        <NotFoundScreen
          lang={lang}
          setLang={setLang}
          email={email}
          onRetry={handleLogout}
        />
      )}

      {screen === 'survey' && resolved && (
        <SurveyApp
          lang={lang}
          setLang={setLang}
          groupCode={resolved.group.code}
          groupName={resolved.group.name}
          groupColor={resolved.group.color}
          sheetName={resolved.group.sheetName}
          questions={resolved.questions}
          ssoEmployee={resolved.employee}
          initialAnswers={resolved.prior?.answers || {}}
          isEditMode={!!resolved.prior}
          onLogout={handleLogout}
        />
      )}

    </LangContext.Provider>
  )
}
