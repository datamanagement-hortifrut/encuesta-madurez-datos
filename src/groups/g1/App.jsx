import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g1.json'

const GROUP_CODE  = 'G1'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G1() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Alta Dirección & C-Level"
      groupColor="#C00000"
      sheetName="Respuestas_G1"
      questions={questions}
      employees={employees}
    />
  )
}
