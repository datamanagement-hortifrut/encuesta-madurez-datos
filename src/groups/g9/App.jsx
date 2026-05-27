import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g9.json'

const GROUP_CODE  = 'G9'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G9() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Data Owners"
      groupColor="#1F3864"
      sheetName="Respuestas_G9"
      questions={questions}
      employees={employees}
    />
  )
}
