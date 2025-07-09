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
  FaCheck
} from "react-icons/fa"
import "../Style/ProductsPage.css"
import axiosInstance from "../Utils/AxiosInstance"
import { toast } from 'react-toastify';

const ProductsPage = () => {
  // const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState([])
  const [totalPages, setTotalPages] = useState(1)




  const navigate = useNavigate()


  useEffect(() => {
    const fetch_all_products = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:8000/api/products/all_products/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          },
          params: {
            search: searchTerm,
            category: selectedCategory,
            min_price: priceRange.min,
            max_price: priceRange.max,
            sort_by: sortBy,
            sort_order: sortOrder,
            page: currentPage,
            limit: itemsPerPage,
          },
        })
        if (res.status === 200) {
          setFilteredProducts(res.data.results)
          setTotalPages(Math.ceil(res.data.count / itemsPerPage))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetch_all_products()
  }, [searchTerm, selectedCategory, priceRange, sortBy, sortOrder, currentPage])

  useEffect(() => {
    const fetch_category = async () => {
      try {
        const res = await axiosInstance.get('http://localhost:8000/api/products/list_category/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if (res.status === 200) {
          setCategories(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetch_category()
  }, [])


  const toggleWishlist = async (productId) => {
    try {
      const res = await axiosInstance.post(`http://localhost:8000/api/products/wishlist/${productId}/toggle/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      })
      if (res.status === 200) {
        setFilteredProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, is_wishlisted: res.data.wishlisted } : p
          )
        )
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  const addToCart = async (product) => {
    try {
      const res = await axiosInstance.post('http://localhost:8000/api/products/add_to_cart/', {
        'product_id': product.id,
        'quantity': 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (res.status === 200) {
        console.log("product added successfully to cart")
        toast.success("Product added to cart successfully ✅");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong ❌");
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setPriceRange({ min: "", max: "" })
    setSortBy("name")
    setSortOrder("asc")
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
          <img src={product.image} className="product-image" alt={product.name} />

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
            className={`wishlist-btn ${product.is_wishlisted ? "active" : ""}`}
            onClick={() => toggleWishlist(product.id)}
            title={product.is_wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {product.is_wishlisted ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <div className="product-category">{product.category_name}</div>
          <h6 className="product-title">{product.name}</h6>

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
              src={product.image}
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
                    className={`wishlist-btnn ${product.is_wishlisted ? "active" : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                    title={product.is_wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {product.is_wishlisted ? <FaHeart /> : <FaRegHeart />}
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
              <a onClick={() => navigate('/user_profile')} className="nav-link me-3 position-relative">
                <FaUser size={20} className="text-danger" />
              </a>
              <a onClick={()=>navigate('/cart')} className="nav-link position-relative">
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
                      <option key={category.id} value={category.id}>
                        {category.name}
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
                    {/* <option value="rating-desc">Rating (High to Low)</option> */}
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
            {filteredProducts.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {filteredProducts.map((product) => (
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
