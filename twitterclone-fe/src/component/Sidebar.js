import React from 'react';
import './Sidebar.css';

import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {

    const user = useSelector(state => state.user)
    const Navigate = useNavigate()
    const Dispatch = useDispatch()
    const ProfileUrl = `/Profile/${user.user._id}`

    const logout = async (e) => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        Dispatch({ type: "LOGIN_ERROR" })
        Navigate("/")
        toast.info("User logout Sucessfully")
    }

    return (

        <div className='col-2 sticky-top container sidebar'>
            {user ? <>
                <ToastContainer />
                <nav className='flex-column ' >
                    <ul>
                        <li>
                            <NavLink to='/home'><i className="fa-brands fa-twitter fa-2xl"></i></NavLink>
                        </li>
                        <li>
                            <NavLink to='/home' className="nav-item"><i className="fa-solid fa-house"></i> Home</NavLink>
                        </li>
                        <li>
                            <NavLink to={ProfileUrl} className="nav-item"><i className="fa-solid fa-user"></i> Profile</NavLink>
                        </li>
                        <li>
                            <a href="#" onClick={(e) => logout()}><i className="fa-solid fa-right-from-bracket"></i> Logout</a>
                            
                        </li>
                        <li>
                            {/* Profile Section at the end of the Navbar */}
                            <div className='d-flex profile-section'>
                                <img className="profile-pic ms-md-2" src={user.user.ProfilePic} />
                                <p className=' card-text fw-bold '>{user.user.Name}<h6>@{user.user.UserName}</h6></p>
                            </div>
                        </li>
                    </ul>
                </nav>
            </> : ''}

        </div>
    );
};

export default Sidebar;
