/**
 * Configuración central de todos los grupos de audiencia.
 * Un solo lugar para cambiar nombres, colores y slugs.
 */
export const GROUPS_CONFIG = [
  { key: 'G1_Alta_Direccion',       code: 'G1',  slug: 'g1',  name: 'Alta Dirección & C-Level',         color: '#C00000', sheetName: 'Respuestas_G1'  },
  { key: 'G2_Directores_Gerentes',  code: 'G2',  slug: 'g2',  name: 'Directores & Gerentes Funcionales', color: '#E26B0A', sheetName: 'Respuestas_G2'  },
  { key: 'G3_Jefes_SubGerentes',    code: 'G3',  slug: 'g3',  name: 'Jefes & Subgerentes',               color: '#F79646', sheetName: 'Respuestas_G3'  },
  { key: 'G4_Datos_BI_Analytics',   code: 'G4',  slug: 'g4',  name: 'Datos, BI & Analytics',             color: '#4472C4', sheetName: 'Respuestas_G4'  },
  { key: 'G5_TI_Tecnologia',        code: 'G5',  slug: 'g5',  name: 'TI & Tecnología',                   color: '#2E75B6', sheetName: 'Respuestas_G5'  },
  { key: 'G6_Creadores_Reportes',   code: 'G6',  slug: 'g6',  name: 'Creadores de Reportes',             color: '#70AD47', sheetName: 'Respuestas_G6'  },
  { key: 'G7_Consumidores_Reportes',code: 'G7a', slug: 'g7a', name: 'Consumidores de Reportes',          color: '#5B9BD5', sheetName: 'Respuestas_G7a' },
  { key: 'G7_Consultados_Negocio',  code: 'G7b', slug: 'g7b', name: 'Profesionales de Negocio',          color: '#4BACC6', sheetName: 'Respuestas_G7b' },
  { key: 'G8b_Aprobadores_MDM',     code: 'G8b', slug: 'g8b', name: 'Aprobadores MDM',                   color: '#9E48C6', sheetName: 'Respuestas_G8b' },
  { key: 'G8c_Operadores_MDM',      code: 'G8c', slug: 'g8c', name: 'Operadores MDM',                    color: '#B07FD4', sheetName: 'Respuestas_G8c' },
  { key: 'G9_Data_Owners',          code: 'G9',  slug: 'g9',  name: 'Data Owners',                       color: '#1F3864', sheetName: 'Respuestas_G9'  },
]

export const getGroupBySlug = (slug) => GROUPS_CONFIG.find(g => g.slug === slug)
export const getGroupByCode = (code) => GROUPS_CONFIG.find(g => g.code === code)
