"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaShoppingBag,
  FaUser,
  FaSearch,
  FaEye,
  FaDownload,
  FaRedo,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCreditCard,
  FaMoneyBillWave,
  FaUniversity,
  FaMobile,
  FaWallet,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaBox,
  FaMapMarkerAlt,
} from "react-icons/fa"
import "../Style/OrdersPage.css"
import axiosInstance from "../Utils/AxiosInstance"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [animatingItems, setAnimatingItems] = useState(new Set())

  const navigate = useNavigate()

  useEffect(() => {
    const fetch_orders = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:8000/api/orders/get_all_orders/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if (res.status === 200) {
          setOrders(res.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false); // 🔴 Ensure this always runs
      }
    }
    fetch_orders()
  }, [])

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Payment filter
    if (paymentFilter) {
      filtered = filtered.filter((order) => order.paymentMethod === paymentFilter)
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "amount":
          aValue = a.totalAmount
          bValue = b.totalAmount
          break
        case "date":
        default:
          aValue = new Date(a.orderDate)
          bValue = new Date(b.orderDate)
          break
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredOrders(filtered)
    setCurrentPage(1)
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy, sortOrder])

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle className="text-success" />
      case "shipped":
        return <FaTruck className="text-primary" />
      case "processing":
        return <FaClock className="text-warning" />
      case "cancelled":
        return <FaTimesCircle className="text-danger" />
      case "pending":
        return <FaClock className="text-muted" />
      default:
        return <FaClock className="text-muted" />
    }
  }

  const getPaymentIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <FaCreditCard />
      case "upi":
        return <FaMobile />
      case "netbanking":
        return <FaUniversity />
      case "wallet":
        return <FaWallet />
      case "cod":
        return <FaMoneyBillWave />
      default:
        return <FaCreditCard />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success"
      case "shipped":
        return "primary"
      case "processing":
        return "warning"
      case "cancelled":
        return "danger"
      case "pending":
        return "secondary"
      case "failed":
        return "danger"
      default:
        return "success"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "pending":
        return "warning"
      case "failed":
        return "danger"
      case "refunded":
        return "info"
      case "success":
        return "success"
      default:
        return "secondary"
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleReorder = (order) => {
    setAnimatingItems((prev) => new Set(prev).add(order.id))

    setTimeout(() => {
      // Add items to cart logic here
      alert(`Items from order #${order.orderId} added to cart!`)
      setAnimatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(order.id)
        return newSet
      })
    }, 1000)
  }

  const handleTrackOrder = (order) => {
    // Navigate to tracking page or show tracking modal
    alert(`Tracking order #${order.orderId} - ${order.trackingNumber}`)
  }

  const handleDownloadInvoice = (order) => {
    // Download invoice logic
    alert(`Downloading invoice for order #${order.orderId}`)
  }

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${i === currentPage ? "btn-danger" : "btn-outline-danger"} btn-sm me-1`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>,
      )
    }

    return (
      <div className="d-flex justify-content-center align-items-center mt-4">
        <button
          className="btn btn-outline-danger btn-sm me-2"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="btn btn-outline-danger btn-sm ms-2"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )
  }

  // const OrderCard = ({ order, index }) => (
  //   <div
  //     className={`order-card ${animatingItems.has(order.id) ? "reordering" : ""}`}
  //     style={{ animationDelay: `${index * 0.1}s` }}
  //   >
  //     <div className="order-header">
  //       <div className="order-info">
  //         <h6 className="order-id">#{order.id}</h6>
  //         <div className="order-date">
  //           <FaCalendarAlt className="me-2 text-muted" />
  //           {new Date(order.address.created_at).toLocaleDateString("en-IN", {
  //             day: "numeric",
  //             month: "short",
  //             year: "numeric",
  //           })}
  //         </div>
  //       </div>
  //       <div className="order-status">
  //         <span className={`status-badge status-${getStatusColor(order.payment_status)}`}>
  //           {getStatusIcon(order.status)}
  //           <span className="ms-2">{order.status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</span>
  //         </span>
  //       </div>
  //     </div>

  //     <div className="order-items">
  //       <div className="items-preview">
  //         {order.items.slice(0, 3).map((item, itemIndex) => (
  //           <div
  //             key={item.product.id}
  //             className="item-preview"
  //             style={{ animationDelay: `${index * 0.1 + itemIndex * 0.05}s` }}
  //           >
  //             <img src={item.product.image || "/placeholder.svg"} alt={item.product.name} className="item-image" />
  //             <div className="item-details">
  //               <span className="item-name">{item.product.name}</span>
  //               <span className="item-quantity">Qty: {item.quantity}</span>
  //             </div>
  //           </div>
  //         ))}
  //         {order.items.length > 3 && <div className="more-items">+{order.items.length - 3} more</div>}
  //       </div>
  //     </div>

  //     <div className="order-details">
  //       <div className="payment-info">
  //         <div className="payment-method">
  //           {getPaymentIcon(order.paymentMethod)}
  //           <span className="ms-2">
  //             {order.payment_method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
  //           </span>
  //         </div>
  //         <div className="payment-status">
  //           <span className={`badge bg-${getPaymentStatusColor(order.payment_status)}`}>
  //             {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
  //           </span>
  //         </div>
  //       </div>

  //       <div className="order-amount">
  //         <span className="amount-label">Total Amount</span>
  //         <span className="amount-value">₹{order.total_amount.toFixed(2)}</span>
  //       </div>
  //     </div>

  //     <div className="order-actions">
  //       <button className="action-btn view-btn" onClick={() => handleViewOrder(order)} title="View Details">
  //         <FaEye />
  //       </button>

  //       {order.status !== "cancelled" && (
  //         <button className="action-btn track-btn" onClick={() => handleTrackOrder(order)} title="Track Order">
  //           <FaTruck />
  //         </button>
  //       )}

  //       <button
  //         className="action-btn download-btn"
  //         onClick={() => handleDownloadInvoice(order)}
  //         title="Download Invoice"
  //       >
  //         <FaDownload />
  //       </button>

  //       {order.status === "delivered" && (
  //         <button
  //           className="action-btn reorder-btn"
  //           onClick={() => handleReorder(order)}
  //           title="Reorder"
  //           disabled={animatingItems.has(order.id)}
  //         >
  //           {animatingItems.has(order.id) ? (
  //             <div className="spinner-border spinner-border-sm" role="status"></div>
  //           ) : (
  //             <FaRedo />
  //           )}
  //         </button>
  //       )}
  //     </div>
  //   </div>
  // )

  const OrderCard = ({ order, index }) => (
    <div
      className={`order-card ${animatingItems.has(order.id) ? "reordering" : ""}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="order-header">
        <div className="order-info">
          <h6 className="order-id">#{order.id}</h6>
          <div className="order-date">
            <FaCalendarAlt className="me-2 text-muted" />
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="order-status">
          <span className={`status-badge status-${getStatusColor(order.payment_status)}`}>
            {getStatusIcon(order.payment_status)}
            <span className="ms-2">
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
          </span>
        </div>
      </div>

      <div className="order-items">
        <div className="items-preview">
          {order.items.slice(0, 3).map((item, itemIndex) => (
            <div
              key={item.product.id}
              className="item-preview"
              style={{ animationDelay: `${index * 0.1 + itemIndex * 0.05}s` }}
            >
              <img
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.name}
                className="item-image"
              />
              <div className="item-details">
                <span className="item-name">{item.product.name}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
          {order.items.length > 3 && <div className="more-items">+{order.items.length - 3} more</div>}
        </div>
      </div>

      <div className="order-details">
        <div className="payment-info">
          <div className="payment-method">
            {getPaymentIcon(order.payment_method)}
            <span className="ms-2">
              {order.payment_method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
          <div className="payment-status">
            <span className={`badge bg-${getPaymentStatusColor(order.payment_status)}`}>
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
          </div>
        </div>

        <div className="order-amount">
          <span className="amount-label">Total Amount</span>
          <span className="amount-value">₹{parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <div className="order-actions">
        <button className="order-btn"  onClick={() => handleViewOrder(order)} title="View Details">
          <FaEye size={18}/>
        </button>

        <button
          className="order-btn"
          onClick={() => handleDownloadInvoice(order)}
          title="Download Invoice"
        >
          <FaDownload size={18} />
        </button>

        {/* <button
          className="order-btn"
          onClick={() => handleReorder(order)}
          title="Reorder"
          disabled={animatingItems.has(order.id)}
        >
          {animatingItems.has(order.id) ? (
            <div className="spinner-border spinner-border-sm" role="status"></div>
          ) : (
            <FaRedo size={18} />
          )}
        </button> */}
      </div>
    </div>
  )

  // const OrderModal = () => {
  //   if (!showOrderModal || !selectedOrder) return null

  //   return (
  //     <div className="modal fade show d-block order-modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
  //       <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
  //         <div className="modal-content">
  //           <div className="modal-header">
  //             <h5 className="modal-title">
  //               <FaShoppingBag className="me-2 text-danger" />
  //               Order Details - #{selectedOrder.orderId}
  //             </h5>
  //             <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
  //           </div>
  //           <div className="modal-body">
  //             <div className="row g-4">
  //               {/* Order Status */}
  //               <div className="col-12">
  //                 <div className="status-timeline">
  //                   <div
  //                     className={`timeline-step ${["pending", "processing", "shipped", "delivered"].includes(selectedOrder.status) ? "completed" : ""}`}
  //                   >
  //                     <div className="step-icon">
  //                       <FaClock />
  //                     </div>
  //                     <div className="step-label">Order Placed</div>
  //                   </div>
  //                   <div
  //                     className={`timeline-step ${["processing", "shipped", "delivered"].includes(selectedOrder.status) ? "completed" : selectedOrder.status === "pending" ? "active" : ""}`}
  //                   >
  //                     <div className="step-icon">
  //                       <FaBox />
  //                     </div>
  //                     <div className="step-label">Processing</div>
  //                   </div>
  //                   <div
  //                     className={`timeline-step ${["shipped", "delivered"].includes(selectedOrder.status) ? "completed" : selectedOrder.status === "processing" ? "active" : ""}`}
  //                   >
  //                     <div className="step-icon">
  //                       <FaTruck />
  //                     </div>
  //                     <div className="step-label">Shipped</div>
  //                   </div>
  //                   <div
  //                     className={`timeline-step ${selectedOrder.status === "delivered" ? "completed" : selectedOrder.status === "shipped" ? "active" : ""}`}
  //                   >
  //                     <div className="step-icon">
  //                       <FaCheckCircle />
  //                     </div>
  //                     <div className="step-label">Delivered</div>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Order Items */}
  //               <div className="col-12">
  //                 <h6 className="section-title">Order Items</h6>
  //                 <div className="modal-order-items">
  //                   {selectedOrder.items.map((item) => (
  //                     <div key={item.id} className="modal-order-item">
  //                       <img src={item.image || "/placeholder.svg"} alt={item.name} className="modal-item-image" />
  //                       <div className="modal-item-details">
  //                         <h6 className="modal-item-name">{item.name}</h6>
  //                         <div className="modal-item-price">
  //                           ₹{item.price} × {item.quantity}
  //                         </div>
  //                       </div>
  //                       <div className="modal-item-total">₹{item.price * item.quantity}</div>
  //                     </div>
  //                   ))}
  //                 </div>
  //               </div>

  //               {/* Payment & Delivery Info */}
  //               <div className="col-md-6">
  //                 <h6 className="section-title">Payment Information</h6>
  //                 <div className="info-card">
  //                   <div className="info-row">
  //                     <span>Payment Method:</span>
  //                     <span className="d-flex align-items-center">
  //                       {getPaymentIcon(selectedOrder.paymentMethod)}
  //                       <span className="ms-2">
  //                         {selectedOrder.paymentMethod.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
  //                       </span>
  //                     </span>
  //                   </div>
  //                   <div className="info-row">
  //                     <span>Payment Status:</span>
  //                     <span className={`badge bg-${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
  //                       {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
  //                     </span>
  //                   </div>
  //                   <div className="info-row">
  //                     <span>Total Amount:</span>
  //                     <span className="fw-bold text-danger">₹{selectedOrder.totalAmount.toFixed(2)}</span>
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className="col-md-6">
  //                 <h6 className="section-title">Delivery Information</h6>
  //                 <div className="info-card">
  //                   <div className="delivery-address">
  //                     <FaMapMarkerAlt className="me-2 text-danger" />
  //                     <div>
  //                       <strong>{selectedOrder.deliveryAddress.name}</strong>
  //                       <p className="mb-1">{selectedOrder.deliveryAddress.address}</p>
  //                       <small className="text-muted">{selectedOrder.deliveryAddress.phone}</small>
  //                     </div>
  //                   </div>
  //                   {selectedOrder.trackingNumber && (
  //                     <div className="tracking-info">
  //                       <strong>Tracking Number:</strong>
  //                       <span className="tracking-number">{selectedOrder.trackingNumber}</span>
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="modal-footer">
  //             <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>
  //               Close
  //             </button>
  //             {selectedOrder.status !== "cancelled" && (
  //               <button type="button" className="btn btn-primary" onClick={() => handleTrackOrder(selectedOrder)}>
  //                 <FaTruck className="me-2" />
  //                 Track Order
  //               </button>
  //             )}
  //             <button
  //               type="button"
  //               className="btn btn-outline-danger"
  //               onClick={() => handleDownloadInvoice(selectedOrder)}
  //             >
  //               <FaDownload className="me-2" />
  //               Download Invoice
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  const OrderModal = () => {
    if (!showOrderModal || !selectedOrder) return null

    const address = selectedOrder.address

    return (
      <div className="modal fade show d-block order-modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FaShoppingBag className="me-2 text-danger" />
                Order Details - #{selectedOrder.id}
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="row g-4">
                {/* Items */}
                <div className="col-12">
                  <h6 className="section-title">Order Items</h6>
                  <div className="modal-order-items">
                    {selectedOrder.items.map((item) => (
                      <div key={item.product.id} className="modal-order-item">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="modal-item-image"
                        />
                        <div className="modal-item-details">
                          <h6 className="modal-item-name">{item.product.name}</h6>
                          <div className="modal-item-price">
                            ₹{item.price} × {item.quantity}
                          </div>
                        </div>
                        <div className="modal-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div className="col-md-6">
                  <h6 className="section-title">Payment Information</h6>
                  <div className="info-card">
                    <div className="info-row">
                      <span>Method:</span>
                      <span className="d-flex align-items-center">
                        {getPaymentIcon(selectedOrder.payment_method)}
                        <span className="ms-2">
                          {selectedOrder.payment_method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </span>
                    </div>
                    <div className="info-row">
                      <span>Status:</span>
                      <span className={`badge bg-${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                        {selectedOrder.payment_status.charAt(0).toUpperCase() + selectedOrder.payment_status.slice(1)}
                      </span>
                    </div>
                    <div className="info-row">
                      <span>Total:</span>
                      <span className="fw-bold text-danger">₹{parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="col-md-6">
                  <h6 className="section-title">Delivery Information</h6>
                  <div className="info-card">
                    <div className="delivery-address">
                      <FaMapMarkerAlt className="me-2 text-danger" />
                      <div>
                        <strong>{address.full_name}</strong>
                        <p className="mb-1">
                          {address.address_line1}, {address.address_line2}
                        </p>
                        <small className="text-muted">
                          {address.city}, {address.state}, {address.postal_code}, {address.country}
                        </small>
                        <br />
                        <small className="text-muted">Phone: {address.phone_number}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleDownloadInvoice(selectedOrder)}
              >
                <FaDownload className="me-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-2 shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-secondary me-3 back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
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
                <FaShoppingBag size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h2 className="page-title">
              <FaShoppingBag className="me-3 text-danger" />
              My Orders
            </h2>
            <p className="page-subtitle">Track and manage all your orders</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orders.filter((o) => o.status === "delivered").length}</span>
              <span className="stat-label">Delivered</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All Payments</option>
                <option value="credit_card">Credit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                <option value="wallet">Wallet</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select filter-select"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split("-")
                  setSortBy(sort)
                  setSortOrder(order)
                }}
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-danger w-100 sort-btn"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Loading your orders...</p>
            </div>
          </div>
        ) : paginatedOrders.length > 0 ? (
          <>
            <div className="orders-grid">
              {paginatedOrders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && renderPagination()}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaShoppingBag />
            </div>
            <h4>No orders found</h4>
            <p>You haven't placed any orders yet or no orders match your filters.</p>
            <button className="btn btn-danger" onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderModal />
    </div>
  )
}

export default OrdersPage
