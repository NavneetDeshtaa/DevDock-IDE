import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css"
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import SignUp from './pages/SignUp';
import CodeEditor from './pages/Editor';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from './context/AppContext';

const App = () => {
  
   const { isLoggedIn} = useContext(AppContext)

  return (
    <>
      <ToastContainer position='bottom-right' />
        <Routes>
          <Route path='/' element={isLoggedIn ? <Home /> : <Navigate to="/signup"/>} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/editor/:projectID' element={isLoggedIn ? <CodeEditor /> : <Navigate to="/singup"/>} />
          <Route path="*" element={isLoggedIn ? <NoPage />: <Navigate to="/signup"/>} />
        </Routes>
    </>
  )
}

export default App