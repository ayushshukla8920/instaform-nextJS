"use client"
import Sidebar from '@/components/Sidebar';
import Splash from '@/components/Splash';
import { useEffect, useState } from 'react';
import { useGlobalContext } from "@/context/GlobalContext";
import Forms from '@/components/Forms';

const Page = () => {
  const {loading,setFadeOut,setLoading} = useGlobalContext();
  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!cookieToken) {
      window.location.href = '/login';
    }

    setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setLoading(false), 500);
    }, 2000);
  }, []);
  return (
    <>
      {loading ? (<Splash />) :
        (
        <div className='bg-black text-white text-3xl font-semibold w-full min-h-screen'>
          <Sidebar tabSelected={1}/> 
          <Forms />
        </div>
      )}
    </>
  )
}

export default Page
