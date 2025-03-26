"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Create from "@/components/Create";
import Sidebar from "@/components/Sidebar";
import { useGlobalContext } from "@/context/GlobalContext";
import Splash from "@/components/Splash";

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
        <div className='bg-black text-white text-3xl font-semibold w-full h-screen flex flex-col'>
          <Sidebar tabSelected={0}/> 
          <Create />
        </div>
      )}
    </>
  );
};

export default Page;
