"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
    FaArrowLeft,
    FaCreditCard,
    FaUniversity,
    FaWallet,
    FaMobile,
    FaMoneyBillWave,
    FaShieldAlt,
    FaLock,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaEdit,
    FaUser,
    FaGift,
    FaClock,
    FaTruck,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa"
import "../Style/PaymentPage.css"
import axiosInstance from "../Utils/AxiosInstance"
import { toast } from "react-toastify"

const PaymentPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [order, setOrder] = useState(location.state?.order || null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [showOrderSummary, setShowOrderSummary] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        saveInfo: false,
    })

    // Mock order data if not provided
    useEffect(() => {
        if (!order) {
            setOrder({
                id: "ORD" + Date.now(),
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
                subtotal: 280,
                discount: 28,
                deliveryFee: 0,
                total: 252,
                deliveryAddress: {
                    name: "John Doe",
                    phone: "+91 9876543210",
                    address: "123 Main Street, Mumbai, Maharashtra - 400001",
                },
                estimatedDelivery: "Tomorrow, 2-4 PM",
            })
        }
    }, [order])

    const paymentMethods = [
        {
            id: "razorpay",
            name: "Credit/Debit Card",
            description: "Visa, Mastercard, RuPay, American Express",
            icon: <FaCreditCard />,
            type: "card",
            popular: true,
        },
        {
            id: "netbanking",
            name: "Net Banking",
            description: "All major banks supported",
            icon: <FaUniversity />,
            type: "netbanking",
        },
        {
            id: "upi",
            name: "UPI",
            description: "Google Pay, PhonePe, Paytm, BHIM",
            icon: <FaMobile />,
            type: "upi",
            popular: true,
        },
        {
            id: "wallet",
            name: "Digital Wallets",
            description: "Paytm, Mobikwik, Amazon Pay",
            icon: <FaWallet />,
            type: "wallet",
        },
        {
            id: "cod",
            name: "Cash on Delivery",
            description: "Pay when you receive your order",
            icon: <FaMoneyBillWave />,
            type: "cod",
            fee: 25,
        },
    ]

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handlePaymentMethodSelect = (methodId) => {
        setSelectedPaymentMethod(methodId)
    }

    const handlePayment = async () => {
        if (!selectedPaymentMethod) {
            alert("Please select a payment method")
            return
        }

        setIsProcessing(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            if (selectedPaymentMethod === "cod") {
                // Handle Cash on Delivery

                const res = await axiosInstance.post('http://localhost:8000/api/orders/cod_payment_success/', {
                    'order_id': order.id
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                })
                if (res.status === 200) {
                    navigate('/order_success', {
                        state: {
                            order: res.data
                        }
                    })
                }else{
                    toast.error("Failed to confirm the order.")
                }

            } else {
                // For other payment methods, integrate with Razorpay
                const options = {
                    key: "your_razorpay_key", // Replace with your Razorpay key
                    amount: order.total * 100, // Amount in paise
                    currency: "INR",
                    name: "Organic Store",
                    description: `Order #${order.id}`,
                    order_id: order.id,
                    handler: (response) => {
                        // Payment successful
                        navigate("/order-success", {
                            state: {
                                order: {
                                    ...order,
                                    paymentMethod: paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name,
                                    paymentStatus: "Completed",
                                    paymentId: response.razorpay_payment_id,
                                    orderId: order.id,
                                },
                            },
                        })
                    },
                    prefill: {
                        name: order.deliveryAddress.name,
                        email: formData.email,
                        contact: formData.phone || order.deliveryAddress.phone,
                    },
                    theme: {
                        color: "#e40046",
                    },
                }

                // Initialize Razorpay (you'll need to load the Razorpay script)
                // const rzp = new window.Razorpay(options);
                // rzp.open();

                // For demo purposes, simulate successful payment
                setTimeout(() => {
                    navigate("/order-success", {
                        state: {
                            order: {
                                ...order,
                                paymentMethod: paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name,
                                paymentStatus: "Completed",
                                paymentId: "pay_" + Date.now(),
                                orderId: order.id,
                            },
                        },
                    })
                }, 1000)
            }
        } catch (error) {
            console.error("Payment failed:", error)
            alert("Payment failed. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    if (!order) {
        return (
            <div className="payment-page">
                <div className="container">
                    <div className="text-center py-5">
                        <h3>No order found</h3>
                        <button className="btn btn-danger" onClick={() => navigate("/cart")}>
                            Go to Cart
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="payment-page">
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
                        <div className="checkout-progress">
                            <span className="progress-step completed">Cart</span>
                            <span className="progress-divider"></span>
                            <span className="progress-step active">Payment</span>
                            <span className="progress-divider"></span>
                            <span className="progress-step">Confirmation</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="row g-4">
                    {/* Payment Section */}
                    <div className="col-lg-8">
                        {/* Contact Information */}
                        {/* <div className="payment-section">
                            <div className="section-header">
                                <h5 className="section-title">
                                    <FaUser className="me-2 text-danger" />
                                    Contact Information
                                </h5>
                            </div>
                            <div className="section-content">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            <FaEnvelope className="me-2 text-muted" />
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            <FaPhone className="me-2 text-muted" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="saveInfo"
                                                id="saveInfo"
                                                checked={formData.saveInfo}
                                                onChange={handleInputChange}
                                            />
                                            <label className="form-check-label" htmlFor="saveInfo">
                                                Save this information for faster checkout next time
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* Delivery Address */}
                        <div className="payment-section">
                            <div className="section-header">
                                <h5 className="section-title">
                                    <FaMapMarkerAlt className="me-2 text-danger" />
                                    Delivery Address
                                </h5>
                                {/* <button className="btn btn-link btn-sm">
                                    <FaEdit className="me-1" />
                                    Change
                                </button> */}
                            </div>
                            <div className="section-content">
                                <div className="address-card">
                                    {/* <div className="address-info">
                    <h6>{order.address.full_name}</h6>
                    <p>{order.address}</p>
                    <small className="text-muted">{order.address.phone_number}</small>
                  </div> */}
                                    <div className="address-info">
                                        <h6>{order.address.full_name}</h6>
                                        <p>
                                            {order.address.address_line1}, {order.address.address_line2 && `${order.address.address_line2}, `}
                                            {order.address.city}, {order.address.state} - {order.address.postal_code}, {order.address.country}
                                        </p>
                                        <small className="text-muted">{order.address.phone_number}</small>
                                    </div>

                                    <div className="delivery-info">
                                        <div className="delivery-badge">
                                            <FaTruck className="me-2" />
                                            <span>Estimated Delivery: {order.estimatedDelivery}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="payment-section">
                            <div className="section-header">
                                <h5 className="section-title">
                                    <FaCreditCard className="me-2 text-danger" />
                                    Payment Method
                                </h5>
                                <div className="security-badge">
                                    <FaShieldAlt className="me-1" />
                                    <span>Secure Payment</span>
                                </div>
                            </div>
                            <div className="section-content">
                                <div className="payment-methods">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`payment-method ${selectedPaymentMethod === method.id ? "selected" : ""}`}
                                            onClick={() => handlePaymentMethodSelect(method.id)}
                                        >
                                            <div className="method-radio">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.id}
                                                    checked={selectedPaymentMethod === method.id}
                                                    onChange={() => handlePaymentMethodSelect(method.id)}
                                                />
                                            </div>
                                            <div className="method-icon">{method.icon}</div>
                                            <div className="method-details">
                                                <div className="method-name">
                                                    {method.name}
                                                    {method.popular && <span className="popular-badge">Popular</span>}
                                                </div>
                                                <div className="method-description">{method.description}</div>
                                                {method.fee && <div className="method-fee">+ ₹{method.fee} handling fee</div>}
                                            </div>
                                            <div className="method-check">
                                                {selectedPaymentMethod === method.id && <FaCheckCircle className="text-success" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="security-info">
                            <div className="security-items">
                                <div className="security-item">
                                    <FaLock className="security-icon" />
                                    <span>SSL Encrypted</span>
                                </div>
                                <div className="security-item">
                                    <FaShieldAlt className="security-icon" />
                                    <span>100% Secure</span>
                                </div>
                                <div className="security-item">
                                    <FaClock className="security-icon" />
                                    <span>Quick Processing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="order-summary-card">
                            <div className="summary-header">
                                <h5 className="summary-title">Order Summary</h5>
                                <button className="btn btn-link btn-sm" onClick={() => setShowOrderSummary(!showOrderSummary)}>
                                    {showOrderSummary ? "Hide" : "Show"} Details
                                </button>
                            </div>

                            {/* Order Items */}
                            <div className={`order-items ${showOrderSummary ? "expanded" : ""}`}>
                                {order.items.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <div className="item-image-container">
                                            <img src={item.product.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                                            <span className="item-quantity">{item.quantity}</span>
                                        </div>
                                        <div className="item-details">
                                            <h6 className="item-name">{item.product.name}</h6>
                                            <div className="item-price">₹{item.product.price * item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Subtotal ({order.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span>₹{order.total_amount}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="price-row discount">
                                        <span>
                                            <FaGift className="me-1" />
                                            Discount
                                        </span>
                                        <span>-₹{order.discount}</span>
                                    </div>
                                )}
                                {/* <div className="price-row">
                                    <span>Delivery Fee</span>
                                    <span className={order.deliveryFee === 0 ? "text-success" : ""}>
                                        {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
                                    </span>
                                </div> */}
                                {/* {selectedPaymentMethod === "cod" && (
                                    <div className="price-row">
                                        <span>COD Handling Fee</span>
                                        <span>₹25</span>
                                    </div>
                                )} */}
                                <hr />
                                <div className="price-row total">
                                    <span>Total Amount</span>
                                    <span>₹{selectedPaymentMethod === "cod" ? order.total_amount : order.total_amount}</span>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <button className="payment-btn" onClick={handlePayment} disabled={!selectedPaymentMethod || isProcessing}>
                                {isProcessing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Processing...
                                    </>
                                ) : selectedPaymentMethod === "cod" ? (
                                    <>
                                        <FaMoneyBillWave className="me-2" />
                                        Place Order (COD)
                                    </>
                                ) : (
                                    <>
                                        <FaLock className="me-2" />
                                        Pay ₹{selectedPaymentMethod === "cod" ? order.total_amount : order.total_amount}
                                    </>
                                )}
                            </button>

                            {/* Payment Info */}
                            <div className="payment-info">
                                <small className="text-muted">
                                    By placing your order, you agree to our Terms of Service and Privacy Policy
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage
