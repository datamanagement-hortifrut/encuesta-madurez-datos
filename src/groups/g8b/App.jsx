import SurveyApp    from '../../SurveyApp.jsx'
import questionsAll from '../../data/questions.json'
import employees    from '../../data/employees_g8b.json'

const GROUP_CODE  = 'G8b'
const questions   = questionsAll.filter(q => q.grupos.includes(GROUP_CODE))

export default function App_G8B() {
  return (
    <SurveyApp
      groupCode={GROUP_CODE}
      groupName="Aprobadores MDM"
      groupColor="#9E48C6"
      sheetName="Respuestas_G8b"
      questions={questions}
      employees={employees}
    />
  )
}
