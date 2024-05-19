import { Container } from '@mui/material'
import '../App.css'
import MainContent from './MainContent'
import Prayer from './Prayer'
function App() {


  return (
    <>
    <div style={{display: "flex", justifyContent: "center", width:"100vw"}}>
      <Container minWidth="xxl">
    <MainContent />
    </Container>
    </div>
    
  </>
  )
}

export default App
