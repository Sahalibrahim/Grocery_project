"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaUser,
  FaList,
  FaTh,
} from "react-icons/fa"
import "../Style/ProductsPage.css"
import axiosInstance from "../Utils/AxiosInstance"

const ProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Apples",
      category: "Fruits",
      price: 120,
      discount_price: 100,
      stock: 50,
      description: "Fresh organic apples from Kashmir",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.5,
      reviews: 128,
      seller: "Fresh Fruits Co.",
      is_featured: true,
    },
    {
      id: 2,
      name: "Brown Rice",
      category: "Grains",
      price: 80,
      discount_price: null,
      stock: 25,
      description: "Premium quality brown rice",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.2,
      reviews: 89,
      seller: "Grain Masters",
      is_featured: false,
    },
    {
      id: 3,
      name: "Extra Virgin Olive Oil",
      category: "Oils",
      price: 450,
      discount_price: 400,
      stock: 15,
      description: "Premium extra virgin olive oil",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.8,
      reviews: 256,
      seller: "Oil Express",
      is_featured: true,
    },
    {
      id: 4,
      name: "Fresh Spinach",
      category: "Vegetables",
      price: 30,
      discount_price: 25,
      stock: 100,
      description: "Fresh green spinach leaves",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.3,
      reviews: 67,
      seller: "Green Veggies",
      is_featured: false,
    },
    {
      id: 5,
      name: "Whole Wheat Bread",
      category: "Bakery",
      price: 45,
      discount_price: null,
      stock: 30,
      description: "Fresh whole wheat bread",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.1,
      reviews: 45,
      seller: "Daily Bread",
      is_featured: false,
    },
    {
      id: 6,
      name: "Greek Yogurt",
      category: "Dairy",
      price: 85,
      discount_price: 75,
      stock: 40,
      description: "Creamy Greek yogurt",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.6,
      reviews: 134,
      seller: "Dairy Fresh",
      is_featured: true,
    },
    {
      id: 7,
      name: "Almonds",
      category: "Nuts",
      price: 600,
      discount_price: 550,
      stock: 20,
      description: "Premium California almonds",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.7,
      reviews: 198,
      seller: "Nuts & More",
      is_featured: false,
    },
    {
      id: 8,
      name: "Green Tea",
      category: "Beverages",
      price: 150,
      discount_price: null,
      stock: 60,
      description: "Organic green tea leaves",
      image: "/placeholder.svg?height=250&width=250",
      rating: 4.4,
      reviews: 87,
      seller: "Tea Garden",
      is_featured: false,
    },
  ])

  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const navigate = useNavigate()

  const categories = [
    "Fruits",
    "Vegetables",
    "Grains",
    "Dairy",
    "Oils",
    "Spices",
    "Beverages",
    "Snacks",
    "Bakery",
    "Nuts",
  ]

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, sortOrder])

  useEffect(()=>{
    const fetch_all_products = async () => {
        try{
            const res = await axiosInstance.get('http://localhost:8000/api/products/all_products/',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('access_token')}`
                }
            })
            if(res.status===200){
                setProducts(res.data)
                console.log(res.data)
            }
        }catch(error){
            console.log(error)
        }
    }
    fetch_all_products()
  },[])

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Price range filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((product) => {
        const price = product.discount_price || product.price
        const min = priceRange.min ? Number.parseFloat(priceRange.min) : 0
        const max = priceRange.max ? Number.parseFloat(priceRange.max) : Number.POSITIVE_INFINITY
        return price >= min && price <= max
      })
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "price":
          aValue = a.discount_price || a.price
          bValue = b.discount_price || b.price
          break
        case "rating":
          aValue = a.rating
          bValue = b.rating
          break
        case "name":
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const toggleWishlist = (productId) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setPriceRange({ min: "", max: "" })
    setSortBy("name")
    setSortOrder("asc")
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />)
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-warning opacity-50" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-muted" />)
    }

    return stars
  }

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

  const ProductCard = ({ product }) => (
    <div className="col">
      <div className="card product-card h-100">
        {/* Image Section */}
        <div className="product-image-container">
          <img src={`http://localhost:8000${product.image}`} className="product-image" alt={product.name} />

          {/* Badges */}
          <div className="product-badges">
            {product.is_featured && <span className="badge badge-featured">Featured</span>}
            {product.discount_price && (
              <span className="badge badge-discount">
                {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            className={`wishlist-btn ${wishlist.includes(product.id) ? "active" : ""}`}
            onClick={() => toggleWishlist(product.id)}
            title={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wishlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <div className="product-category">{product.category_name}</div>
          <h6 className="product-title">{product.name}</h6>

          {/* Rating */}
          {/* <div className="product-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="rating-count">({product.reviews})</span>
          </div> */}

          {/* Price */}
          <div className="product-price">
            {product.discount_price ? (
              <>
                <span className="price-original">₹{product.price}</span>
                <span className="price-discounted">₹{product.discount_price}</span>
              </>
            ) : (
              <span className="price-current">₹{product.price}</span>
            )}
          </div>

          {/* Stock & Seller */}
          <div className="product-meta">
            <span className={`stock-status ${product.quantity > 0 ? "in-stock" : "out-of-stock"}`}>
              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
            </span>
            <span className="seller-name">by {product.seller_name}</span>
          </div>

          {/* Add to Cart Button */}
          <button className="add-to-cart-btn" onClick={() => addToCart(product)} disabled={product.quantity === 0}>
            <FaShoppingCart className="cart-icon" />
            {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )

  const ProductListItem = ({ product }) => (
    <div className="card product-list-item mb-3">
      <div className="row g-0">
        <div className="col-md-3">
          <div className="position-relative">
            <img
              src={`http://localhost:8000${product.image}`}
              className="img-fluid rounded-start"
              alt={product.name}
              style={{ height: "150px", width: "100%", objectFit: "cover" }}
            />
            {product.is_featured && (
              <div className="position-absolute top-0 start-0 m-2">
                <span className="badge bg-warning text-dark">Featured</span>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-9">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h5 className="card-title">{product.name}</h5>
                <p className="text-muted small mb-2">{product.category_name}</p>
                {/* <div className="d-flex align-items-center mb-2">
                  <div className="me-2">{renderStars(product.rating)}</div>
                  <small className="text-muted">({product.reviews} reviews)</small>
                </div> */}
                <p className="card-text">{product.description}</p>
                <small className="text-muted">Sold by: {product.seller_name}</small>
              </div>
              <div className="col-md-4 text-end">
                <div className="mb-2">
                  {product.discount_price ? (
                    <>
                      <div className="text-decoration-line-through text-muted">₹{product.price}</div>
                      <div className="text-danger fw-bold fs-5">₹{product.discount_price}</div>
                      <small className="badge bg-danger">
                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                      </small>
                    </>
                  ) : (
                    <div className="fw-bold fs-5">₹{product.price}</div>
                  )}
                </div>
                <div className="mb-2">
                  <small className="text-muted">Stock: {product.quantity}</small>
                </div>
                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                  >
                    <FaShoppingCart className="me-2" />
                    {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    className={`btn btn-sm ${wishlist.includes(product.id) ? "btn-outline-danger" : "btn-outline-secondary"}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {wishlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="products-page">
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
              <a href="#" className="nav-link me-3 position-relative">
                <FaUser size={20} className="text-danger" />
              </a>
              <a href="#" className="nav-link position-relative">
                <FaShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="bg-light py-3">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-danger" type="button">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-secondary w-100 d-md-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          {/* Filters Sidebar */}
          <div className={`col-md-3 ${showFilters ? "d-block" : "d-none d-md-block"}`}>
            <div className="card filters-card">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaFilter className="me-2" />
                  Filters
                </h6>
              </div>
              <div className="card-body">
                {/* Category Filter */}
                <div className="mb-4">
                  <h6>Category</h6>
                  <select
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-4">
                  <h6>Price Range</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button className="btn btn-outline-danger btn-sm w-100" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="col-md-9">
            {/* Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <span className="text-muted me-3">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </span>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <select
                    className="form-select form-select-sm"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split("-")
                      setSortBy(sort)
                      setSortOrder(order)
                    }}
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating-desc">Rating (High to Low)</option>
                  </select>
                </div>
                <div className="btn-group" role="group">
                  <button
                    className={`btn btn-sm ${viewMode === "grid" ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <FaTh />
                  </button>
                  <button
                    className={`btn btn-sm ${viewMode === "list" ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {paginatedProducts.map((product) => (
                      <ProductListItem key={product.id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && renderPagination()}
              </>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3">
                  <FaSearch size={64} className="text-muted" />
                </div>
                <h4 className="text-muted">No products found</h4>
                <p className="text-muted">Try adjusting your search or filter criteria</p>
                <button className="btn btn-danger" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
