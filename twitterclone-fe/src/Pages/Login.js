import React, { useState } from 'react';
import './Login.css'
import welcome from '../images/Welcomeback.png';
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../Config/config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const Login = () => {

    const [UserName, SetUserName] = useState("");
    const [Password, SetPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (e) => {
        try {
            setLoading(true)
            e.preventDefault()
            const data = await axios.post(`${API_BASE_URL}/auth/login`, {
                UserName: UserName,
                Password: Password
            })
               console.log(data.data.user)
            if (data.status === 200) {
                setLoading(false)
                localStorage.setItem("token", data.data.token)
                localStorage.setItem("user", JSON.stringify(data.data.user))
                dispatch({ type: 'LOGIN_SUCCESS', payload: data.data.user })
                navigate("/home")
                toast.success("User logged in successfully")
                SetUserName("")
                SetPassword("")
            }
        } catch (err) {
            setLoading(false)
            console.log(err)
            SetUserName("")
            SetPassword("")

            toast.error(err.response.data.msg)
        }
    }

    return (
        <div className="container login-container">
            <ToastContainer/>

            <div className="row">
                <div className="col-md-6 d-flex justify-content-end">
                    <img alt="social" className="welcome" src={welcome} />
                </div>
                <div className="col-md-6">
                    <div className="card shadow">
                        {loading ? <div className='col-md-12 mt-3 text-center'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div> : ''}
                        <div className="card-body px-5">
                            <h4 className="card-title text-center mt-3 fw-bold">Log In</h4>
                            <form onSubmit={(e) => login(e)}>
                                <input type="text" value={UserName} onChange={(e) => SetUserName(e.target.value)} className="p-2 mt-4 mb-2 form-control input-bg" placeholder='Username' />
                                <input type="password" value={Password} onChange={(e) => SetPassword(e.target.value)} className="p-2 mb-2 form-control input-bg" placeholder='Password' />
                                <div className='mt-3 d-grid'>
                                    <button type='submit' className="custom-btn custom-btn-blue">Log In</button>
                                </div>
                                <div className='my-4'>
                                    <hr className='text-muted' />
                                    <h5 className='text-muted text-center'>OR</h5>
                                    <hr className='text-muted' />
                                </div>
                                <div className='mt-3 mb-5 d-grid'>
                                    <button className="custom-btn custom-btn-white">
                                        <span className='text-muted fs-6'>Don't have an account?</span>
                                        <NavLink to="/register" className='ms-1 text-info fw-bold'>Register</NavLink>
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

export default Login;