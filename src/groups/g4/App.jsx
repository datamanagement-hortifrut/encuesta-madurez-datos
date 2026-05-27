import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g4.json'

const GROUP_CODE  = 'G4'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G4() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Datos, BI & Analytics"
      groupColor="#4472C4"
      sheetName="Respuestas_G4"
      questions={questions}
      employees={employees}
    />
  )
}
