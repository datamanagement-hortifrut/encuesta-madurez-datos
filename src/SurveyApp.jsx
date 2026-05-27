/**
 * SurveyApp.jsx — Formulario de encuesta genérico, bilingüe.
 * Recibe lang/setLang del AppRouter y aplica traducciones en toda la UI.
 */
import { useState, useMemo, useCallback } from 'react'
import { submitToSheet, getExistingAnswers } from './googleSheets.js'
import { LangSelector } from './LoginScreen.jsx'
import { t } from './i18n.js'

function formatDate(iso, lang) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(lang === 'en' ? 'en-GB' : 'es-CL', {
      day:'2-digit', month:'short', year:'numeric',
      hour:'2-digit', minute:'2-digit',
    })
  } catch { return iso }
}

function buildDimensions(questions) {
  const map = new Map()
  questions.forEach(q => {
    if (!map.has(q.dimension))
      map.set(q.dimension, {
        label:    q.dimension_short,
        label_en: q.dimension_short_en || q.dimension_short,
        questions: []
      })
    map.get(q.dimension).questions.push(q)
  })
  return Array.from(map.values())
}

/* ── Progress Bar ── */
function ProgressBar({ current, total, lang }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{t(lang,'progress')}</span>
        <span>{current} / {total} {t(lang,'answered')} ({pct}%)</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width:`${pct}%` }} />
      </div>
    </div>
  )
}

/* ── Question Card ── */
function QuestionCard({ question, value, onChange, lang }) {
  const qText   = lang === 'en' && question.pregunta_en  ? question.pregunta_en  : question.pregunta
  return (
    <div className={`q-card ${value ? 'answered' : ''}`}>
      <div className="q-id">{question.id}</div>
      <div className="q-text">{qText}</div>
      <div className="options">
        {question.opciones.map(opt => {
          const optText = lang === 'en' && opt.texto_en ? opt.texto_en : opt.texto
          return (
            <label key={opt.id} className={`opt-label ${value === opt.id ? 'active' : ''}`}>
              <input type="radio" name={question.id} value={opt.id}
                checked={value === opt.id}
                onChange={() => onChange(question.id, opt.id)} />
              <span className="opt-text">{optText}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/* ── Step: Already answered banner (dentro del lookup) ── */
function AlreadyBanner({ lang, prior, onEdit, onNew }) {
  return (
    <div style={{ marginTop:16 }}>
      <div className="already-banner">
        <div className="already-icon">✓</div>
        <div className="already-body">
          <div className="already-title">{t(lang,'alreadyTitle')}</div>
          <div className="already-date">
            {t(lang,'alreadyDate')} {formatDate(prior.timestamp, lang)}
          </div>
          <div className="already-hint">{t(lang,'alreadyHint')}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:10, marginTop:12 }}>
        <button className="btn btn-secondary" style={{ flex:1 }} onClick={onEdit}>
          {t(lang,'alreadyEdit')}
        </button>
        <button className="btn btn-primary" style={{ flex:1 }} onClick={onNew}>
          {t(lang,'alreadyNew')}
        </button>
      </div>
    </div>
  )
}

/* ── Step Survey ── */
function StepSurvey({ lang, dimensions, isEdit, existingAnswers, onFinish, initialDim }) {
  const [dimIndex, setDimIndex] = useState(initialDim)
  const [answers,  setAnswers]  = useState(existingAnswers)

  const totalQ     = dimensions.reduce((s, d) => s + d.questions.length, 0)
  const answered   = Object.keys(answers).length
  const dim        = dimensions[dimIndex]
  const dimAnsw    = dim.questions.filter(q => answers[q.id]).length
  const allDimDone = dim.questions.every(q => answers[q.id])
  const isLast     = dimIndex === dimensions.length - 1

  const handleChange = useCallback((qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: val }))
  }, [])

  return (
    <div className="page">
      {isEdit && <div className="edit-banner">{t(lang,'editMode')}</div>}
      <ProgressBar current={answered} total={totalQ} lang={lang} />
      <div className="dim-header">
        <div className="dim-name">
          {dimIndex + 1} {t(lang,'dimOf')} {dimensions.length} — {lang === 'en' && dim.label_en ? dim.label_en : dim.label}
        </div>
        <div className="dim-desc">
          {dimAnsw} {t(lang,'dimOf')} {dim.questions.length} {t(lang,'dimAnswered')}
        </div>
      </div>

      {dim.questions.map(q => (
        <QuestionCard key={q.id} question={q} value={answers[q.id]} onChange={handleChange} lang={lang} />
      ))}

      <div className="nav-row">
        {dimIndex > 0 && (
          <button className="btn btn-secondary" onClick={() => setDimIndex(i => i - 1)}>
            {t(lang,'prev')}
          </button>
        )}
        <div className="spacer" />
        <button className="btn btn-primary" disabled={!allDimDone}
          onClick={() => !isLast ? setDimIndex(i => i + 1) : onFinish(answers)}>
          {isLast ? t(lang,'finish') : t(lang,'next')}
        </button>
      </div>
      {!allDimDone && (
        <p style={{ textAlign:'right', fontSize:'.78rem', color:'var(--amber)', marginTop:8 }}>
          {t(lang,'answerAll')}
        </p>
      )}
    </div>
  )
}

/* ── Step Review ── */
function StepReview({ lang, employee, answers, dimensions, isEdit, onEdit, onSubmit, submitting, error }) {
  const totalQ   = dimensions.reduce((s, d) => s + d.questions.length, 0)
  const answered = Object.keys(answers).length
  return (
    <div className="page">
      <div className="card">
        <div className="summary-header">
          <h2>{t(lang, isEdit ? 'reviewTitleEdit' : 'reviewTitle')}</h2>
          <p>{t(lang, isEdit ? 'reviewDescEdit' : 'reviewDesc')}</p>
        </div>
        {isEdit && (
          <div className="edit-banner" style={{ marginBottom:16 }}>
            {t(lang,'reviewEditBanner')}
          </div>
        )}
        <div className="summary-grid">
          <div className="summary-stat">
            <div className="s-num">{answered}</div>
            <div className="s-label">{t(lang,'answered')}</div>
          </div>
          <div className="summary-stat">
            <div className="s-num">{totalQ - answered}</div>
            <div className="s-label">{lang === 'en' ? 'unanswered' : 'sin responder'}</div>
          </div>
        </div>
        <div style={{ marginBottom:20, padding:'14px', background:'var(--gray-100)', borderRadius:8 }}>
          <div style={{ fontSize:'.78rem', fontWeight:700, color:'var(--gray-500)', marginBottom:6 }}>
            {t(lang,'respondent')}
          </div>
          <div style={{ fontWeight:600 }}>{employee.nombre}</div>
          <div style={{ fontSize:'.82rem', color:'var(--gray-500)' }}>
            {employee.cargo} · {employee.pais}
          </div>
        </div>
        <div className="dim-review">
          {dimensions.map((d, i) => {
            const done   = d.questions.filter(q => answers[q.id]).length
            const status = done === d.questions.length ? 'complete' : done > 0 ? 'partial' : 'empty'
            return (
              <div key={i} className="dim-row" onClick={() => onEdit(i)}>
                <span style={{ fontSize:'.82rem' }}>{d.label}</span>
                <span className={`dim-status ${status}`}>
                  {done === d.questions.length ? t(lang,'dimComplete') : `${done}/${d.questions.length}`}
                </span>
              </div>
            )
          })}
        </div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        <div className="nav-row">
          <button className="btn btn-secondary" onClick={() => onEdit(0)}>
            {t(lang,'editAnswers')}
          </button>
          <div className="spacer" />
          <button className="btn btn-primary" onClick={onSubmit}
            disabled={submitting || answered < totalQ}>
            {submitting
              ? <>{t(lang,'sending')}</>
              : t(lang, isEdit ? 'saveChanges' : 'submit')}
          </button>
        </div>
        {answered < totalQ && (
          <p style={{ textAlign:'center', fontSize:'.78rem', color:'var(--amber)', marginTop:10 }}>
            {t(lang,'missingQ', { n: totalQ - answered })}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Step Success ── */
function StepSuccess({ lang, employee, isEdit }) {
  const firstName = (employee.nombre || '').split(' ')[0]
  return (
    <div className="page">
      <div className="card success-screen">
        <div className="success-icon">{isEdit ? '💾' : '🎉'}</div>
        <h2>{t(lang, isEdit ? 'successTitleEdit' : 'successTitleNew', { name: firstName })}</h2>
        <p>
          {t(lang, isEdit ? 'successMsgEdit' : 'successMsgNew')}<br />
          {t(lang,'successSub')}
        </p>
        <p style={{ marginTop:16, fontSize:'.8rem', color:'var(--gray-400)' }}>
          {t(lang,'successClose')}
        </p>
      </div>
    </div>
  )
}

/* ── Sending Overlay ── */
function SendingOverlay({ lang, isEdit }) {
  return (
    <div className="sending-overlay">
      <div className="sending-card">
        <div className="spinner" />
        <div style={{ fontWeight:600 }}>
          {t(lang, isEdit ? 'overlayEdit' : 'overlayNew')}
        </div>
        <div style={{ fontSize:'.82rem', color:'var(--gray-500)', marginTop:6 }}>
          {t(lang,'overlayWarn')}
        </div>
      </div>
    </div>
  )
}

/* ── ROOT ── */
export default function SurveyApp({
  lang, setLang,
  groupCode, groupName, groupColor, sheetName,
  questions, employees,
  ssoEmployee   = null,
  initialAnswers = {},
  isEditMode    = false,
  onLogout      = null,
}) {
  const DIMENSIONS = useMemo(() => buildDimensions(questions), [questions])

  const [step,       setStep]       = useState('survey')
  const [answers,    setAnswers]    = useState(initialAnswers)
  const [isEdit,     setIsEdit]     = useState(isEditMode)
  const [editDim,    setEditDim]    = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)

  const employee = ssoEmployee || employees[0]
  const answered = Object.keys(answers).length
  const totalQ   = questions.length

  const handleFinish  = (ans) => { setAnswers(ans); setStep('review') }
  const handleEdit    = (idx) => { setEditDim(idx); setStep('survey') }
  const handleSubmit  = async () => {
    setError(null); setSubmitting(true)
    try {
      await submitToSheet({ employee, answers, sheetName })
      setStep('success')
    } catch (e) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div style={{
          width:32, height:32, borderRadius:6, background:groupColor,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'.8rem', fontWeight:800, color:'#fff', flexShrink:0,
        }}>HF</div>
        <div className="logo">{t(lang,'appTitle')}</div>
        <span className="badge">{groupName}</span>

        {/* Selector de idioma en el header */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
          <LangSelector lang={lang} setLang={setLang} inHeader />
          {step !== 'success' && (
            <div className="header-right" style={{ marginLeft:0 }}>
              {isEdit && <span style={{ opacity:.7 }}>✏️</span>}
              <span>{(employee?.nombre || '').split(' ').slice(0,2).join(' ')}</span>
              <span>·</span>
              <span>{answered}/{totalQ}</span>
            </div>
          )}
          {onLogout && (
            <button onClick={onLogout}
              style={{ background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.3)',
                color:'#fff', borderRadius:6, padding:'4px 10px', cursor:'pointer',
                fontSize:'.78rem', fontFamily:'inherit' }}>
              {t(lang,'logout')}
            </button>
          )}
        </div>
      </header>

      {step === 'survey' && (
        <StepSurvey
          key={`${employee?.email}-${editDim}`}
          lang={lang}
          dimensions={DIMENSIONS}
          isEdit={isEdit}
          existingAnswers={answers}
          initialDim={editDim}
          onFinish={handleFinish}
        />
      )}
      {step === 'review' && (
        <StepReview
          lang={lang}
          employee={employee}
          answers={answers}
          dimensions={DIMENSIONS}
          isEdit={isEdit}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      )}
      {step === 'success' && (
        <StepSuccess lang={lang} employee={employee} isEdit={isEdit} />
      )}
      {submitting && <SendingOverlay lang={lang} isEdit={isEdit} />}
    </div>
  )
}
