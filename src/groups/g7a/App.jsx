import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g7a.json'

const GROUP_CODE  = 'G7a'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G7A() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Consumidores de Reportes"
      groupColor="#5B9BD5"
      sheetName="Respuestas_G7a"
      questions={questions}
      employees={employees}
    />
  )
}
