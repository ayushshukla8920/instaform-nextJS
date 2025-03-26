"use client"
import Sidebar from '@/components/Sidebar';
import Splash from '@/components/Splash';
import { useEffect, useState } from 'react';
import { useGlobalContext } from "@/context/GlobalContext";
import Forms from '@/components/Forms';

const Page = () => {
  const {loading,setFadeOut,setLoading} = useGlobalContext();
  useEffect(() => {
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
