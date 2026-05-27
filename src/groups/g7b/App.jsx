import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g7b.json'

const GROUP_CODE  = 'G7b'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G7B() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Profesionales de Negocio"
      groupColor="#4BACC6"
      sheetName="Respuestas_G7b"
      questions={questions}
      employees={employees}
    />
  )
}
