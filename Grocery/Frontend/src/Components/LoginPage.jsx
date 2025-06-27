// import React, { useState } from 'react';
// import { FaGoogle, FaShoppingBasket } from 'react-icons/fa';
// import '../Style/Login.css'
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../Utils/AxiosInstance';

// const LoginPage = () => {

//     const [email, setEmail] = useState(null)
//     const [password, setPassword] = useState(null)
//     const navigate = useNavigate()

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axiosInstance.post('http://localhost:8000/api/users/login/', {
//                 email,
//                 password
//             });

//             if (res.status === 200) {
//                 localStorage.setItem('access_token', res.data.access_token)
//                 localStorage.setItem('refresh_token', res.data.refresh_token)
//                 navigate('/home')
//             }
//         } catch (error) {
//             console.error('Login failed:', error.response?.data || error.message);
//         }
//     }

//     return (
//         <>
//             <section className="login" >
//                 <div className="container ">
//                     <div className="row justify-content-center">
//                         <div className=" col-md-6 col-lg-5">
//                             <div className="shadow-lg login-glass" >
//                                 <div className="card-body p-5 login-glass">
//                                     <form onSubmit={handleSubmit}>
//                                         <div className="mb-3">
//                                             <label htmlFor="email" className="form-label">Email address</label>
//                                             <input
//                                                 type="email"
//                                                 className="form-control"
//                                                 id="email"
//                                                 placeholder="Enter your email"
//                                                 onChange={(e) => { setEmail(e.target.value) }}
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="mb-3">
//                                             <label htmlFor="password" className="form-label">Password</label>
//                                             <input
//                                                 type="password"
//                                                 className="form-control"
//                                                 id="password"
//                                                 placeholder="Enter your password"
//                                                 onChange={(e) => { setPassword(e.target.value) }}
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="d-flex justify-content-between mb-4">
//                                             <div className="form-check">
//                                                 <input className="form-check-input" type="checkbox" id="remember" />
//                                                 <label className="form-check-label" htmlFor="remember">
//                                                     Remember me
//                                                 </label>
//                                             </div>
//                                             <a href="#forgot-password" >Forgot password?</a>
//                                         </div>
//                                         <button type="submit" className="btn btn-outline-dark w-100 py-2" >
//                                             Sign in
//                                         </button>
//                                     </form>
//                                     <br></br>

//                                     <button className="btn btn-outline-danger w-100 py-2 mb-3" >
//                                         <FaGoogle className="me-2" />
//                                         Sign in with Google
//                                     </button>

//                                     <div className="text-center">
//                                         <span className="text-muted small">Don't have an account? </span>
//                                         <button
//                                             type="button"
//                                             className="btn btn-link p-0 text-decoration-none small fw-semibold"
//                                             onClick={() => navigate("/registration")}
//                                         >
//                                             Sign up
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }


// export default LoginPage;


"use client"

import { useState, useEffect } from "react"
import { FaGoogle, FaShoppingBasket, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import "../Style/Login.css"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setMessage({ type: "success", text: location.state.message })
      // Clear the message after 5 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 5000)
    }

    // Check if user is already logged in
    const token = localStorage.getItem("access_token")
    if (token) {
      navigate("/home")
    }
  }, [location, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" })
    }
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Email is required" })
      return false
    }
    if (!formData.password.trim()) {
      setMessage({ type: "error", text: "Password is required" })
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const res = await axios.post("http://localhost:8000/api/users/login/", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      if (res.status === 200) {
        setMessage({ type: "success", text: "Login successful! Redirecting..." })

        // Store tokens
        localStorage.setItem("access_token", res.data.access_token)
        localStorage.setItem("refresh_token", res.data.refresh_token)

        // Store email if remember me is checked
        if (rememberMe) {
          localStorage.setItem("remembered_email", formData.email)
        } else {
          localStorage.removeItem("remembered_email")
        }

        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate("/home")
        }, 1500)
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message)

      let errorMessage = "Login failed. Please try again."

      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password. Please check your credentials."
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Invalid input. Please check your details."
      } else if (error.response?.status === 429) {
        errorMessage = "Too many login attempts. Please try again later."
      } else if (!error.response) {
        errorMessage = "Network error. Please check your internet connection."
      }

      setMessage({ type: "error", text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    setMessage({ type: "info", text: "Google Sign-In coming soon!" })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remembered_email")
    if (rememberedEmail) {
      setFormData((prev) => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

  return (
    <>
      <section className="login">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="shadow-lg login-glass">
                <div className="card-body p-5 login-glass">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <FaShoppingBasket className="login-icon mb-3" />
                    <h2 className="text-white mb-0">Welcome Back</h2>
                    <p className="text-light">Sign in to your account</p>
                  </div>

                  {/* Message Display */}
                  {message.text && (
                    <div
                      className={`alert alert-${
                        message.type === "error" ? "danger" : message.type === "success" ? "success" : "info"
                      } alert-dismissible fade show`}
                      role="alert"
                    >
                      <div className="d-flex align-items-center">
                        {message.type === "success" && <i className="bi bi-check-circle-fill me-2"></i>}
                        {message.type === "error" && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
                        {message.type === "info" && <i className="bi bi-info-circle-fill me-2"></i>}
                        <span>{message.text}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage({ type: "", text: "" })}
                      ></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-white">
                        <i className="bi bi-envelope me-2"></i>
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label text-white">
                        <i className="bi bi-lock me-2"></i>
                        Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-light"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="remember"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={isLoading}
                        />
                        <label className="form-check-label text-light" htmlFor="remember">
                          Remember me
                        </label>
                      </div>
                      <a href="#forgot-password" className="text-light">
                        Forgot password?
                      </a>
                    </div>

                    <button type="submit" className="btn btn-outline-light w-100 py-2 mb-3" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <FaSpinner className="spinner-animation me-2" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </form>

                  <div className="text-center mb-3">
                    <span className="text-light">or</span>
                  </div>

                  <button
                    className="btn btn-outline-danger w-100 py-2 mb-3"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <FaGoogle className="me-2" />
                    Sign in with Google
                  </button>

                  <div className="text-center">
                    <span className="text-light small">Don't have an account? </span>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none small fw-semibold text-white"
                      onClick={() => navigate("/registration")}
                      disabled={isLoading}
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LoginPage
