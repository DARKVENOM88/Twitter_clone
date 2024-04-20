import './App.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import Tweetdetails from './Pages/tweetdetails';
import Profile from './Pages/Profile';

import Sidebar from './component/Sidebar';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

function App() {

  const Dynamiroute = () => {
    const Navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
      if (token) {
        Navigate("/home");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Navigate("/");
      }
    }, [Navigate, token]); // Include Navigate and token in the dependency array

    return (
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/TweetDetails/:tweetId' element={<Tweetdetails />} />
        <Route path='/Profile/:UserId' element={<Profile />} />
        <Route path='/sidebar' element={<Sidebar />} />
      </Routes>
    );
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Dynamiroute />
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
