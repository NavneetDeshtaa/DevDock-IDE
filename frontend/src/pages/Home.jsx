import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import ListCard from '../components/ListCard';
import GridCard from '../components/GridCard';
import { backendUrl, AppContext } from '../context/AppContext';  
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const { setIsLoggedIn, isLoggedIn } = useContext(AppContext);  
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [projTitle, setProjTitle] = useState("");
  const navigate = useNavigate();
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [isGridLayout, setIsGridLayout] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState("");
  const [userLoading, setUserLoading] = useState(true); 

  const createProj = async (e) => {
    e.preventDefault();

    if (projTitle === "") {
      alert("Please Enter Project Title");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/createProject`, 
        {
          title: projTitle,
          userId: userId
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsCreateModelShow(false);
        setProjTitle("");
        alert("Project Created Successfully");
        navigate(`/editor/${response.data.projectId}`);
      } else {
        alert("Something Went Wrong");
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message || "Server Error"));
    }
  };

  const getProj = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/user/getProjects", {
        userId: localStorage.getItem("userId")
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.success) {
        setData(data.projects);
      } else {
        setData([]); 
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("An error occurred while fetching projects.");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getProj();
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log("Logged in userId:", userId);  
  
        if (!userId) {
          setUserError("User not logged in.");
          return;
        }
  
        const response = await axios.post(`${backendUrl}/api/user/getUserDetails`, {
          userId
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        console.log("User data response:", response.data); 
        const data = response.data;
  
        if (data.success) {
          setUserData(data.user);
          console.log("User details:", data.user);  
        } else {
          setUserError(data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserError("An error occurred while fetching user details.");
      } finally {
        setUserLoading(false);
      }
    };
  
    getUserDetails();
  }, []);
  

  const handleProjectClick = (projectId) => {
    navigate(`/editor/${projectId}`);
  };

  return (
    <>
      <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />

      <div className='flex items-center justify-between px-4 md:px-8 lg:px-20 my-4 md:my-8'>
        <h2 className='text-2xl text-black'>
          {userLoading ? "Loading..." : `Hi, ${userData ? userData.name : "User"} 👋`}
        </h2>
        <div className='flex items-center gap-2'>
          <div className="inputBox w-full md:w-[350px]">
            <input type="text" placeholder='Search Here... !' className='p-2 w-full rounded-md' />
          </div>
          <button onClick={() => { setIsCreateModelShow(true) }} className='btnBlue rounded-[5px] mb-4 text-[20px] py-2 px-4'>
            +
          </button>
        </div>
      </div>

      {/* Project Display */}
      <div className="cards">
        {loading ? (
          <p>Loading projects...</p> 
        ) : (
          <>
            {
              isGridLayout ? 
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8 lg:px-20'>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <GridCard key={index} item={item} onClick={() => handleProjectClick(item._id)} />
                    ))
                  ) : (
                    <p className='text-4xl text-center text-black font-semibold mt-20'>No projects found</p>
                  )}
                </div>
                : 
                <div className='list px-4 md:px-8 lg:px-20'>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <ListCard key={index} item={item} onClick={() => handleProjectClick(item._id)} />
                    ))
                  ) : (
                    <p className='text-4xl text-center text-black font-semibold mt-20'>No projects found</p>
                  )}
                </div>
            }
          </>
        )}
      </div>

      {/* Create New Project Modal */}
      {isCreateModelShow && (
        <div className="createModelCon fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-[rgb(0,0,0,0.1)] flex items-center justify-center">
          <div className="createModel w-[80%] sm:w-[60%] md:w-[40%] lg:w-[25vw] h-[27vh] shadow-lg shadow-black/50 bg-[#141414] rounded-[10px] p-[20px]">
            <h3 className='text-2xl'>Create New Project</h3>
            <div className="inputBox !bg-[#202020] mt-4">
              <input
                onChange={(e) => { setProjTitle(e.target.value) }}
                value={projTitle}
                type="text"
                placeholder='Project Title'
                className="w-full p-2 rounded-md"
              />
            </div>
            <div className='flex items-center gap-2 w-full mt-4'>
              <button onClick={createProj} className='btnBlue rounded-[5px] w-[49%] mb-4 py-2 px-4'>Create</button>
              <button onClick={() => { setIsCreateModelShow(false) }} className='btnBlue !bg-[#1A1919] rounded-[5px] mb-4 w-[49%] py-2 px-4'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
