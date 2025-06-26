import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserDetails = () => {
    const navigate = useNavigate()
    

    const handleLogout = async()=>{
        const res = await axios.get('http://localhost:8000/api/users/logout/',{
            headers:{
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        if(res.status===200){
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            navigate('/login')
        }
    }
  return (
    <button onClick={handleLogout} >Logout</button>
  )
}

export default UserDetails