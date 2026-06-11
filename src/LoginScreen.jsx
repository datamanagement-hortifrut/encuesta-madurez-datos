import { useState } from 'react'
import { t, LANGS } from './i18n.js'

/* ── Selector de idioma ── */
export function LangSelector({ lang, setLang, inHeader = false }) {
  const [open, setOpen] = useState(false)
  const current = LANGS.find(l => l.code === lang) || LANGS[0]

  if (inHeader) {
    return (
      <div style={{ position:'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)',
            color:'#fff', borderRadius:6, padding:'4px 10px',
            fontSize:'.75rem', fontWeight:600, cursor:'pointer',
            fontFamily:'inherit', display:'flex', alignItems:'center', gap:5,
          }}
        >
          {current.flag} {current.label} ▾
        </button>
        {open && (
          <div style={{
            position:'absolute', top:'calc(100% + 6px)', right:0,
            background:'#fff', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,.15)',
            overflow:'hidden', zIndex:500, minWidth:140,
          }}
            onMouseLeave={() => setOpen(false)}
          >
            {LANGS.map(l => (
              <button key={l.code}
                onClick={() => { setLang(l.code); setOpen(false) }}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  width:'100%', padding:'9px 14px', border:'none',
                  background: l.code === lang ? 'var(--green-lt)' : '#fff',
                  color: l.code === lang ? 'var(--green)' : '#374151',
                  fontSize:'.82rem', fontWeight: l.code === lang ? 600 : 400,
                  cursor:'pointer', fontFamily:'inherit', textAlign:'left',
                }}
              >
                <span>{l.flag}</span>
                <span>{l.name}</span>
                {l.code === lang && <span style={{ marginLeft:'auto' }}>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // En la pantalla de login — versión horizontal compacta con dropdown
  return (
    <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16, position:'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background:'transparent', border:'1.5px solid var(--gray-300)',
          borderRadius:8, padding:'5px 12px',
          fontSize:'.78rem', fontWeight:600, cursor:'pointer',
          color:'var(--gray-600)', fontFamily:'inherit',
          display:'flex', alignItems:'center', gap:6,
        }}
      >
        {current.flag} {current.label} — {current.name} ▾
      </button>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', right:0,
          background:'#fff', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,.12)',
          overflow:'hidden', zIndex:500, minWidth:160,
        }}
          onMouseLeave={() => setOpen(false)}
        >
          {LANGS.map(l => (
            <button key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              style={{
                display:'flex', alignItems:'center', gap:8,
                width:'100%', padding:'9px 14px', border:'none',
                background: l.code === lang ? 'var(--green-lt)' : '#fff',
                color: l.code === lang ? 'var(--green)' : '#374151',
                fontSize:'.82rem', fontWeight: l.code === lang ? 600 : 400,
                cursor:'pointer', fontFamily:'inherit', textAlign:'left',
              }}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
              {l.code === lang && <span style={{ marginLeft:'auto', color:'var(--green)' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Login por email ── */
export function LoginEmail({ lang, setLang, onSubmit, loading, error }) {
  const isRtl = lang === 'ar'

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value.trim().toLowerCase()
    if (email) onSubmit(email)
  }

  return (
    <div className="login-shell" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="login-card">
        <LangSelector lang={lang} setLang={setLang} />

        <div className="login-logo">
          <div className="login-logo-box">HF</div>
        </div>

        <h1 className="login-title">{t(lang, 'loginTitle')}</h1>
        <p className="login-subtitle">{t(lang, 'loginSubtitle')}</p>
        <p className="login-desc">{t(lang, 'loginDesc')}</p>

        <form onSubmit={handleSubmit}>
          <div className="field-group" style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:'.82rem', fontWeight:600,
              color:'var(--gray-700)', marginBottom:5 }}>
              {t(lang, 'loginEmailLabel')}
            </label>
            <input
              name="email"
              type="email"
              placeholder={t(lang, 'loginEmailPh')}
              autoFocus
              required
              dir="ltr"
              style={{ width:'100%', padding:'11px 13px',
                border:'1.5px solid var(--gray-300)', borderRadius:8,
                fontSize:'.95rem', outline:'none', fontFamily:'inherit' }}
              onFocus={e => e.target.style.borderColor='var(--green)'}
              onBlur={e  => e.target.style.borderColor='var(--gray-300)'}
            />
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom:12 }}>⚠ {error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading
              ? <><span className="spinner-sm" style={{ borderTopColor:'#fff' }} /> {t(lang,'loginSearching')}</>
              : t(lang, 'loginBtn')}
          </button>
        </form>

        {/* Disclaimer IA */}
        <div style={{
          marginTop:16, padding:'10px 12px',
          background:'#fffbeb', border:'1px solid #fde68a',
          borderRadius:8, fontSize:'.75rem', color:'#92400e',
          lineHeight:1.5, textAlign: isRtl ? 'right' : 'left',
        }}>
          {t(lang, 'aiDisclaimer')}
        </div>

        <p className="login-note" style={{ marginTop:12, textAlign: isRtl ? 'right' : 'center' }}>
          {t(lang, 'loginNote')}
        </p>
      </div>
    </div>
  )
}

/* ── Not Found ── */
export function NotFoundScreen({ lang, setLang, email, onRetry }) {
  const isRtl = lang === 'ar'
  return (
    <div className="login-shell" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="login-card">
        <LangSelector lang={lang} setLang={setLang} />
        <div style={{ fontSize:'2.5rem', textAlign:'center', marginBottom:12 }}>🔍</div>
        <h2 style={{ textAlign:'center', marginBottom:8 }}>{t(lang, 'notFoundTitle')}</h2>
        <p style={{ color:'var(--gray-500)', fontSize:'.9rem', textAlign:'center', lineHeight:1.6 }}>
          {t(lang, 'notFoundDesc', { email })}
        </p>
        <p style={{ color:'var(--gray-500)', fontSize:'.85rem', textAlign:'center', marginTop:8 }}>
          {t(lang, 'notFoundHelp')}
        </p>
        <button className="btn btn-secondary btn-full" style={{ marginTop:20 }} onClick={onRetry}>
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
        <p style={{ color:'var(--gray-600)', fontSize:'.95rem' }}>{message}</p>
      </div>
    </div>
  )
}
