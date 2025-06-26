// import React from 'react'

// const LoginPage = () => {
//     return (
//         <>
//             <section className="hero">

//             </section>
//         </>
//     )
// }

// export default LoginPage

import React, { useState } from 'react';
import { FaGoogle, FaShoppingBasket } from 'react-icons/fa';
import '../Style/Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const [email,setEmail]=useState(null)
    const [password,setPassword]=useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:8000/api/users/login/',{
                email,
                password
            });

            if(res.status===200){
                console.log(res.data)
                localStorage.setItem('access_token',res.data.access_token)
                localStorage.setItem('refresh_token',res.data.refresh_token)
                navigate('/home')
            }
        }catch(error){
            console.error('Login failed:', error.response?.data || error.message);
        }
    }

    return (
        <>
            <section className="login" >
                <div className="container ">
                    <div className="row justify-content-center">
                        <div className=" col-md-6 col-lg-5">
                            <div className="shadow-lg login-glass" >
                                <div className="card-body p-5 login-glass">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email address</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                placeholder="Enter your email"
                                                onChange={(e)=>{setEmail(e.target.value)}}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                id="password" 
                                                placeholder="Enter your password"
                                                onChange={(e)=>{setPassword(e.target.value)}}
                                                required
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="remember" />
                                                <label className="form-check-label" htmlFor="remember">
                                                    Remember me
                                                </label>
                                            </div>
                                            <a href="#forgot-password" >Forgot password?</a>
                                        </div>
                                        <button type="submit" className="btn btn-outline-dark w-100 py-2" >
                                            Sign in
                                        </button>
                                    </form>
                                    <br></br>

                                    <button className="btn btn-outline-danger w-100 py-2 mb-3" >
                                        <FaGoogle className="me-2" />
                                        Sign in with Google
                                    </button>

                                    <div className="text-center mt-4">
                                        <p className="text-muted">Don't have an account? <a href="#signup" >Sign up</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


export default LoginPage;