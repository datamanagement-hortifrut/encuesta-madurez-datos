import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g6.json'

const GROUP_CODE  = 'G6'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G6() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Creadores de Reportes"
      groupColor="#70AD47"
      sheetName="Respuestas_G6"
      questions={questions}
      employees={employees}
    />
  )
}
