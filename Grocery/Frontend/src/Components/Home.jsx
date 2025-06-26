import React from 'react';
import { FaSearch, FaUser, FaShoppingCart, FaMapMarkerAlt, FaBars, FaChevronDown, FaStar, FaRegClock, FaWhatsapp } from 'react-icons/fa';
import { BsGridFill, BsPercent, BsGift } from 'react-icons/bs';
import { IoIosArrowForward } from 'react-icons/io';
import { FaShoppingBasket, FaAppleAlt, FaBreadSlice, FaCookie, FaWineBottle, FaBroom } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
    return (
        <div className="jiomart-clone">
            {/* Top Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white  py-2">
                <div className="container">
                    <div className="d-flex align-items-center">
                        {/* <button className="navbar-toggler me-3" type="button">
                            <FaBars />
                        </button> */}
                        <a className="navbar-brand" href="#">
                            <img src="/assets/logo.svg" alt="Orgnic" height="30" />
                        </a>
                    </div>

                    <div className="d-flex align-items-center ms-auto">
                        {/* <div className="dropdown me-3">
                            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="locationDropdown">
                                <FaMapMarkerAlt className="me-1" />
                                <span>Mumbai, 400001</span>
                            </button>
                        </div> */}
                        <div className="d-flex">
                            <a onClick={()=>navigate('/user_details')} style={{cursor:"pointer"}} className="nav-link me-3"><FaUser size={20} /></a>
                            <a href="#" style={{cursor:"pointer"}} className="nav-link"><FaShoppingCart size={20} /></a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Search Bar */}
            <div className="bg-light py-2 ">
                <div className="container">
                    <div className="input-group">
                        <input type="text" className="form-control py-2" placeholder="Search for products..." />
                        <button className="btn btn-danger" type="button">
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Categories */}
            <div className="container my-3">
                <div className="row g-2">
                    {/* {['Groceries', 'Fruits & Vegetables', 'Dairy & Bakery', 'Snacks & Branded Foods', 'Beverages', 'Home Care'].map((category, index) => (
            <div className="col-4 col-md-2" key={index}>
              <div className="card border-0 text-center p-2 h-100">
                <div className="bg-light rounded-circle mx-auto mb-2" style={{ width: '50px', height: '50px' }}></div>
                <small className="text-dark">{category}</small>
              </div>
            </div>
          ))} */}
                    {[
                        { name: 'Groceries', icon: <FaShoppingBasket size={24} /> },
                        { name: 'Fruits & Vegetables', icon: <FaAppleAlt size={24} /> },
                        { name: 'Dairy & Bakery', icon: <FaBreadSlice size={24} /> },
                        { name: 'Snacks & Branded Foods', icon: <FaCookie size={24} /> },
                        { name: 'Beverages', icon: <FaWineBottle size={24} /> },
                        { name: 'Home Care', icon: <FaBroom size={24} /> }
                    ].map((category, index) => (
                        <div className="col-4 col-md-2" key={index}>
                            <div className="card border-0 text-center p-2 h-100">
                                <div className="text-danger mx-auto mb-2">
                                    {category.icon}
                                </div>
                                <small className="text-dark">{category.name}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banner Slider */}

                {/* Banner Slider */}
                <div className="container mb-4">
                    <div className="rounded" style={{ 
                        height: '150px', 
                        backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}></div>
                </div>

            {/* Deals of the Day */}
            <div className="container mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Deals of the Day</h5>
                    <a href="#" className="text-danger">View All</a>
                </div>
                <div className="row g-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div className="col-4 col-md-2" key={item}>
                            <div className="card border-0">
                                <div className="bg-light rounded" style={{ height: '100px' }}></div>
                                <div className="p-2">
                                    <small className="d-block text-truncate">Product Name {item}</small>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-succ fw-bold">₹{99 + item}</span>
                                        <small className="text-decoration-line-through text-muted">₹{149 + item}</small>
                                    </div>
                                    <small className="text-success d-block">{30 + item}% off</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className="bg-light py-4 mb-4">
                <div className="container">
                    <h5 className="mb-3">Shop by Category</h5>
                    <div className="row g-3">
                        {[
                            { name: 'Fruits & Vegetables', icon: <BsGridFill /> },
                            { name: 'Dairy & Breakfast', icon: <BsGridFill /> },
                            { name: 'Snacks & Branded Foods', icon: <BsGridFill /> },
                            { name: 'Beverages', icon: <BsGridFill /> },
                            { name: 'Home & Kitchen', icon: <BsGridFill /> },
                            { name: 'Beauty & Hygiene', icon: <BsGridFill /> },
                        ].map((category, index) => (
                            <div className="col-6 col-md-4 col-lg-2" key={index}>
                                <div className="card border-0 bg-white p-3 text-center">
                                    <div className="mb-2 text-danger">{category.icon}</div>
                                    <small>{category.name}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* More Sections */}
            <div className="container mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Top Offers</h5>
                    <a href="#" className="text-danger">View All</a>
                </div>
                <div className="row g-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div className="col-6 col-md-3" key={item}>
                            <div className="card border-0">
                                <div className="bg-light rounded" style={{ height: '120px' }}></div>
                                <div className="p-2">
                                    <small className="d-block text-truncate">Special Offer {item}</small>
                                    <small className="text-success d-block">{40 + item}% off</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <h6>JioMart</h6>
                            <ul className="list-unstyled small">
                                <li><a href="#" className="text-white-50">About Us</a></li>
                                <li><a href="#" className="text-white-50">Terms of Use</a></li>
                                <li><a href="#" className="text-white-50">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-3">
                            <h6>Help</h6>
                            <ul className="list-unstyled small">
                                <li><a href="#" className="text-white-50">FAQs</a></li>
                                <li><a href="#" className="text-white-50">Contact Us</a></li>
                                <li><a href="#" className="text-white-50">Shipping Policy</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-3">
                            <h6>Download App</h6>
                            <div className="d-flex mb-2">
                                <div className="bg-secondary rounded me-2" style={{ width: '100px', height: '30px' }}></div>
                                <div className="bg-secondary rounded" style={{ width: '100px', height: '30px' }}></div>
                            </div>
                            <h6>Connect with us</h6>
                            <div>
                                <FaWhatsapp size={20} className="me-2" />
                                {/* Other social icons would go here */}
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <h6>Registered Office Address</h6>
                            <p className="small text-white-50">
                                JioMart, Navi Mumbai, Maharashtra - 400701
                            </p>
                        </div>
                    </div>
                    <div className="border-top pt-3 mt-3 text-center small text-white-50">
                        © 2023 JioMart. All Rights Reserved.
                    </div>
                </div>
            </footer>

            {/* WhatsApp Float */}
            <div className="position-fixed bottom-0 end-0 p-3">
                <div className="bg-success rounded-circle p-3 shadow">
                    <FaWhatsapp size={24} className="text-white" />
                </div>
            </div>

            {/* CSS Styles */}
            <style jsx>{`
        .jiomart-clone {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .text-succ {
          color : rgb(8, 8, 8) !important;
        }
        .text-danger {
          color:rgb(228, 0, 70) !important;
        }
        .btn-danger {
          background-color: #e40046;
          border-color: #e40046;
        }
        .navbar-brand img {
          height: 30px;
        }
        .input-group .form-control:focus {
          border-color: #e40046;
          box-shadow: none;
        }
      `}</style>
        </div>
    );
};

export default Home;