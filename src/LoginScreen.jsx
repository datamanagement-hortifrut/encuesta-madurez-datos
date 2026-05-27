/**
 * LoginScreen.jsx — Un solo link, el empleado ingresa su correo
 * y la app lo redirige automáticamente al grupo que le corresponde.
 * Soporta SSO Azure AD o ingreso manual de email (fallback).
 */
import { useState } from 'react'
import { t } from './i18n.js'

/* ── Selector de idioma ── */
export function LangSelector({ lang, setLang, inHeader = false }) {
  const base = inHeader ? 'lang-selector lang-selector--header' : 'lang-selector'
  return (
    <div className={base}>
      <button
        className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
        onClick={() => setLang('es')}
        aria-label="Español"
      >
        🇪🇸 ES
      </button>
      <span className="lang-divider">|</span>
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => setLang('en')}
        aria-label="English"
      >
        🇬🇧 EN
      </button>
    </div>
  )
}

/* ── Login con SSO Microsoft ── */
export function LoginSSO({ lang, setLang, onLogin, loading }) {
  return (
    <div className="login-shell">
      <div className="login-card">
        <LangSelector lang={lang} setLang={setLang} />

        <div className="login-logo">
          <div className="login-logo-box">HF</div>
        </div>

        <h1 className="login-title">{t(lang, 'loginTitle')}</h1>
        <p className="login-subtitle">{t(lang, 'loginSubtitle')}</p>
        <p className="login-desc">{t(lang, 'loginDesc')}</p>

        <button className="btn-ms" onClick={onLogin} disabled={loading}>
          {loading
            ? <><span className="spinner-sm" /> {t(lang, 'loginVerifying')}</>
            : <>
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none" aria-hidden="true">
                  <rect x="1"  y="1"  width="9" height="9" fill="#F35325"/>
                  <rect x="11" y="1"  width="9" height="9" fill="#81BC06"/>
                  <rect x="1"  y="11" width="9" height="9" fill="#05A6F0"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFBA08"/>
                </svg>
                {t(lang, 'loginBtnMs')}
              </>
          }
        </button>

        <p className="login-note">{t(lang, 'loginNote')}</p>
      </div>
    </div>
  )
}

/* ── Login manual por email (sin SSO) ── */
export function LoginEmail({ lang, setLang, onSubmit, loading, error }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <LangSelector lang={lang} setLang={setLang} />

        <div className="login-logo">
          <div className="login-logo-box">HF</div>
        </div>

        <h1 className="login-title">{t(lang, 'loginTitle')}</h1>
        <p className="login-subtitle">{t(lang, 'loginSubtitle')}</p>
        <p className="login-desc">{t(lang, 'loginDesc')}</p>

        <form onSubmit={handleSubmit}>
          <div className="field-group" style={{ marginBottom: 16 }}>
            <label style={{ display:'block', fontSize:'.82rem', fontWeight:600,
              color:'var(--gray-700)', marginBottom:5 }}>
              {t(lang, 'loginEmailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t(lang, 'loginEmailPh')}
              autoFocus
              required
              style={{ width:'100%', padding:'11px 13px',
                border:'1.5px solid var(--gray-300)', borderRadius:8,
                fontSize:'.95rem', outline:'none', fontFamily:'inherit' }}
              onFocus={e => e.target.style.borderColor='var(--green)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-300)'}
            />
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom:12 }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !email.trim()}
          >
            {loading
              ? <><span className="spinner-sm" style={{ borderTopColor:'#fff' }} /> {t(lang, 'loginSearching')}</>
              : t(lang, 'loginBtn')
            }
          </button>
        </form>

        <p className="login-note" style={{ marginTop:16 }}>
          {t(lang, 'loginNote')}
        </p>
      </div>
    </div>
  )
}

/* ── Not Found ── */
export function NotFoundScreen({ lang, setLang, email, onRetry }) {
  return (
    <div className="login-shell">
      <div className="login-card">
        <LangSelector lang={lang} setLang={setLang} />
        <div style={{ fontSize:'2.5rem', textAlign:'center', marginBottom:12 }}>🔍</div>
        <h2 style={{ textAlign:'center', marginBottom:8 }}>
          {t(lang, 'notFoundTitle')}
        </h2>
        <p style={{ color:'var(--gray-500)', fontSize:'.9rem',
          textAlign:'center', lineHeight:1.6 }}>
          {t(lang, 'notFoundDesc', { email })}
        </p>
        <p style={{ color:'var(--gray-500)', fontSize:'.85rem',
          textAlign:'center', marginTop:8 }}>
          {t(lang, 'notFoundHelp')}
        </p>
        <button className="btn btn-secondary btn-full"
          style={{ marginTop:20 }} onClick={onRetry}>
          {t(lang, 'notFoundBtn')}
        </button>
      </div>
    </div>
  )
}

/* ── Loading ── */
export function LoadingScreen({ lang, message }) {
  return (
    <div className="login-shell">
      <div className="login-card" style={{ textAlign:'center' }}>
        <div className="spinner" style={{ margin:'0 auto 20px' }} />
        <p style={{ color:'var(--gray-600)', fontSize:'.95rem' }}>
          {message || t(lang, 'loadingInit')}
        </p>
      </div>
    </div>
  )
}
