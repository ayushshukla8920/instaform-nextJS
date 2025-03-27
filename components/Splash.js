"use client"
import { useGlobalContext } from '@/context/GlobalContext';
import React from 'react'

const Splash = (props) => {
  const {fadeOut,theme} = useGlobalContext();
  return (
    <div className={`fixed inset-0 flex flex-col items-center pt-[20vh] ${theme=='light'? 'bg-[#EFEFEF]' : 'bg-black'} z-50 transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
        <div className="text-5xl font-bold text-white flex flex-col justify-center items-center">
            <img src="/icon.png" alt="" className='h-[11vh] w-[8vh] mb-[2vh]' />
            <h1 className='bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text mb-[2vh]'>instaform.ai</h1>
        </div>
        <div className={`relative w-[15vw] h-[4px] border-[0.5px] border-black mt-1 overflow-hidden rounded`}>
            <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-bl from-[#B100A2] to-[#624AD7] animate-slide"></div>
        </div>
    </div>
  )
}

export default Splash