import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AppContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setIsLoggedIn(false);
      navigate("/signup");
    } else {
      setIsLoggedIn(true);
    }
  }, [token, navigate]);

  const value = {
    token,
    setToken: (newToken) => {
      if (newToken) {
        localStorage.setItem("token", newToken);
        setIsLoggedIn(true);  
        setToken(newToken);
      } else {
        localStorage.removeItem("token");
        setIsLoggedIn(false);  
        setToken(null);
      }
    },
    isLoggedIn,
    setIsLoggedIn, 
    backendUrl
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
