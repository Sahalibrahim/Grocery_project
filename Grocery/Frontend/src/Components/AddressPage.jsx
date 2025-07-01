"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaStar,
  FaHome,
  FaBuilding,
  FaPhone,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa"
import "../Style/AddressPage.css"
import axiosInstance from '../Utils/AxiosInstance'
import { useForm } from "react-hook-form"

const AddressPage = () => {
  const [addresses, setAddresses] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [editingAddress, setEditingAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [formData, setFormData] = useState({
  //   full_name: "",
  //   phone_number: "",
  //   address_line1: "",
  //   address_line2: "",
  //   city: "",
  //   state: "",
  //   postal_code: "",
  //   country: "India",
  //   is_default: false,
  // })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      full_name: "",
      phone_number: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      is_default: false,
    },
  })


  const navigate = useNavigate()

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ]

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:8000/api/users/list_address/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        setAddresses(res.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  // const resetForm = () => {
  //   setFormData({
  //     full_name: "",
  //     phone_number: "",
  //     address_line1: "",
  //     address_line2: "",
  //     city: "",
  //     state: "",
  //     postal_code: "",
  //     country: "India",
  //     is_default: false,
  //   })
  // }

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }))
  // }


  const handleAddAddress = () => {
    // resetForm()
    reset()
    setShowAddModal(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    // setFormData(address)
    reset(address)
    setShowEditModal(true)
  }

  const handleDeleteAddress = (address) => {
    setSelectedAddress(address)
    setShowDeleteModal(true)
  }

  const handleSetDefault = async (addressId) => {
    try {
      const res = await axiosInstance.post(`http://localhost:8000/api/users/enable_default/${addressId}/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        fetchAddresses()
      }
    } catch (error) {
      console.error(error)
    }
  }



  const handleSubmitAdd = async (data) => {
    console.log("Submitting data: ", data)
    // e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('http://localhost:8000/api/users/create_address/', data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      fetchAddresses()
      setShowAddModal(false)
      // resetForm()
      reset()
    } catch (error) {
      console.error("Error saving address : ", error.response?.data || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitEdit = async (data) => {
    if (!editingAddress) return
    setIsLoading(true)

    try {
      const res = await axiosInstance.put(`http://localhost:8000/api/users/update_address/${editingAddress.id}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        fetchAddresses()
        setShowEditModal(false)
        setEditingAddress(null)
        reset()
      }
    } catch (error) {
      console.error("Error updating address:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    setIsLoading(true)
    try {
      const res = await axiosInstance.delete(`http://localhost:8000/api/users/delete_address/${selectedAddress.id}/`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if(res.status===200){
        fetchAddresses()
        setShowDeleteModal(false)
      }
    } catch (error) {
      console.error("Error deleting address:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const AddressModal = ({ show, onHide, onSubmit, title, isEdit = false }) => {
    if (!show) return null

    return (
      <div className="modal fade show d-block address-modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      <FaUser className="me-2 text-danger" /> Full Name *
                    </label>
                    <input
                      className="form-control"
                      placeholder="Enter full name"
                      {...register("full_name", { required: "Full name is required" })}
                    />
                    {errors.full_name && <small className="text-danger">{errors.full_name.message}</small>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      <FaPhone className="me-2 text-danger" /> Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 XXXXXXXXXX"
                      {...register("phone_number", {
                        required: "Phone number is required",
                        pattern: { value: /^[6-9]\d{9}$/, message: "Invalid Indian phone number" },
                      })}
                    />
                    {errors.phone_number && <small className="text-danger">{errors.phone_number.message}</small>}
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      <FaHome className="me-2 text-danger" /> Address Line 1 *
                    </label>
                    <input
                      className="form-control"
                      placeholder="House/Flat/Office No, Building Name, Street"
                      {...register("address_line1", { required: "Address Line 1 is required" })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      <FaBuilding className="me-2 text-danger" /> Address Line 2
                    </label>
                    <input
                      className="form-control"
                      placeholder="Landmark, Area (Optional)"
                      {...register("address_line2")}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input
                      className="form-control"
                      placeholder="Enter city"
                      {...register("city", { required: "City is required" })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <select className="form-select" {...register("state", { required: "State is required" })}>
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Postal Code *</label>
                    <input
                      className="form-control"
                      placeholder="XXXXXX"
                      maxLength={6}
                      {...register("postal_code", {
                        required: "Postal Code is required",
                        pattern: { value: /^\d{6}$/, message: "Must be a 6-digit code" },
                      })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Country</label>
                    <input className="form-control" readOnly {...register("country")} />
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" {...register("is_default")} />
                      <label className="form-check-label">
                        <FaStar className="me-2 text-warning" />
                        Set as default address
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 mt-4">
                  <button type="button" className="btn btn-secondary" onClick={onHide} disabled={isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {editingAddress ? "Updating..." : "Adding..."}
                      </>
                    ) : editingAddress ? (
                      "Update Address"
                    ) : (
                      "Add Address"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="address-page">
      {/* Page Header */}
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-secondary me-3 back-btn" onClick={() => navigate(-1)} title="Go back">
              <FaArrowLeft />
            </button>
            <div>
              <h2 className="mb-1">
                <FaMapMarkerAlt className="text-danger me-2" />
                Delivery Addresses
              </h2>
              <p className="text-muted mb-0">Manage your delivery locations</p>
            </div>
          </div>
          <button className="btn btn-danger" onClick={handleAddAddress}>
            <FaPlus className="me-2" />
            Add New Address
          </button>
        </div>

        {/* Address Cards */}
        <div className="row g-3">
          {addresses.map((address) => (
            <div key={address.id} className="col-md-6 col-lg-4">
              <div className={`card address-card h-100 ${address.is_default ? "default-address" : ""}`}>
                <div className="card-body">
                  {address.is_default && (
                    <div className="default-badge">
                      <FaStar className="me-1" />
                      Default
                    </div>
                  )}

                  <div className="address-header mb-3">
                    <h6 className="mb-1">{address.full_name}</h6>
                    <small className="text-muted">{address.phone_number}</small>
                  </div>

                  <div className="address-details mb-3">
                    <p className="mb-1">{address.address_line1}</p>
                    {address.address_line2 && <p className="mb-1 text-muted">{address.address_line2}</p>}
                    <p className="mb-0">
                      {address.city}, {address.state} - {address.postal_code}
                    </p>
                    <small className="text-muted">{address.country}</small>
                  </div>

                  <div className="address-actions">
                    <div className="btn-group w-100" role="group">
                      {!address.is_default && (
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={isLoading}
                        >
                          <FaCheck className="me-1" />
                          Set Default
                        </button>
                      )}
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditAddress(address)}>
                        <FaEdit className="me-1" />
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteAddress(address)}
                        disabled={addresses.length === 1}
                      >
                        <FaTrash className="me-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="text-center py-5">
            <FaMapMarkerAlt size={64} className="text-muted mb-3" />
            <h4 className="text-muted">No addresses found</h4>
            <p className="text-muted">Add your first delivery address to get started</p>
            <button className="btn btn-danger" onClick={handleAddAddress}>
              <FaPlus className="me-2" />
              Add Address
            </button>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      <AddressModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleSubmitAdd}
        title="Add New Address"
      />

      {/* Edit Address Modal */}
      <AddressModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false)
          setEditingAddress(null)
          resetForm()
        }}
        onSubmit={handleSubmitEdit}
        title="Edit Address"
        isEdit={true}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this address?</p>
                <div className="bg-light p-3 rounded">
                  <strong>{selectedAddress?.full_name}</strong>
                  <br />
                  {selectedAddress?.address_line1}
                  <br />
                  {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.postal_code}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete Address"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddressPage

