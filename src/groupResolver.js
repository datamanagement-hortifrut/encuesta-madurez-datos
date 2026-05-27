/**
 * groupResolver.js
 * Dado un email corporativo, determina el grupo de audiencia del empleado.
 * Carga dinámicamente solo el JSON del grupo que corresponde.
 */
import { GROUPS_CONFIG } from './groupsConfig.js'

// Mapa email → grupo (se construye lazy la primera vez)
let emailToGroup = null

// Importar todos los JSONs de empleados de una vez
const employeeFiles = {
  g1:  () => import('./data/employees_g1.json'),
  g2:  () => import('./data/employees_g2.json'),
  g3:  () => import('./data/employees_g3.json'),
  g4:  () => import('./data/employees_g4.json'),
  g5:  () => import('./data/employees_g5.json'),
  g6:  () => import('./data/employees_g6.json'),
  g7a: () => import('./data/employees_g7a.json'),
  g7b: () => import('./data/employees_g7b.json'),
  g8b: () => import('./data/employees_g8b.json'),
  g8c: () => import('./data/employees_g8c.json'),
  g9:  () => import('./data/employees_g9.json'),
}

async function buildEmailMap() {
  if (emailToGroup) return emailToGroup
  emailToGroup = new Map()

  await Promise.all(
    GROUPS_CONFIG.map(async (group) => {
      try {
        const mod = await employeeFiles[group.slug]()
        const employees = mod.default || mod
        employees.forEach(emp => {
          if (emp.email) {
            emailToGroup.set(emp.email.toLowerCase().trim(), {
              group,
              employee: emp,
            })
          }
        })
      } catch (e) {
        console.warn(`No se pudo cargar employees_${group.slug}.json`, e)
      }
    })
  )
  return emailToGroup
}

/**
 * Dado un email, retorna { group, employee } o null si no se encuentra.
 */
export async function resolveGroup(email) {
  if (!email) return null
  const map = await buildEmailMap()
  return map.get(email.toLowerCase().trim()) || null
}
