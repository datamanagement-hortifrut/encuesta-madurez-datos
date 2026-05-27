import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g5.json'

const GROUP_CODE  = 'G5'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G5() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="TI & Tecnología"
      groupColor="#2E75B6"
      sheetName="Respuestas_G5"
      questions={questions}
      employees={employees}
    />
  )
}
