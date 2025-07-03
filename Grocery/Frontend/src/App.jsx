import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingHome from './Components/LandingHome'
import LoginPage from './Components/LoginPage'
import Home from './Components/Home'
import Registration from './Components/Registration'
import UserProfile from './Components/UserProfile'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import PublicOnlyRoute from './ProtectedRoute/PublicOnlyRoute'
import AddressPage from './Components/AddressPage'
import SellerPage from './Components/SellerPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome/>} />

        <Route path="/login" element={
          <PublicOnlyRoute>
          <LoginPage/>
          </PublicOnlyRoute>
          }/>

        <Route path='/home' element={
          <ProtectedRoute>
          <Home/>
          </ProtectedRoute>
          }/>
          
        <Route path='/user_profile' element={
          <ProtectedRoute>
          <UserProfile/>
          </ProtectedRoute>
          }/>

        <Route path='/registration' element={
          <PublicOnlyRoute>
          <Registration/>
          </PublicOnlyRoute>
          }/>

        <Route path='/address' element={
          <ProtectedRoute>
            <AddressPage/>
          </ProtectedRoute>
        }/>

        <Route path='/sellerpage' element={
          <ProtectedRoute>
            <SellerPage/>
          </ProtectedRoute>
        }/>

      </Routes>
    </Router>
  )
}

export default App
