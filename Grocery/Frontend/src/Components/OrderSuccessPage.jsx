"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  FaCheckCircle,
  FaHome,
  FaShoppingBag,
  FaTruck,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaDownload,
  FaWhatsapp,
  FaStar,
  FaGift,
  FaHeart,
} from "react-icons/fa"
import "../Style/OrderSuccessPage.css"

const OrderSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(location.state?.order || null)
  const [showConfetti, setShowConfetti] = useState(true)
  const [animationStep, setAnimationStep] = useState(0)

  // Mock order data if not provided
  useEffect(() => {
    if (!order) {
      setOrder({
        id: "ORD" + Date.now(),
        orderId: "ORD123456789",
        paymentId: "pay_" + Date.now(),
        paymentMethod: "Credit Card",
        paymentStatus: "Completed",
        total: 252,
        items: [
          {
            id: 1,
            name: "Organic Apples",
            quantity: 2,
            price: 100,
            image: "/placeholder.svg?height=60&width=60",
          },
          {
            id: 2,
            name: "Brown Rice",
            quantity: 1,
            price: 80,
            image: "/placeholder.svg?height=60&width=60",
          },
        ],
        deliveryAddress: {
          name: "John Doe",
          phone: "+91 9876543210",
          email: "john.doe@example.com",
          address: "123 Main Street, Mumbai, Maharashtra - 400001",
        },
        estimatedDelivery: "Tomorrow, 2-4 PM",
        orderDate: new Date().toLocaleDateString(),
      })
    }
  }, [order])

  // Animation sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 500)
    const timer2 = setTimeout(() => setAnimationStep(2), 1000)
    const timer3 = setTimeout(() => setAnimationStep(3), 1500)
    const timer4 = setTimeout(() => setShowConfetti(false), 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    alert("Invoice download will be implemented here")
  }

  const handleShareOrder = (platform) => {
    const shareText = `I just placed an order #${order?.orderId} on Organic Store! 🛒✨`
    const shareUrl = window.location.origin

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`)
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)
        break
      default:
        navigator.clipboard.writeText(shareText + " " + shareUrl)
        alert("Order details copied to clipboard!")
    }
  }

  const ConfettiPiece = ({ delay, color, size }) => (
    <div className={`confetti-piece confetti-${color} confetti-${size}`} style={{ animationDelay: `${delay}ms` }}></div>
  )

  if (!order) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="text-center py-5">
            <h3>No order found</h3>
            <button className="btn btn-danger" onClick={() => navigate("/home")}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="order-success-page">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <ConfettiPiece
              key={i}
              delay={Math.random() * 3000}
              color={["red", "green", "blue", "yellow", "purple"][Math.floor(Math.random() * 5)]}
              size={["small", "medium", "large"][Math.floor(Math.random() * 3)]}
            />
          ))}
        </div>
      )}

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Success Header */}
            <div className={`success-header ${animationStep >= 1 ? "animate" : ""}`}>
              <div className="success-icon-container">
                <div className="success-icon">
                  <FaCheckCircle />
                </div>
                <div className="success-ripple"></div>
                <div className="success-ripple delay-1"></div>
                <div className="success-ripple delay-2"></div>
              </div>
              <h1 className="success-title">Order Placed Successfully!</h1>
              <p className="success-subtitle">
                Thank you for your order. We've received your order and will process it shortly.
              </p>
              <div className="order-number">
                <span className="order-label">Order Number:</span>
                <span className="order-id">#{order.id}</span>
              </div>
            </div>

            {/* Order Details Card */}
            <div className={`order-details-card ${animationStep >= 2 ? "animate" : ""}`}>
              <div className="card-header">
                <h4 className="card-title">
                  <FaShoppingBag className="me-2 text-danger" />
                  Order Details
                </h4>
                <div className="order-status">
                  <span className="status-badge confirmed">Confirmed</span>
                </div>
              </div>

              <div className="card-body">
                {/* Order Items */}
                <div className="order-items-section">
                  <h6 className="section-title">Items Ordered</h6>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={item.id} className="order-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="item-image-container">
                          <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                          <span className="item-quantity">{item.quantity}</span>
                        </div>
                        <div className="item-details">
                          <h6 className="item-name">{item.name}</h6>
                          <div className="item-price">
                            ₹{item.price} × {item.quantity}
                          </div>
                        </div>
                        <div className="item-total">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="payment-info-section">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="info-card">
                        <h6 className="info-title">Payment Information</h6>
                        <div className="info-details">
                          <div className="info-row">
                            <span>Payment Method:</span>
                            <span className="fw-bold">{order.payment_method}</span>
                          </div>
                          <div className="info-row">
                            <span>Payment Status:</span>
                            <span className="status-badge paid">{order.payment_status}</span>
                          </div>
                          {order.paymentId && (
                            <div className="info-row">
                              <span>Payment ID:</span>
                              <span className="payment-id">{order.paymentId}</span>
                            </div>
                          )}
                          <div className="info-row total">
                            <span>Total Amount:</span>
                            <span className="fw-bold text-danger">₹{order.total_amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-card">
                        <h6 className="info-title">Delivery Information</h6>
                        <div className="info-details">
                          <div className="delivery-address">
                            <FaMapMarkerAlt className="me-2 text-danger" />
                            <div>
                              <strong>{order.address.full_name}</strong>
                              {/* <p>{order.address}</p> */}
                              <p>
                                {order.address.address_line1}, {order.address.address_line2},<br />
                                {order.address.city}, {order.address.state} - {order.address.postal_code},<br />
                                {order.address.country}
                              </p>
                            </div>
                          </div>
                          <div className="contact-info">
                            <div className="contact-item">
                              <FaPhone className="me-2 text-muted" />
                              <span>{order.address.phone_number}</span>
                            </div>
                            {/* <div className="contact-item">
                              <FaEnvelope className="me-2 text-muted" />
                              <span>{order.deliveryAddress.email}</span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className={`delivery-timeline-card ${animationStep >= 3 ? "animate" : ""}`}>
              <div className="card-header">
                <h4 className="card-title">
                  <FaTruck className="me-2 text-danger" />
                  Delivery Timeline
                </h4>
              </div>
              <div className="card-body">
                <div className="timeline">
                  <div className="timeline-item active">
                    <div className="timeline-icon">
                      <FaCheckCircle />
                    </div>
                    <div className="timeline-content">
                      <h6>Order Confirmed</h6>
                      <p>Your order has been confirmed and is being prepared</p>
                      <small className="text-muted">Today, {new Date().toLocaleTimeString()}</small>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <FaShoppingBag />
                    </div>
                    <div className="timeline-content">
                      <h6>Order Packed</h6>
                      <p>Your order is being packed and will be dispatched soon</p>
                      <small className="text-muted">Expected in 2-4 hours</small>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon">
                      <FaTruck />
                    </div>
                    <div className="timeline-content">
                      <h6>Out for Delivery</h6>
                      <p>Your order is on the way to your delivery address</p>
                      <small className="text-muted">{order.estimatedDelivery}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`action-buttons ${animationStep >= 3 ? "animate" : ""}`}>
              <div className="row g-3">
                <div className="col-md-6">
                  <button className="btn btn-primary btn-lg w-100" onClick={() => navigate("/home")}>
                    <FaHome className="me-2" />
                    Continue Shopping
                  </button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-outline-danger btn-lg w-100" onClick={() => navigate("/orders")}>
                    <FaShoppingBag className="me-2" />
                    View All Orders
                  </button>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="additional-actions">
                <button className="action-btn" onClick={handleDownloadInvoice} title="Download Invoice">
                  <FaDownload />
                  <span>Invoice</span>
                </button>
                <button className="action-btn" onClick={() => handleShareOrder("whatsapp")} title="Share on WhatsApp">
                  <FaWhatsapp />
                  <span>Share</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/support")} title="Need Help?">
                  <FaPhone />
                  <span>Support</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/products")} title="Rate Products">
                  <FaStar />
                  <span>Rate</span>
                </button>
              </div>
            </div>

            {/* Promotional Section */}
            <div className={`promo-sections ${animationStep >= 3 ? "animate" : ""}`}>
              <div className="promo-card">
                <div className="promo-icon">
                  <FaGift />
                </div>
                <div className="promo-content">
                  <h5>Enjoy Your Shopping Experience!</h5>
                  <p>
                    Get 10% off on your next order. Use code: <strong>NEXT10</strong>
                  </p>
                  <button className="btn btn-outline-danger btn-sm">
                    <FaHeart className="me-2" />
                    Save for Next Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessPage
