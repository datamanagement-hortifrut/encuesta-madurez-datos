/**
 * HelpButton.jsx
 * Botón ❓ en cada pregunta que abre un panel con:
 * - Qué evalúa esta dimensión
 * - Cómo se vive en Hortifrut (contexto real)
 * - Ejemplo concreto
 * - Tip para responder
 * - Data Owners del dominio (cuando aplica)
 */
import { useState } from 'react'
import helpContent from './helpContent.json'
import dataOwners  from './dataOwners.json'

// Mapeo dimensión → dominios de Data Owners relevantes
const DIM_TO_DOMAINS = {
  'Gestión de Datos Maestros':            ['Comercial','Finanzas','Operaciones','Producción','RRHH','Genética'],
  'Diccionario, glosario y metadatos':    ['Comercial','Finanzas','Operaciones','Producción','RRHH','Genética'],
  'Calidad del Dato':                     ['Comercial','Finanzas','Operaciones','Producción','RRHH','Genética'],
  'El Rol del Chief Data Officer':        [],
  'Principios y visión de Gobierno':      [],
  'Diseño de la Estrategia del Dato':     [],
  'Seguridad de la Información':          [],
  'Privacidad':                           ['RRHH'],
  'Arquitectura del Dato':                [],
  'Gestión de la demanda informacional':  [],
  'Visualizaciones y experiencia de usuario': [],
  'Cultura Data-Driven':                  [],
  'Gestión del Cambio':                   [],
}

export default function HelpButton({ dimensionShort, lang = 'es' }) {
  const [open, setOpen] = useState(false)

  const help = helpContent[dimensionShort]
  if (!help) return null

  const content = help[lang] || help.es
  const domains = DIM_TO_DOMAINS[dimensionShort] || []
  const relevantDOs = domains.length > 0
    ? dataOwners.filter(d => domains.includes(d.dominio))
    : []

  return (
    <>
      {/* Botón ❓ */}
      <button
        onClick={() => setOpen(true)}
        title={lang === 'en' ? 'Help' : 'Ayuda'}
        style={{
          background: 'none',
          border: '1.5px solid var(--green)',
          color: 'var(--green)',
          borderRadius: '50%',
          width: 20, height: 20,
          fontSize: '.7rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          lineHeight: 1,
          padding: 0,
          transition: 'all .15s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--green)' }}
      >
        ?
      </button>

      {/* Panel modal */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.45)',
            zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn .15s ease',
          }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <style>{`
            @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
            @keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
            .help-panel { animation: slideUp .2s ease }
            .help-section-title {
              font-size: .65rem; font-weight: 700; letter-spacing: .5px;
              text-transform: uppercase; color: var(--green);
              margin-bottom: 5px; display: flex; align-items: center; gap: 6px;
            }
            .help-text {
              font-size: .84rem; color: #374151; line-height: 1.6; margin-bottom: 14px;
            }
            .help-text strong { color: var(--green); }
            .help-tip {
              background: #f0f7f1; border-left: 3px solid var(--green);
              padding: 10px 14px; border-radius: 0 8px 8px 0;
              font-size: .82rem; color: #374151; line-height: 1.5;
              margin-bottom: 14px; font-style: italic;
            }
            .do-chip {
              display: inline-flex; align-items: center; gap: 6px;
              background: #f9fafb; border: 1px solid #e5e7eb;
              border-radius: 20px; padding: 5px 10px;
              font-size: .75rem; color: #374151;
              margin: 3px;
            }
            .do-chip .do-avatar {
              width: 22px; height: 22px; border-radius: 50%;
              background: var(--green); color: #fff;
              font-size: .6rem; font-weight: 700;
              display: flex; align-items: center; justify-content: center;
              flex-shrink: 0;
            }
          `}</style>

          <div
            className="help-panel"
            style={{
              background: '#fff',
              borderRadius: 14,
              width: '100%',
              maxWidth: 560,
              maxHeight: '88vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,.18)',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'var(--green)',
              color: '#fff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: '.68rem', fontWeight: 600, opacity: .7, marginBottom: 2, letterSpacing: '.4px', textTransform: 'uppercase' }}>
                  {lang === 'en' ? 'Help' : 'Ayuda'}
                </div>
                <div style={{ fontSize: '.95rem', fontWeight: 700, lineHeight: 1.3 }}>
                  {dimensionShort}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(255,255,255,.2)', border: 'none',
                  color: '#fff', width: 28, height: 28, borderRadius: 6,
                  cursor: 'pointer', fontSize: '1rem', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'inherit',
                }}
              >✕</button>
            </div>

            {/* Body */}
            <div style={{ overflowY: 'auto', padding: '18px 20px', flex: 1 }}>

              {/* ¿Qué evalúa? */}
              <div className="help-section-title">
                📌 {lang === 'en' ? 'What does this evaluate?' : '¿Qué evalúa esta dimensión?'}
              </div>
              <div className="help-text">{content.que_es}</div>

              {/* En Hortifrut */}
              <div className="help-section-title">
                🌱 {lang === 'en' ? 'At Hortifrut' : 'En Hortifrut'}
              </div>
              <div className="help-text"
                dangerouslySetInnerHTML={{
                  __html: content.en_hf
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />

              {/* Ejemplo */}
              <div className="help-section-title">
                💡 {lang === 'en' ? 'Example' : 'Ejemplo'}
              </div>
              <div className="help-text">{content.ejemplo}</div>

              {/* Tip */}
              <div className="help-section-title">
                🎯 {lang === 'en' ? 'Tip to answer' : 'Para responder esta pregunta...'}
              </div>
              <div className="help-tip">{content.tip}</div>

              {/* Data Owners relevantes */}
              {relevantDOs.length > 0 && (
                <>
                  <div className="help-section-title">
                    👤 {lang === 'en' ? 'Relevant Data Owners' : 'Data Owners relevantes'}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    {relevantDOs.map((d, i) => (
                      <div key={i} className="do-chip">
                        <div className="do-avatar">
                          {d.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{d.nombre}</div>
                          <div style={{ fontSize: '.65rem', color: '#6b7280' }}>
                            {d.dominio}{d.sub ? ` · ${d.sub}` : ''} · {d.alcance}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'flex-end',
              flexShrink: 0,
            }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'var(--green)', color: '#fff',
                  border: 'none', borderRadius: 8,
                  padding: '8px 20px', fontSize: '.82rem',
                  fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {lang === 'en' ? 'Got it' : 'Entendido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
