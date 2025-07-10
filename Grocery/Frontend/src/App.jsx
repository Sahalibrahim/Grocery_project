import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Bounce, Flip, Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingHome from './Components/LandingHome'
import LoginPage from './Components/LoginPage'
import Home from './Components/Home'
import Registration from './Components/Registration'
import UserProfile from './Components/UserProfile'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute'
import PublicOnlyRoute from './ProtectedRoute/PublicOnlyRoute'
import AddressPage from './Components/AddressPage'
import SellerPage from './Components/SellerPage'
import ProductsPage from './Components/ProductsPage'
import CartPage from './Components/CartPage'
import PaymentPage from './Components/PaymentPage';
import OrderSuccessPage from './Components/OrderSuccessPage';
import OrdersPage from './Components/OrdersPage';

function App() {

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Bounce} // 👈 Change this to Bounce, Flip, Slide, etc.
         />
      <Router>
        <Routes>
          <Route path="/" element={<LandingHome />} />

          <Route path="/login" element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } />

          <Route path='/home' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path='/user_profile' element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          <Route path='/registration' element={
            <PublicOnlyRoute>
              <Registration />
            </PublicOnlyRoute>
          } />

          <Route path='/address' element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          } />

          <Route path='/sellerpage' element={
            <ProtectedRoute>
              <SellerPage />
            </ProtectedRoute>
          } />

          <Route path='/productspage' element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } />

          <Route path='/cart' element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />

          <Route path='/payment' element={
            <ProtectedRoute>
              <PaymentPage/>
            </ProtectedRoute>
          }/>

          <Route path='/order_success' element={
            <ProtectedRoute>
              <OrderSuccessPage/>
            </ProtectedRoute>
          }/>
          
          <Route path='/my_orders' element={
            <ProtectedRoute>
              <OrdersPage/>
            </ProtectedRoute>
          }/>


        </Routes>
      </Router>
    </>
  )
}

export default App
