"use client";
import { useEffect } from "react";
import Create from "@/components/Create";
import Sidebar from "@/components/Sidebar";
import { useGlobalContext } from "@/context/GlobalContext";
import Splash from "@/components/Splash";

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
        <div className='bg-black text-white text-3xl font-semibold w-full h-screen flex flex-col'>
          <Sidebar tabSelected={0}/> 
          <Create />
        </div>
      )}
    </>
  );
};

export default Page;
