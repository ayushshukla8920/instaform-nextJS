"use client"
import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { TbCopy } from "react-icons/tb";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';

const Forms = () => {
  const { token,formData,setFormData,theme } = useGlobalContext();
  const router = useRouter();
  const fetchForms = async (setFormData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/forms`, { token });
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };
  const handleAnalytics = async(formNo)=>{
    router.push(`/forms/analytics/${formNo}`);
  }
  const handleDelete = async(formNo)=>{
    const isConfirmed = window.confirm("Are you sure you want to delete this form?");
    if (!isConfirmed) return;
    try {
      const deleteResponse = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/ai/delete/${formNo}`, {token});
      if(deleteResponse.data.msg){
        toast.success('Form Deleted Successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
      });
      fetchForms(setFormData);
      }
      if(deleteResponse.data.error){
        toast.error(deleteResponse.data.error, {
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
    } catch (error) {
      console.error("Error fetching forms:", error);
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
  }
  const copyToClipboard = (formurl) => {
    navigator.clipboard.writeText(formurl);
    toast.success('Copied to clipboard!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    });
  };

  useEffect(() => {
    fetchForms(setFormData);
  }, []);

  return (
    <div className={`ml-[17%] w-[83%] min-h-screen flex flex-col px-10 ${theme=='light' ? 'bg-[#EFEFEF]' : 'bg-[#191919]' } pt-10`}>
      <h1 className='ml-10 mt-5 text-5xl font-bold bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text'>
        Your Forms:
      </h1>
      <br /><hr /><br />
      <div className="flex flex-col gap-3">
        {formData.length > 0 ? (
          formData.map((form, index) => (
            <div key={index} className={`${theme=='light' ? 'bg-white text-black' : 'bg-[#101010] text-white' } shadow-md rounded-lg flex items-center gap-10 py-3 px-10 justify-between`}>
              <h2 className="text-xl font-semibold w-[20%]">{form.formName}</h2>
              <div className='flex items-center justify-center w-[50%]'>
                <p className="text-blue-500 text-lg">{`${process.env.NEXT_PUBLIC_URL}/api/ai/form/${form.formNo}`}</p>
                <TbCopy onClick={()=>{copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/api/ai/form/${form.formNo}`)}} className='ml-10 text-xl hover:cursor-pointer' />
                <a href={`${process.env.NEXT_PUBLIC_URL}/api/ai/form/${form.formNo}`} target='_blank'><HiMiniArrowTopRightOnSquare className='ml-3 text-xl hover:cursor-pointer' /></a>
              </div>
              <button onClick={()=>{handleAnalytics(form.formNo)}} className="hover:cursor-pointer px-4 py-2 bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-lg text-white rounded w-[20%]">
                Analytics
              </button>
              <button onClick={()=>{handleDelete(form.formNo)}} className="h-10 w-10 text-white rounded flex items-center justify-center hover:cursor-pointer">
                <MdDelete className='text-3xl text-red-500' />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No forms available.</p>
        )}
      </div>
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
  );
};

export default Forms;