import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g8c.json'

const GROUP_CODE  = 'G8c'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G8C() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Operadores MDM"
      groupColor="#B07FD4"
      sheetName="Respuestas_G8c"
      questions={questions}
      employees={employees}
    />
  )
}
