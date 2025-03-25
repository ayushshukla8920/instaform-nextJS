"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import SignupForm from '@/components/SignupForm';

const Login = () => {
  const router = useRouter();
  useEffect(() => {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];
      if (token) {
        router.push("/");
      }
  }, []);
  return (
    <div className='flex w-full h-screen bg-[#EFEFEF] items-center justify-center'>
      <SignupForm />
    </div>
  )
}

export default Login