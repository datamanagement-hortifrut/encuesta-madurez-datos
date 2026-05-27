const SHEET_URL = import.meta.env.VITE_SHEET_URL || ''

export async function getExistingAnswers(email) {
  if (!SHEET_URL) return { found: false }
  try {
    const url = `${SHEET_URL}?action=get&email=${encodeURIComponent(email.toLowerCase().trim())}`
    const res = await fetch(url)
    if (!res.ok) return { found: false }
    const result = await res.json().catch(() => ({}))
    return result.found ? result : { found: false }
  } catch { return { found: false } }
}

export async function submitToSheet(payload) {
  if (!SHEET_URL) throw new Error('VITE_SHEET_URL no está configurada.')
  const body = {
    action:       'set',
    timestamp:    new Date().toISOString(),
    email:        payload.employee.email,
    nombre:       payload.employee.nombre,
    cargo:        payload.employee.cargo,
    pais:         payload.employee.pais,
    grupo:        payload.employee.grupo,
    grupo_nombre: payload.employee.grupo_nombre,
    sheet_name:   payload.sheetName,
    answers:      payload.answers,
  }
  const res = await fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Error al guardar (${res.status})`)
  const result = await res.json().catch(() => ({ status: 'ok' }))
  if (result.status === 'error') throw new Error(result.message || 'Error en el servidor')
  return result
}
