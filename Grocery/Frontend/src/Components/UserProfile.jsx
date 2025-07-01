"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUser,
  FaShoppingCart,
  FaSearch,
  FaEdit,
  FaSignOutAlt,
  FaShoppingBag,
  FaMapMarkerAlt,
  FaCamera,
  FaCog,
  FaHeart,
  FaWallet,
  FaQuestionCircle,
  FaChevronRight,
  FaBars,
} from "react-icons/fa"
import "../Style/UserProfile.css"
import axios from "axios"
import axiosInstance from "../Utils/AxiosInstance"

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Load user data from localStorage or API
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
    }
    // You can fetch user data here
  }, [navigate])

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:8000/api/users/get_user_info/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if(res.status===200){
          const {username,email,role,profile_picture,member_since}=res.data
          setUser({
            'username':username,
            'email':email,
            'role':role,
            'profile_picture': `http://localhost:8000${profile_picture}`,
            'member_since':member_since
          })
          console.log(res.data)
        }
      }catch(error){
        console.error(error)
      }
    }
    fetchUserInfo()
  },[])

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:8000/api/users/logout/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUser((prev) => ({
          ...prev,
          profilePicture: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = async () => {
    try{
      const res = await axiosInstance.put('http://localhost:8000/api/users/edit_user/',user,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if(res.status===200){
        setIsEditing(false)
        console.log("user edited successfully")
      }
    }catch(error){
      console.error(error)
    }
  }

  const menuItems = [
    {
      icon: <FaShoppingBag />,
      title: "My Orders",
      subtitle: "Track, return, or buy things again",
      action: () => navigate("/orders"),
    },
    { icon: <FaHeart />, title: "My Wishlist", subtitle: "Your saved items", action: () => navigate("/wishlist") },
    {
      icon: <FaWallet />,
      title: "Payment Methods",
      subtitle: "Manage your payment options",
      action: () => navigate("/payments"),
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Addresses",
      subtitle: "Manage your delivery addresses",
      action: () => navigate("/address"),
    },
    {
      icon: <FaCog />,
      title: "Account Settings",
      subtitle: "Privacy, security, and preferences",
      action: () => setIsEditing(true),
    },
    {
      icon: <FaQuestionCircle />,
      title: "Help & Support",
      subtitle: "Get help with your account",
      action: () => navigate("/support"),
    },
  ]

  return (
    <div className="user-profile-page">
      {/* Navigation Bar - Same as Home */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-2">
        <div className="container">
          <div className="d-flex align-items-center">
            <button className="navbar-toggler me-3 d-lg-none" type="button" onClick={() => navigate("/home")}>
              <FaBars />
            </button>
            <a className="navbar-brand" href="#" onClick={() => navigate("/home")}>
              <img src="/assets/logo.svg" alt="Organic" height="30" />
            </a>
          </div>

          <div className="d-flex align-items-center ms-auto">
            <div className="d-flex">
              <a href="#" className="nav-link me-3">
                <FaUser size={20} className="text-danger" />
              </a>
              <a href="#" className="nav-link">
                <FaShoppingCart size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar - Same as Home */}
      {/* <div className="bg-light py-2">
        <div className="container">
          <div className="input-group">
            <input type="text" className="form-control py-2" placeholder="Search for products..." />
            <button className="btn btn-danger" type="button">
              <FaSearch />
            </button>
          </div>
        </div>
      </div> */}

      {/* Profile Header */}
      <div className="profile-header bg-white">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="profile-picture-container">
                <div className="profile-picture">
                  {user?.profile_picture ? (
                    <img src={user?.profile_picture} alt="Profile" />
                  ) : (
                    <FaUser size={40} className="text-muted" />
                  )}
                </div>
                <label htmlFor="profilePictureInput" className="profile-picture-edit">
                  <FaCamera size={12} />
                </label>
                <input
                  type="file"
                  id="profilePictureInput"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="col">
              <h4 className="mb-1">{user?.username}</h4>
              <p className="text-muted mb-1"><b>Email</b> : {user?.email}</p>
              <small className="text-muted"><b>Member since</b> : {user?.member_since}</small>
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-danger btn-sm" onClick={() => setIsEditing(true)}>
                <FaEdit className="me-1" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container my-4">
        <div className="row g-3">
          <div className="col-4">
            <div className="card border-0 bg-light text-center p-3">
              <h5 className="text-danger mb-1">12</h5>
              <small className="text-muted">Orders</small>
            </div>
          </div>
          <div className="col-4">
            <div className="card border-0 bg-light text-center p-3">
              <h5 className="text-danger mb-1">5</h5>
              <small className="text-muted">Wishlist</small>
            </div>
          </div>
          <div className="col-4">
            <div className="card border-0 bg-light text-center p-3">
              <h5 className="text-danger mb-1">₹2,450</h5>
              <small className="text-muted">Saved</small>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mb-4">
        <div className="card border-0 shadow-sm">
          {menuItems.map((item, index) => (
            <div key={index}>
              <div
                className="menu-item p-3 d-flex align-items-center"
                onClick={item.action}
                style={{ cursor: "pointer" }}
              >
                <div className="menu-icon me-3 text-danger">{item.icon}</div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">{item.title}</h6>
                  <small className="text-muted">{item.subtitle}</small>
                </div>
                <FaChevronRight className="text-muted" />
              </div>
              {index < menuItems.length - 1 && <hr className="my-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="container mb-4">
        <div className="card border-0 shadow-sm">
          <div
            className="menu-item p-3 d-flex align-items-center text-danger"
            onClick={() => setShowLogoutModal(true)}
            style={{ cursor: "pointer" }}
          >
            <div className="menu-icon me-3">
              <FaSignOutAlt />
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1 text-danger">Logout</h6>
              <small className="text-muted">Sign out of your account</small>
            </div>
            <FaChevronRight className="text-muted" />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogoutModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout from your account?</p>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">Edit Profile</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label text-black">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.username}
                      onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-black">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user.email}
                      onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label text-black">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={user.phone}
                      onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-black">Address</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={user.address}
                      onChange={(e) => setUser((prev) => ({ ...prev, address: e.target.value }))}
                    ></textarea>
                  </div> */}
                </form>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {handleEdit()}}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Same as Home */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3 mb-3">
              <h6>Organic Store</h6>
              <ul className="list-unstyled small">
                <li>
                  <a href="#" className="text-white-50">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white-50">
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white-50">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6>Help</h6>
              <ul className="list-unstyled small">
                <li>
                  <a href="#" className="text-white-50">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white-50">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white-50">
                    Shipping Policy
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6>Connect with us</h6>
              <div className="d-flex">
                <div className="bg-secondary rounded me-2" style={{ width: "30px", height: "30px" }}></div>
                <div className="bg-secondary rounded me-2" style={{ width: "30px", height: "30px" }}></div>
                <div className="bg-secondary rounded" style={{ width: "30px", height: "30px" }}></div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <h6>Registered Office Address</h6>
              <p className="small text-white-50">Organic Store, Mumbai, Maharashtra - 400701</p>
            </div>
          </div>
          <div className="border-top pt-3 mt-3 text-center small text-white-50">
            © 2023 Organic Store. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserProfile
