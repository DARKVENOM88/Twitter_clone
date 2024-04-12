import React, { useState } from 'react'
import './Login.css'
import join from '../images/joinus.png';
import axios from 'axios'
import { API_BASE_URL } from '../Config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink, useNavigate } from 'react-router-dom'


const Register = () => {

    const [FullName, SetFullName] = useState("");
    const [Email, SetEmail] = useState("");
    const [UserName, SetUserName] = useState("");
    const [Password, SetPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const requestData = {
        Name: FullName,
        UserName: UserName,
        Email: Email,
        Password: Password
    }
    const Navigate = useNavigate()

    const register = async (e) => {
        try {
            setLoading(true)
            e.preventDefault()
            const data = await axios.post(`${API_BASE_URL}/auth/register`, requestData)
            console.log(data)
            if (data.status === 201) {
                setLoading(false)
                toast.success("Registered sucessfully")
                Navigate("/")
            }
        } catch (err) {
            setLoading(false)
            toast.error(err.response.data.msg)
            console.log(err)
        }
    }
    return (
        <div className="container login-container">
            <ToastContainer />

            <div className="row">
                <div className="col-md-7 d-flex justify-content-end">
                    <img alt="social" className="join" src={join} />
                </div>
                <div className="col-md-5">
                    <div className="card shadow">
                        {loading ? <div className='col-md-12 mt-3 text-center'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div> : ''}
                        <div className="card-body px-5">
                            <h4 className="card-title text-center mt-3 fw-bold">Register</h4>
                            <form onSubmit={(e) => register(e)}>
                                <input type="text" value={FullName} onChange={(e) => SetFullName(e.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Full Name' />
                                <input type="email" value={Email} onChange={(e) => SetEmail(e.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Email' />
                                <input type="text" value={UserName} onChange={(e) => SetUserName(e.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Username' />
                                <input type="password" value={Password} onChange={(e) => SetPassword(e.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Password' />
                                <div className='mt-3 d-grid'>
                                    <button className="custom-btn custom-btn-blue" type='submit'>Register</button>
                                </div>
                                <div className='my-4'>
                                    <hr className='text-muted' />
                                    <h5 className='text-muted text-center'>OR</h5>
                                    <hr className='text-muted' />
                                </div>
                                <div className='mt-3 mb-5 d-grid'>
                                    <button className="custom-btn custom-btn-white">
                                        <span className='text-muted fs-6'>Already have an account?</span>
                                        <NavLink to="/" className='ms-1 text-info fw-bold'>Log In</NavLink>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;