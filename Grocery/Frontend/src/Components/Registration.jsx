"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../Style/Registration.css"
import axiosInstance from "../Utils/AxiosInstance"

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "user",
  })
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        setFieldErrors((prev) => ({
          ...prev,
          profile_picture: "Please select a valid image file (JPEG, PNG, GIF)",
        }))
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors((prev) => ({
          ...prev,
          profile_picture: "File size must be less than 5MB",
        }))
        return
      }

      setProfilePicture(file)
      setFieldErrors((prev) => ({
        ...prev,
        profile_picture: "",
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const errors = {}

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required"
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long"
    }

    // Confirm password validation
    if (!formData.confirm_password) {
      errors.confirm_password = "Please confirm your password"
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Create FormData object for file upload
      const submitData = new FormData()
      submitData.append("username", formData.username.trim())
      submitData.append("email", formData.email.trim().toLowerCase())
      submitData.append("password", formData.password)
      submitData.append("role", formData.role)
      submitData.append("confirm_password", formData.confirm_password)

      if (profilePicture) {
        submitData.append("profile_picture", profilePicture)
      }

      const response = await axiosInstance.post("http://localhost:8000/api/users/register/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Handle successful signup
      if (response.status === 201 || response.status === 200) {
        console.log("Registration successful:", response.data)
        navigate("/login", {
          state: { message: "Registration successful! Please login." },
        })
      }
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object') {
        const errors = {};
        for (const [field, messages] of Object.entries(err.response.data)) {
          errors[field] = Array.isArray(messages) ? messages[0] : messages;
        }
        setFieldErrors(errors);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
    finally {
      setIsLoading(false)
    }
  }

  const removeProfilePicture = () => {
    setProfilePicture(null)
    setProfilePicturePreview(null)
    document.getElementById("profile_picture").value = ""
  }

  return (
    <div className="signup-container">
      <div className="sahal container-fluid h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card signup-card shadow-lg">
              {/* <div className="card-header text-center bg-white border-0 pt-4">
                <h2 className="card-title mb-2 fw-bold">Create Account</h2>
                <p className="text-muted mb-0">Join us today! Please fill in your information</p>
              </div> */}

              <div className="card-body px-4 pb-4">
                <h2 className="card-title text-white mb-2 fw-bold">Create Account</h2>
                {/* <p className="text-muted mb-0">Join us today! Please fill in your information</p> */}
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}

                  {/* Profile Picture Upload */}
                  <div className="mb-4 text-center">
                    <label className="form-label fw-semibold">Profile Picture (Optional)</label>
                    <div className="profile-upload-container">
                      {profilePicturePreview ? (
                        <div className="profile-preview-container">
                          <img
                            src={profilePicturePreview || "/placeholder.svg"}
                            alt="Profile Preview"
                            className="profile-preview-image"
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm profile-remove-btn"
                            onClick={removeProfilePicture}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="profile_picture" className="profile-upload-label">
                          <div className="profile-upload-placeholder">
                            <i className="bi bi-camera-fill"></i>
                            <span>Upload Photo</span>
                          </div>
                        </label>
                      )}
                      <input
                        type="file"
                        className="d-none"
                        id="profile_picture"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                    {fieldErrors.profile_picture && (
                      <div className="text-danger small mt-1">{fieldErrors.profile_picture}</div>
                    )}
                  </div>

                  {/* Username */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control border-start-0 ps-0 ${fieldErrors.username ? "is-invalid" : ""}`}
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                    {fieldErrors.username && <div className="text-danger small mt-1">{fieldErrors.username}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control border-start-0 ps-0 ${fieldErrors.email ? "is-invalid" : ""}`}
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {fieldErrors.email && <div className="text-danger small mt-1">{fieldErrors.email}</div>}
                  </div>

                  {/* Role Selection */}
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Account Type *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person-badge text-muted"></i>
                      </span>
                      <select
                        className="form-select border-start-0 ps-0"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control border-start-0 border-end-0 ps-0 ${fieldErrors.password ? "is-invalid" : ""}`}
                        id="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {fieldErrors.password && <div className="text-danger small mt-1">{fieldErrors.password}</div>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label htmlFor="confirm_password" className="form-label">
                      Confirm Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control border-start-0 border-end-0 ps-0 ${fieldErrors.confirm_password ? "is-invalid" : ""}`}
                        id="confirm_password"
                        name="confirm_password"
                        placeholder="Confirm your password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {fieldErrors.confirm_password && (
                      <div className="text-danger small mt-1">{fieldErrors.confirm_password}</div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 mb-3" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <div className="text-center">
                    <span className="Login_Link_Text small">Already have an account? </span>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none small fw-semibold"
                      onClick={() => navigate("/login")}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
