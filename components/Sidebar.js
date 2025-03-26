"use client"
import React from 'react'
import { useGlobalContext } from "@/context/GlobalContext";
import { Moon, Sun } from "lucide-react";
import Link from 'next/link';
const Sidebar = (props) => {
  const {tabSelected}= props; 
  const {theme,setTheme,user} = useGlobalContext();
  const themeSetter = ()=>{
      if(theme == 'light'){
        setTheme('dark');
        localStorage.setItem('theme','dark');
      }
      else{
        setTheme('light');
        localStorage.setItem('theme','light');
      }
  }
  return (
    <div className={`flex justify-between flex-col min-h-screen w-[17%] fixed ${theme=='light'? 'bg-[#D8D8D8]' : 'bg-[#101010]'} py-5`}>
      <div>
        <div className='flex justify-center items-center mt-5'>
          <h1 className='text-3xl font-bold tracking-tighter bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text'>instaform.ai</h1>
        </div>
        <div className='mt-[10vh] flex flex-col gap-5 text-white text-3xl font-bold tracking-tighter ml-5'>
          {tabSelected==0 && <div className='rounded-l-2xl bg-gradient-to-bl from-[#B100A2] to-[#624AD7] h-[7vh] flex items-center justify-center'>
            <h1>Create</h1>
          </div>}
          {!(tabSelected==0) && <Link href='/' ><div className={`${theme=='light'? 'hover:bg-[#A0A0A0]' : 'hover:bg-[#242424]'} hover:cursor-pointer rounded-l-2xl ${theme=='light'? 'text-black' : 'text-white'} h-[7vh] flex items-center justify-center`}>
            <h1>Create</h1>
          </div></Link>}

          {tabSelected == 1 && <div className='rounded-l-2xl bg-gradient-to-bl from-[#B100A2] to-[#624AD7] h-[7vh] flex items-center justify-center'>
            <h1>My Forms</h1>
          </div>}
          {!(tabSelected == 1) && <Link href='/forms'><div className={`${theme=='light'? 'hover:bg-[#A0A0A0]' : 'hover:bg-[#242424]'} hover:cursor-pointer rounded-l-2xl ${theme=='light'? 'text-black' : 'text-white'} h-[7vh] flex items-center justify-center`}>
            <h1>My Forms</h1>
          </div></Link>}
        </div>
      </div>
      <div className='flex flex-col justify-center items-center gap-5'>
        <div className='flex items-center justify-center'>
          <button className='flex items-center justify-center gap-3 hover:cursor-pointer'>
            <h1 className={`font-bold text-xl tracking-tight ${theme=='light'? 'text-black' : 'text-white'}`}>{user.name}</h1>
          </button>
        </div>
        <div className='flex items-center justify-between gap-10'>
          <button className='text-xl font-bold tracking-tighter bg-red-500 rounded-md w-[15vh] h-8'>Logout</button>
          <button onClick={themeSetter}>
            {theme == 'light' ? <Sun className={`left-1 w-6 h-6 ml-1 ${theme == 'light' ? 'text-black' : 'text-white'}`} />:<Moon className={`left-1 w-6 h-6 ml-1 ${theme == 'dark' ? 'text-white' : 'text-black'}`} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar