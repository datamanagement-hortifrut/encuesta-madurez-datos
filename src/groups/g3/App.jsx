import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g3.json'

const GROUP_CODE  = 'G3'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G3() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Jefes & Subgerentes"
      groupColor="#F79646"
      sheetName="Respuestas_G3"
      questions={questions}
      employees={employees}
    />
  )
}
