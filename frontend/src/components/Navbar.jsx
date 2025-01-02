import React, { useEffect, useState } from 'react'
import logo from "../images/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { BsGridFill } from "react-icons/bs";
import { backendUrl } from '../context/AppContext';
import axios from 'axios'; 

const Navbar = ({ isGridLayout, setIsGridLayout }) => {

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/getUserDetails`,
          { userId: localStorage.getItem("userId") },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
          setData(response.data.user);
          console.log("User details fetched successfully:", response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      }
    };

    fetchUserDetails();
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  }

  const toggleLayout = () => {
    setIsGridLayout(prevState => !prevState);
  };

  return (
    <>
      <div className="navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
        <div className="logo">
          <img className='w-[190px]  rounded-full border border-gray-300 ' src={logo} alt="" />
        </div>
        <div className="links flex items-center gap-10">
          {/* Layout toggle button */}
          <i
            onClick={toggleLayout}
            className='flex items-center gap-1 mt-3 mb-2 cursor-pointer'
            style={{ fontStyle: "normal" }}
          >
            <BsGridFill className='text-[20px]' /> {isGridLayout ? 'List Layout' : 'Grid Layout'}
          </i>

          {/* Logout button */}
          <button onClick={logout} className='btnBlue !bg-red-500 min-w-[120px] ml-2 hover:!bg-red-600'>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar;
