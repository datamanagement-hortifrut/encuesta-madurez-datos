import { useState, useMemo, useCallback } from 'react'
import questionsData from './questions.json'
import employeesG1   from './employees_g1.json'
import { submitToSheet, getExistingAnswers } from './googleSheets.js'

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const GROUP_CODE  = 'G1'
const GROUP_NAME  = 'Alta Dirección & C-Level'
const GROUP_COLOR = '#C00000'

const QUESTIONS = questionsData.filter(q => q.grupos.includes(GROUP_CODE))

const DIMENSIONS = (() => {
  const map = new Map()
  QUESTIONS.forEach(q => {
    if (!map.has(q.dimension))
      map.set(q.dimension, { label: q.dimension_short, questions: [] })
    map.get(q.dimension).questions.push(q)
  })
  return Array.from(map.values())
})()

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('es-CL', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return iso }
}

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */
function ProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <span>{current} / {total} respondidas</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function QuestionCard({ question, value, onChange }) {
  return (
    <div className={`q-card ${value ? 'answered' : ''}`}>
      <div className="q-id">{question.id}</div>
      <div className="q-text">{question.pregunta}</div>
      <div className="options">
        {question.opciones.map(opt => (
          <label key={opt.id} className={`opt-label ${value === opt.id ? 'active' : ''}`}>
            <input
              type="radio"
              name={question.id}
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(question.id, opt.id)}
            />
            <span className="opt-text">{opt.texto}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   STEP 1 — Employee lookup + check previo
───────────────────────────────────────────── */
function StepLookup({ onStart }) {
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState(null)
  const [loading,  setLoading]  = useState(false)   // consultando sheet
  const [prior,    setPrior]    = useState(null)     // { answers, timestamp } | null
  const [checked,  setChecked]  = useState(false)    // ya se consultó el sheet

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return employeesG1.filter(e =>
      e.nombre.toLowerCase().includes(q) ||
      e.cargo.toLowerCase().includes(q)  ||
      e.email.toLowerCase().includes(q)
    )
  }, [query])

  // Al seleccionar un empleado, consultar si ya respondió
  const handleSelect = async (emp) => {
    setSelected(emp)
    setPrior(null)
    setChecked(false)
    setLoading(true)
    try {
      const result = await getExistingAnswers(emp.email)
      setPrior(result.found ? result : null)
    } catch {
      setPrior(null)
    } finally {
      setLoading(false)
      setChecked(true)
    }
  }

  const handleBegin = (mode) => {
    // mode: 'new' | 'edit'
    const initialAnswers = (mode === 'edit' && prior?.answers) ? prior.answers : {}
    onStart(selected, initialAnswers, mode === 'edit')
  }

  return (
    <div className="page step-lookup">
      <div className="card">
        <p className="lookup-title">Encuesta de Madurez de Datos</p>
        <p className="lookup-sub">
          Busca tu nombre o correo para comenzar.
        </p>

        <div className="field-group">
          <label>Grupo: <strong style={{ color: GROUP_COLOR }}>{GROUP_NAME}</strong></label>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre, cargo o correo…"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(null); setPrior(null); setChecked(false) }}
            autoFocus
          />
          <span className="search-icon">🔍</span>
        </div>

        {query.length > 0 && (
          <div className="employee-list">
            {filtered.length === 0 ? (
              <div style={{ padding: '16px', color: 'var(--gray-500)', fontSize: '.85rem', textAlign: 'center' }}>
                No se encontraron resultados para "{query}"
              </div>
            ) : (
              filtered.map((emp, i) => (
                <div
                  key={i}
                  className={`employee-item ${selected?.email === emp.email ? 'selected' : ''}`}
                  onClick={() => handleSelect(emp)}
                >
                  <div className="emp-name">{emp.nombre}</div>
                  <div className="emp-meta">{emp.cargo} · {emp.pais}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Estado: consultando */}
        {loading && (
          <div className="alert alert-info" style={{ marginTop: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="spinner-sm" />
              Verificando respuestas anteriores…
            </span>
          </div>
        )}

        {/* Estado: ya respondió */}
        {!loading && checked && prior && (
          <div style={{ marginTop: 16 }}>
            <div className="already-banner">
              <div className="already-icon">✓</div>
              <div className="already-body">
                <div className="already-title">Ya respondiste esta encuesta</div>
                <div className="already-date">Última respuesta: {formatDate(prior.timestamp)}</div>
                <div className="already-hint">
                  Puedes editar tus respuestas — tus selecciones anteriores estarán precargadas.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleBegin('edit')}>
                ✏️ Editar mis respuestas
              </button>
              <button className="btn btn-primary"   style={{ flex: 1 }} onClick={() => handleBegin('new')}>
                🔄 Empezar de cero
              </button>
            </div>
          </div>
        )}

        {/* Estado: nunca respondió */}
        {!loading && checked && !prior && selected && (
          <div style={{ marginTop: 16 }}>
            <div className="alert alert-info">
              ✓ Seleccionado: <strong>{selected.nombre}</strong> — {selected.cargo}
            </div>
            <button className="btn btn-primary btn-full" onClick={() => handleBegin('new')}>
              Iniciar encuesta →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   STEP 2 — Survey
───────────────────────────────────────────── */
function StepSurvey({ employee, onFinish, initialDim = 0, existingAnswers = {}, isEdit = false }) {
  const [dimIndex, setDimIndex] = useState(initialDim)
  const [answers,  setAnswers]  = useState(existingAnswers)

  const totalQ     = QUESTIONS.length
  const answered   = Object.keys(answers).length
  const dim        = DIMENSIONS[dimIndex]
  const dimAnsw    = dim.questions.filter(q => answers[q.id]).length
  const allDimDone = dim.questions.every(q => answers[q.id])
  const isLast     = dimIndex === DIMENSIONS.length - 1

  const handleChange = useCallback((qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: val }))
  }, [])

  const handleNext = () => {
    if (!isLast) setDimIndex(i => i + 1)
    else onFinish(answers)
  }

  return (
    <div className="page">
      {isEdit && (
        <div className="edit-banner">
          ✏️ Modo edición — tus respuestas anteriores están precargadas. Modifica lo que necesites.
        </div>
      )}

      <ProgressBar current={answered} total={totalQ} label="Progreso total" />

      <div className="dim-header">
        <div className="dim-name">
          {dimIndex + 1} / {DIMENSIONS.length} — {dim.label}
        </div>
        <div className="dim-desc">
          {dimAnsw} de {dim.questions.length} preguntas respondidas en esta dimensión
        </div>
      </div>

      {dim.questions.map(q => (
        <QuestionCard
          key={q.id}
          question={q}
          value={answers[q.id]}
          onChange={handleChange}
        />
      ))}

      <div className="nav-row">
        {dimIndex > 0 && (
          <button className="btn btn-secondary" onClick={() => setDimIndex(i => i - 1)}>
            ← Anterior
          </button>
        )}
        <div className="spacer" />
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!allDimDone}
          title={!allDimDone ? 'Responde todas las preguntas para continuar' : ''}
        >
          {isLast ? '✓ Finalizar encuesta' : 'Siguiente →'}
        </button>
      </div>

      {!allDimDone && (
        <p style={{ textAlign: 'right', fontSize: '.78rem', color: 'var(--amber)', marginTop: 8 }}>
          Responde todas las preguntas de esta dimensión para continuar.
        </p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   STEP 3 — Review & Submit
───────────────────────────────────────────── */
function StepReview({ employee, answers, isEdit, onEdit, onSubmit, submitting, error }) {
  const totalQ   = QUESTIONS.length
  const answered = Object.keys(answers).length

  const dimStatus = DIMENSIONS.map(dim => {
    const done  = dim.questions.filter(q => answers[q.id]).length
    const total = dim.questions.length
    return { label: dim.label, done, total }
  })

  return (
    <div className="page">
      <div className="card">
        <div className="summary-header">
          <h2>{isEdit ? 'Revisión de cambios' : 'Resumen de tu encuesta'}</h2>
          <p>
            {isEdit
              ? 'Revisa tus respuestas actualizadas antes de guardar.'
              : 'Revisa tus respuestas antes de enviar.'}
          </p>
        </div>

        {isEdit && (
          <div className="edit-banner" style={{ marginBottom: 16 }}>
            ✏️ Estás actualizando tus respuestas. Al enviar, reemplazarán las anteriores.
          </div>
        )}

        <div className="summary-grid">
          <div className="summary-stat">
            <div className="s-num">{answered}</div>
            <div className="s-label">preguntas respondidas</div>
          </div>
          <div className="summary-stat">
            <div className="s-num">{totalQ - answered}</div>
            <div className="s-label">sin responder</div>
          </div>
        </div>

        <div style={{ marginBottom: 20, padding: '14px', background: 'var(--gray-100)', borderRadius: 8 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--gray-500)', marginBottom: 6 }}>ENCUESTADO</div>
          <div style={{ fontWeight: 600 }}>{employee.nombre}</div>
          <div style={{ fontSize: '.82rem', color: 'var(--gray-500)' }}>{employee.cargo} · {employee.pais}</div>
        </div>

        <div className="dim-review">
          {dimStatus.map((d, i) => {
            const status = d.done === d.total ? 'complete' : d.done > 0 ? 'partial' : 'empty'
            const label  = d.done === d.total ? '✓ Completa' : `${d.done}/${d.total}`
            return (
              <div key={i} className="dim-row" onClick={() => onEdit(i)}>
                <span style={{ fontSize: '.82rem' }}>{d.label}</span>
                <span className={`dim-status ${status}`}>{label}</span>
              </div>
            )
          })}
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <div className="nav-row">
          <button className="btn btn-secondary" onClick={() => onEdit(0)}>
            ← Editar respuestas
          </button>
          <div className="spacer" />
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={submitting || answered < totalQ}
          >
            {submitting ? 'Guardando…' : isEdit ? '💾 Guardar cambios' : '📤 Enviar respuestas'}
          </button>
        </div>

        {answered < totalQ && (
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--amber)', marginTop: 10 }}>
            Hay {totalQ - answered} preguntas sin responder.
          </p>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   STEP 4 — Success
───────────────────────────────────────────── */
function StepSuccess({ employee, isEdit }) {
  return (
    <div className="page">
      <div className="card success-screen">
        <div className="success-icon">{isEdit ? '💾' : '🎉'}</div>
        <h2>
          {isEdit
            ? `¡Listo, ${employee.nombre.split(' ')[0]}!`
            : `¡Gracias, ${employee.nombre.split(' ')[0]}!`}
        </h2>
        <p>
          {isEdit
            ? 'Tus respuestas han sido actualizadas correctamente.'
            : 'Tus respuestas han sido registradas exitosamente.'}
          <br />
          Tu opinión es clave para entender el estado de madurez de datos en Hortifrut.
        </p>
        <p style={{ marginTop: 16, fontSize: '.8rem', color: 'var(--gray-400)' }}>
          Puedes cerrar esta ventana.
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SENDING OVERLAY
───────────────────────────────────────────── */
function SendingOverlay({ isEdit }) {
  return (
    <div className="sending-overlay">
      <div className="sending-card">
        <div className="spinner" />
        <div style={{ fontWeight: 600 }}>
          {isEdit ? 'Actualizando tus respuestas…' : 'Guardando tus respuestas…'}
        </div>
        <div style={{ fontSize: '.82rem', color: 'var(--gray-500)', marginTop: 6 }}>
          No cierres esta ventana
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [step,       setStep]       = useState('lookup')
  const [employee,   setEmployee]   = useState(null)
  const [answers,    setAnswers]    = useState({})
  const [isEdit,     setIsEdit]     = useState(false)
  const [editDim,    setEditDim]    = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)

  const handleStart = (emp, initialAnswers, editMode) => {
    setEmployee(emp)
    setAnswers(initialAnswers)
    setIsEdit(editMode)
    setEditDim(0)
    setError(null)
    setStep('survey')
  }

  const handleFinish = (ans) => {
    setAnswers(ans)
    setStep('review')
  }

  const handleEdit = (dimIdx) => {
    setEditDim(dimIdx)
    setStep('survey')
  }

  const handleSubmit = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await submitToSheet({ employee, answers })
      setStep('success')
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const answered = Object.keys(answers).length

  return (
    <div className="app-shell">
      <header className="app-header">
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: GROUP_COLOR,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.8rem', fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>HF</div>
        <div className="logo">Encuesta Madurez de Datos</div>
        <span className="badge">{GROUP_NAME}</span>
        {employee && step !== 'lookup' && step !== 'success' && (
          <div className="header-right">
            {isEdit && <span style={{ opacity: .7 }}>✏️ editando</span>}
            <span>{employee.nombre.split(' ').slice(0,2).join(' ')}</span>
            <span>·</span>
            <span>{answered}/{QUESTIONS.length}</span>
          </div>
        )}
      </header>

      {step === 'lookup'  && <StepLookup onStart={handleStart} />}

      {step === 'survey'  && (
        <StepSurvey
          key={`${employee?.email}-${editDim}`}
          employee={employee}
          initialDim={editDim}
          existingAnswers={answers}
          isEdit={isEdit}
          onFinish={handleFinish}
        />
      )}

      {step === 'review'  && (
        <StepReview
          employee={employee}
          answers={answers}
          isEdit={isEdit}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      )}

      {step === 'success' && <StepSuccess employee={employee} isEdit={isEdit} />}

      {submitting && <SendingOverlay isEdit={isEdit} />}
    </div>
  )
}
