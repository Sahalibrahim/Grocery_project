"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaShoppingCart,
  FaUser,
  FaPlus,
  FaMinus,
  FaTrash,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaTag,
  FaGift,
  FaCreditCard,
  FaMapMarkerAlt,
} from "react-icons/fa"
import "../Style/CartPage.css"
import axiosInstance from "../Utils/AxiosInstance"
import { toast } from 'react-toastify';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])

  const [wishlist, setWishlist] = useState([])
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [animatingItems, setAnimatingItems] = useState(new Set())
  const [defaultAddress, setDefaultAddress] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)

  const navigate = useNavigate()

  // Promo codes
  const promoCodes = {
    SAVE10: { discount: 10, type: "percentage", description: "10% off on all items" },
    FLAT50: { discount: 50, type: "flat", description: "₹50 off on orders above ₹200" },
    WELCOME20: { discount: 20, type: "percentage", description: "20% off for new users" },
  }

  useEffect(() => {
    // Load cart from localStorage if needed
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])


  const fetch_cart_items = async () => {
    try {
      const res = await axiosInstance.get('http://localhost:8000/api/products/get_cart/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        setCartItems(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetch_cart_items()
  }, [])

  const updateAddQuantity = async (itemId) => {
    try {
      const res = await axiosInstance.post(`http://localhost:8000/api/products/add_quantity/${itemId}/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        fetch_cart_items()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetch_address = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:8000/api/products/get_address/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if (res.status === 200) {
          setDefaultAddress(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetch_address()
  }, [])

  const updateSubQuantity = async (itemId) => {
    try {
      const res = await axiosInstance.post(`http://localhost:8000/api/products/sub_quantity/${itemId}/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        fetch_cart_items()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const res = await axiosInstance.delete(`http://localhost:8000/api/products/delete_cart_product/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        fetch_cart_items()
        toast.success("Product deleted from cart.")
      }
      else {
        toast.error("Failed to delete that product.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCheckout = async () => {
    try {
      const res = await axiosInstance.post('http://localhost:8000/api/orders/proceed_to_checkout/', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
      )
      if (res.status === 201) {
        console.log(res.data)
        setOrderDetails(res.data)
        navigate('/payment', { state: { order: res.data } })
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.error || "Failed to place order")
    }
  }

  const moveToWishlist = (item) => {
    setWishlist((prev) => [...prev, item])
    removeItem(item.id)
  }

  const toggleWishlist = (itemId) => {
    setWishlist((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const applyPromoCode = () => {
    const promo = promoCodes[promoCode.toUpperCase()]
    if (promo) {
      setAppliedPromo({ code: promoCode.toUpperCase(), ...promo })
      setPromoCode("")
      setShowPromoInput(false)
    } else {
      alert("Invalid promo code!")
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
  }

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.discount_price || item.product.price
    return sum + price * item.quantity
  }, 0)

  const savings = cartItems.reduce((sum, item) => {
    if (item.product.discount_price) {
      return sum + (item.product.price - item.product.discount_price) * item.quantity
    }
    return sum
  }, 0)

  const deliveryFee = subtotal > 500 ? 0 : 40
  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? (subtotal * appliedPromo.discount) / 100
      : appliedPromo.discount
    : 0

  const total = subtotal - promoDiscount + deliveryFee

  const CartItem = ({ item }) => (
    <div className={`cart-item ${animatingItems.has(item.id) ? "animating" : ""}`}>
      <div className="item-image-container">
        <img src={item.product.image || "/placeholder.svg"} alt={item.product.name} className="item-image" />
      </div>

      <div className="item-details">
        <div className="item-header">
          <h6 className="item-name">{item.name}</h6>
          {/* <button className="wishlist-btn" onClick={() => toggleWishlist(item.id)}>
            {wishlist.includes(item.id) ? <FaHeart className="text-danger" /> : <FaRegHeart />}
          </button> */}
        </div>

        <div className="item-meta">
          <span className="item-category">{item.product.name}</span>
          <span className="item-seller">Category : {item.product.category_name}</span>
        </div>

        <div className="item-price">
          {item.product.discount_price ? (
            <>
              <span className="price-original">₹{item.product.price}</span>
              <span className="price-discounted">₹{item.product.discount_price}</span>
            </>
          ) : (
            <span className="price-current">₹{item.product.price}</span>
          )}
        </div>

        <div className="item-actions">
          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={() => updateSubQuantity(item.id)}
              disabled={item.quantity <= 1}
            >
              <FaMinus />
            </button>
            <span className="quantity-display">{item.quantity}</span>
            <button
              className="quantity-btn"
              onClick={() => updateAddQuantity(item.id)}
              disabled={item.quantity >= item.product.quantity}
            >
              <FaPlus />
            </button>
          </div>

          <div className="item-total">₹{((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}</div>

          <div className="action-buttons">
            {/* <button className="action-btn save-btn" onClick={() => moveToWishlist(item)} title="Save for later">
              <FaHeart />
            </button> */}
            <button className="action-btn remove-btn" onClick={() => removeItem(item.id)} title="Remove item">
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="cart-page">
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
              <a onClick={() => navigate('/user_profile')} className="nav-link me-3">
                <FaUser size={20} className="text-danger" />
              </a>
              <a onClick={() => navigate('/cart')} className="nav-link position-relative">
                <FaShoppingCart size={20} className="text-danger" />
                {cartItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {cartItems.length > 0 ? (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="cart-section">
                <div className="section-header">
                  <h4 className="section-title">
                    <FaShoppingCart className="me-2 text-danger" />
                    Shopping Cart ({cartItems.length} items)
                  </h4>
                  <div className="delivery-info">
                    <FaTruck className="me-2 text-success" />
                    <span>Free delivery on orders above ₹500</span>
                  </div>
                </div>

                <div className="cart-items-container">
                  {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="continue-shopping">
                  <button className="btn btn-outline-danger" onClick={() => navigate("/productspage")}>
                    <FaArrowLeft className="me-2" />
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="order-summary">
                <h5 className="summary-title">Order Summary</h5>

                {/* Promo Code Section */}
                <div className="promo-section">
                  {!showPromoInput && !appliedPromo && (
                    <button className="promo-toggle-btn" onClick={() => setShowPromoInput(true)}>
                      <FaTag className="me-2" />
                      Apply Promo Code
                    </button>
                  )}

                  {showPromoInput && (
                    <div className="promo-input-container">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button className="btn btn-danger" onClick={applyPromoCode}>
                          Apply
                        </button>
                      </div>
                      <button className="btn btn-link btn-sm" onClick={() => setShowPromoInput(false)}>
                        Cancel
                      </button>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="applied-promo">
                      <div className="promo-info">
                        <FaGift className="me-2 text-success" />
                        <span className="promo-code">{appliedPromo.code}</span>
                        <span className="promo-description">{appliedPromo.description}</span>
                      </div>
                      <button className="btn btn-link btn-sm text-danger" onClick={removePromoCode}>
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="price-row savings">
                      <span>You Save</span>
                      <span>-₹{savings.toFixed(2)}</span>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="price-row promo-discount">
                      <span>Promo Discount ({appliedPromo.code})</span>
                      <span>-₹{promoDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="price-row">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-success" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <hr />

                  <div className="price-row total">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="checkout-btn" onClick={handleCheckout}>
                  <FaCreditCard className="me-2" />
                  Proceed to Checkout
                </button>

                {/* Delivery Address */}
                {/* <div className="delivery-address">
                  <div className="address-header">
                    <FaMapMarkerAlt className="me-2 text-danger" />
                    <span>Deliver to</span>
                  </div>
                  <div className="address-details">
                    <strong>John Doe</strong>
                    <p>123 Main Street, Mumbai, Maharashtra - 400001</p>
                  </div>
                  <button className="btn btn-link btn-sm">Change Address</button>
                </div> */}

                <div className="delivery-address">
                  <div className="address-header">
                    <FaMapMarkerAlt className="me-2 text-danger" />
                    <span>Deliver to</span>
                  </div>
                  {defaultAddress ? (
                    <div className="address-details">
                      <strong>{defaultAddress.full_name}</strong>
                      <p>
                        {defaultAddress.address_line1}, {defaultAddress.address_line2 && `${defaultAddress.address_line2}, `}
                        {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postal_code}, {defaultAddress.country}
                      </p>
                      <p><strong>Phone:</strong> {defaultAddress.phone_number}</p>
                    </div>
                  ) : (
                    <div className="address-details">
                      <p className="text-muted">No default address set</p>
                    </div>
                  )}
                  <button onClick={() => navigate('/address')} className="btn btn-link btn-sm">Change Address</button>
                </div>


                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-item">
                    <FaShieldAlt className="trust-icon" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="trust-item">
                    <FaTruck className="trust-icon" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="trust-item">
                    <FaUndo className="trust-icon" />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="empty-cart">
            <div className="empty-cart-content">
              <div className="empty-cart-icon">
                <FaShoppingCart />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <button className="btn btn-danger btn-lg" onClick={() => navigate("/productspage")}>
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
