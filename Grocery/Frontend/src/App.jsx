import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingHome from './Components/LandingHome'
import LoginPage from './Components/LoginPage'
import Home from './Components/Home'
import UserDetails from './Components/UserDetails'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome/>} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/user_details' element={<UserDetails/>}/>
      </Routes>
    </Router>
  )
}

export default App
