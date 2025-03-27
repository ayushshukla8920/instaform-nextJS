import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import MoonLoader from "react-spinners/MoonLoader";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

const LoginForm = () => {
    const [loader,setLoader] = useState("");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleLogin = async(e)=>{
        e.preventDefault();
        setLoader(true);
        try{
            const response = await axios.post(`/api/auth2/signup`,{
               name,email,password
            });
            if(response.data.msg == 'Signup Successful'){
                document.cookie = `token=${response.data.token}; Path=/; Secure; SameSite=None; Max-Age=${60 * 60 * 24 * 365 * 100};`;
                router.push('/');
            }
            if(response.data.error){
                toast.error(response.data.error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            }
        }
        catch(error){
            toast.error('Something went wrong !!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
        setLoader("");
    }
    return (
        <div className='flex flex-col items-center justify-center w-[30%] h-[85%] rounded-xl bg-white text-black'>
            <img src="icon.png" className='h-13 w-10 mb-3 mt-5' alt="" />
            <h1 className='text-3xl tracking-tight font-semibold mb-10 bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text'>Continue to instaform.ai</h1>
            <form action="" className='w-full flex items-center flex-col'>
                <input value = {name} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder='Enter your Full Name' className='w-[80%] h-11 mt-5 px-3 bg-[#EFEFEF] border-white border-[0.5px] rounded-md' />
                <input value = {email} onChange={(e)=>{setEmail(e.target.value)}} type="text" placeholder='Enter your Email Address' className='w-[80%] h-11 mt-5 px-3 bg-[#EFEFEF] border-white border-[0.5px] rounded-md' />
                <input value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder='Enter your Password' className='w-[80%] h-11 mt-5 px-3 bg-[#EFEFEF] border-white border-[0.5px] rounded-md' />
                {!loader && <button className='w-[80%] h-10 bg-gradient-to-bl from-[#B100A2] to-[#624AD7] mt-10 rounded-md text-white font-bold text-lg' onClick={handleLogin}>Create Account</button>}
                {loader && <button className='w-[80%] h-10 bg-gradient-to-bl from-[#B100A2] to-[#624AD7] mt-10 rounded-md text-white font-bold text-lg flex items-center justify-center' onClick={handleLogin}><MoonLoader size={20} color='white' className='font-bold' speedMultiplier={0.8} /></button>}
                <button onClick={() => {signIn("google")}} className='w-[80%] h-10 bg-[#EFEFEF] mt-5 rounded-md flex items-center justify-center font-semibold'><FcGoogle className='text-xl mr-5' />Continue With Google</button>
            </form>
            <h1 className='mt-5'>Already have an Account ? <a className='text-[#B100A2] hover:cursor-pointer hover:underline' onClick={()=>{router.push('/login');}}>Login</a></h1>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </div>
    )
}

export default LoginForm