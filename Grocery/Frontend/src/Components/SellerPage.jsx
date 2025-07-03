"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaExclamationTriangle,
  FaSearch,
  FaBell,
  FaChartLine,
} from "react-icons/fa"
import "../Style/SellerPage.css"

const SellerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Apples",
      category: "Fruits",
      price: 120,
      discount_price: 100,
      stock: 0,
      description: "Fresh organic apples from Kashmir",
      image: "/placeholder.svg?height=200&width=200",
      status: "active",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      name: "Brown Rice",
      category: "Grains",
      price: 80,
      discount_price: null,
      stock: 25,
      description: "Premium quality brown rice",
      image: "/placeholder.svg?height=200&width=200",
      status: "active",
      created_at: "2024-01-10",
    },
    {
      id: 3,
      name: "Olive Oil",
      category: "Oils",
      price: 450,
      discount_price: 400,
      stock: 5,
      description: "Extra virgin olive oil",
      image: "/placeholder.svg?height=200&width=200",
      status: "active",
      created_at: "2024-01-08",
    },
  ])

  const [orders, setOrders] = useState([
    {
      id: 1,
      customer_name: "John Doe",
      customer_email: "john@example.com",
      products: [
        { name: "Organic Apples", quantity: 2, price: 100 },
        { name: "Brown Rice", quantity: 1, price: 80 },
      ],
      total_amount: 280,
      status: "pending",
      order_date: "2024-01-20",
      delivery_address: "123 Main St, Mumbai",
    },
    {
      id: 2,
      customer_name: "Jane Smith",
      customer_email: "jane@example.com",
      products: [{ name: "Olive Oil", quantity: 1, price: 400 }],
      total_amount: 400,
      status: "delivered",
      order_date: "2024-01-18",
      delivery_address: "456 Park Ave, Delhi",
    },
    {
      id: 3,
      customer_name: "Mike Johnson",
      customer_email: "mike@example.com",
      products: [{ name: "Brown Rice", quantity: 3, price: 80 }],
      total_amount: 240,
      status: "ordered",
      order_date: "2024-01-22",
      delivery_address: "789 Oak St, Bangalore",
    },
  ])

  const [showProductModal, setShowProductModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [notifications, setNotifications] = useState([])

  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    discount_price: "",
    stock: "",
    description: "",
    image: null,
    status: "active",
  })

  const navigate = useNavigate()

  const categories = ["Fruits", "Vegetables", "Grains", "Dairy", "Oils", "Spices", "Beverages", "Snacks"]

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("access_token")
    if (!token) {
      navigate("/login")
    }

    // Check for out of stock products
    checkLowStock()
  }, [navigate, products])

  const checkLowStock = () => {
    const outOfStock = products.filter((product) => product.stock === 0)
    const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5)

    const newNotifications = [
      ...outOfStock.map((product) => ({
        id: `out-${product.id}`,
        type: "danger",
        message: `${product.name} is out of stock!`,
        product_id: product.id,
      })),
      ...lowStock.map((product) => ({
        id: `low-${product.id}`,
        type: "warning",
        message: `${product.name} is running low (${product.stock} left)`,
        product_id: product.id,
      })),
    ]

    setNotifications(newNotifications)
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      category: "",
      price: "",
      discount_price: "",
      stock: "",
      description: "",
      image: null,
      status: "active",
    })
  }

  const handleProductInputChange = (e) => {
    const { name, value, type, files } = e.target
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }))
  }

  const handleAddProduct = () => {
    resetProductForm()
    setEditingProduct(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      stock: product.stock.toString(),
      description: product.description,
      image: null,
      status: product.status,
    })
    setShowProductModal(true)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((product) => product.id !== productId))
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const productData = {
        ...productForm,
        price: Number.parseFloat(productForm.price),
        discount_price: productForm.discount_price ? Number.parseFloat(productForm.discount_price) : null,
        stock: Number.parseInt(productForm.stock),
        image: productForm.image ? URL.createObjectURL(productForm.image) : "/placeholder.svg?height=200&width=200",
      }

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id
              ? { ...productData, id: product.id, created_at: product.created_at }
              : product,
          ),
        )
      } else {
        setProducts((prev) => [
          ...prev,
          { ...productData, id: Date.now(), created_at: new Date().toISOString().split("T")[0] },
        ])
      }

      setShowProductModal(false)
      resetProductForm()
      setEditingProduct(null)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStock = (productId, newStock) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, stock: Number.parseInt(newStock) } : product)),
    )
  }

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const dismissNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
  }

  // Filter and paginate products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Dashboard stats
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const outOfStockCount = products.filter((p) => p.stock === 0).length

  const ProductModal = () => {
    if (!showProductModal) return null

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingProduct ? "Edit Product" : "Add New Product"}</h5>
              <button type="button" className="btn-close" onClick={() => setShowProductModal(false)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleProductSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={productForm.category}
                      onChange={handleProductInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={productForm.price}
                      onChange={handleProductInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Discount Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="discount_price"
                      value={productForm.discount_price}
                      onChange={handleProductInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleProductInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={productForm.description}
                      onChange={handleProductInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Product Image</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={handleProductInputChange}
                      accept="image/*"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={productForm.status}
                      onChange={handleProductInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowProductModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {editingProduct ? "Updating..." : "Adding..."}
                      </>
                    ) : editingProduct ? (
                      "Update Product"
                    ) : (
                      "Add Product"
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

  const OrderModal = () => {
    if (!showOrderModal || !selectedOrder) return null

    return (
      <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details - #{selectedOrder.id}</h5>
              <button type="button" className="btn-close" onClick={() => setShowOrderModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <h6>Customer Information</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {selectedOrder.customer_name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {selectedOrder.customer_email}
                  </p>
                  <p className="mb-1">
                    <strong>Order Date:</strong> {selectedOrder.order_date}
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Delivery Information</h6>
                  <p className="mb-1">
                    <strong>Address:</strong> {selectedOrder.delivery_address}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>
                    <span className={`badge ms-2 bg-${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="col-12">
                  <h6>Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.products.map((product, index) => (
                          <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>₹{product.price}</td>
                            <td>₹{product.quantity * product.price}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan="3">Total Amount</th>
                          <th>₹{selectedOrder.total_amount}</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className="col-12">
                  <h6>Update Status</h6>
                  <div className="btn-group" role="group">
                    <button
                      className={`btn btn-outline-primary ${selectedOrder.status === "ordered" ? "active" : ""}`}
                      onClick={() => handleOrderStatusChange(selectedOrder.id, "ordered")}
                    >
                      Ordered
                    </button>
                    <button
                      className={`btn btn-outline-warning ${selectedOrder.status === "pending" ? "active" : ""}`}
                      onClick={() => handleOrderStatusChange(selectedOrder.id, "pending")}
                    >
                      Pending
                    </button>
                    <button
                      className={`btn btn-outline-success ${selectedOrder.status === "delivered" ? "active" : ""}`}
                      onClick={() => handleOrderStatusChange(selectedOrder.id, "delivered")}
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "ordered":
        return "primary"
      case "pending":
        return "warning"
      case "delivered":
        return "success"
      default:
        return "secondary"
    }
  }

  const renderPagination = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
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
    return pages
  }

  return (
    <div className="seller-page">
      {/* Header */}
      <div className="seller-header bg-white shadow-sm">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-secondary me-3 back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft />
              </button>
              <div>
                <h2 className="mb-0">Seller Dashboard</h2>
                <small className="text-muted">Manage your products and orders</small>
              </div>
            </div>
            <div className="d-flex align-items-center">
              {notifications.length > 0 && (
                <div className="dropdown me-3">
                  <button className="btn btn-outline-danger position-relative" type="button" data-bs-toggle="dropdown">
                    <FaBell />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notifications.length}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end notification-dropdown">
                    {notifications.map((notif) => (
                      <li key={notif.id} className={`dropdown-item-text alert alert-${notif.type} alert-sm mb-1`}>
                        <div className="d-flex justify-content-between align-items-start">
                          <small>{notif.message}</small>
                          <button
                            className="btn-close btn-close-sm"
                            onClick={() => dismissNotification(notif.id)}
                          ></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mt-3">
        <ul className="nav nav-tabs seller-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaChartLine className="me-2" />
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              <FaBox className="me-2" />
              Products
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <FaShoppingCart className="me-2" />
              Orders
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="container mt-4">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="row g-4">
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center">
                  <FaBox className="stat-icon text-primary mb-2" />
                  <h3 className="mb-1">{totalProducts}</h3>
                  <small className="text-muted">Total Products</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center">
                  <FaShoppingCart className="stat-icon text-success mb-2" />
                  <h3 className="mb-1">{totalOrders}</h3>
                  <small className="text-muted">Total Orders</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center">
                  <FaDollarSign className="stat-icon text-warning mb-2" />
                  <h3 className="mb-1">₹{totalRevenue}</h3>
                  <small className="text-muted">Total Revenue</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card stat-card">
                <div className="card-body text-center">
                  <FaExclamationTriangle className="stat-icon text-danger mb-2" />
                  <h3 className="mb-1">{outOfStockCount}</h3>
                  <small className="text-muted">Out of Stock</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <div className="input-group me-3" style={{ width: "300px" }}>
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="form-select me-3"
                  style={{ width: "200px" }}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-danger" onClick={handleAddProduct}>
                <FaPlus className="me-2" />
                Add Product
              </button>
            </div>

            <div className="row g-3">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <div className="card product-card h-100">
                    <div className="position-relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      {product.stock === 0 && (
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-danger">Out of Stock</span>
                        </div>
                      )}
                      {product.stock > 0 && product.stock <= 5 && (
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-warning">Low Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      <h6 className="card-title">{product.name}</h6>
                      <p className="text-muted small mb-2">{product.category}</p>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          {product.discount_price ? (
                            <>
                              <span className="text-decoration-line-through text-muted">₹{product.price}</span>
                              <span className="text-danger fw-bold ms-2">₹{product.discount_price}</span>
                            </>
                          ) : (
                            <span className="fw-bold">₹{product.price}</span>
                          )}
                        </div>
                        <span
                          className={`badge ${product.stock > 5 ? "bg-success" : product.stock > 0 ? "bg-warning" : "bg-danger"}`}
                        >
                          Stock: {product.stock}
                        </span>
                      </div>
                      <div className="mb-3">
                        <label className="form-label small">Update Stock:</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={product.stock}
                          onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="btn-group w-100" role="group">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditProduct(product)}>
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <div className="pagination-container">
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {renderPagination()}
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Orders</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          <div>
                            <div className="fw-semibold">{order.customer_name}</div>
                            <small className="text-muted">{order.customer_email}</small>
                          </div>
                        </td>
                        <td>{order.products.length} items</td>
                        <td className="fw-bold">₹{order.total_amount}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{order.order_date}</td>
                        <td>
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleViewOrder(order)}>
                            <FaEye className="me-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal />
      <OrderModal />
    </div>
  )
}

export default SellerPage
