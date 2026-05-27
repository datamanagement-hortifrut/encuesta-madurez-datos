import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g2.json'

const GROUP_CODE  = 'G2'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G2() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Directores & Gerentes Funcionales"
      groupColor="#E26B0A"
      sheetName="Respuestas_G2"
      questions={questions}
      employees={employees}
    />
  )
}
