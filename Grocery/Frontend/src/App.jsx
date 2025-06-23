import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingHome from './Components/LandingHome'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome/>} />
      </Routes>
    </Router>
  )
}

export default App
