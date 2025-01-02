import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { backendUrl, setToken, isLoggedIn, setisLoggedIn } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        
        if (isLoggedIn) {
            navigate("/"); 
        }
    }, [isLoggedIn, navigate]);  
    

    const onSubmitHandler = async (e) => {
        e.preventDefault();
    
        try {
            const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
    
            console.log("Response data:", data);  
    
            if (data.success) {
               
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);  
    
                
                setToken(data.token);
                setisLoggedIn(true); 
    
                console.log("After storing userId in localStorage:", localStorage.getItem('userId'));
    
               
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred');
        }
    };
    
    return (
        <div>
            <h1 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-800 whitespace-nowrap hidden sm:block">
                Login to Innovate, Create, Dominate
            </h1>

            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/5 flex justify-center items-center">
                <form onSubmit={onSubmitHandler} className="relative bg-white p-10 rounded-xl text-slate-500">
                    <h1 className="text-center text-2xl text-neutral-700 font-medium">{state}</h1>
                    <p className="text-sm">Welcome ! Please sign up or login in to continue</p>

                    {state !== 'Login' && (
                        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
                            <img src={assets.email_icon} alt="" />
                            <input onChange={e => setName(e.target.value)} value={name} className="outline-none text-sm" type="text" placeholder="Full Name" required />
                        </div>
                    )}

                    <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                        <img src={assets.email_icon} alt="" />
                        <input onChange={e => setEmail(e.target.value)} value={email} className="outline-none text-sm" type="email" placeholder="Email id" required />
                    </div>

                    <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setPassword(e.target.value)} value={password} className="outline-none text-sm" type="password" placeholder="Password" />
                    </div>

                    <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password?</p>

                    <button className="bg-blue-600 w-full text-white py-2 rounded-full">{state === 'Login' ? 'Login' : 'Create Account'}</button>

                    {state === 'Login' 
                        ? <p className="mt-5 text-center">Don't have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState('Sign Up')}>Sign up</span></p>
                        : <p className="mt-5 text-center">Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => setState('Login')}>Login</span></p>
                    }
                </form>
            </div>
        </div>
    );
};

export default SignUp;
