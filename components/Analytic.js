"use client"
import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import { FaFileExcel } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import FadeLoader from "react-spinners/FadeLoader";
import { useParams } from 'next/navigation';
import { useGlobalContext } from '@/context/GlobalContext';
import { useRouter } from 'next/navigation';

const Analytic = () => {
  const { token,theme } = useGlobalContext();
  const [count,setCount] = useState(0);
  const [responses,setResponses] = useState('');
  const [loader,setLoader] = useState('');
  const {formNo} = useParams();
  const router = useRouter();
  const downloadCSV = async () => {
    setLoader(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/excel/download`, 
        { formNo, token }, 
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Responses_${formNo}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download Successful', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
      });
    } catch (error) {
      console.error('Error downloading CSV', error);
      toast.error('Error downloading File', {
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
    setLoader('');
  }
  const fetchForms = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/analytics/get/${formNo}`, { token });
      if(response.data.responses){
        setCount(response.data.responses.length);
        setResponses(response.data.responses);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);
  return (
    <div className={`ml-[17%] w-full min-h-screen flex flex-col px-10 ${theme == 'light' ? 'bg-[#EFEFEF]':'bg-[#191919] text-white'} pt-6 pb-[10vh]`}>
      <div className='flex justify-between items-center mt-5'>
        <button onClick={()=>{router.push('/forms')}} className='bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-white rounded-xl ml-5 h-10 w-10 flex items-center justify-center hover:cursor-pointer'><IoMdArrowRoundBack className='text-3xl' /></button>
        <h1 className='ml-5 text-3xl font-bold bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text'>Analytics for {formNo}</h1>
      </div>
      <br /><hr /><br />
      <div className='w-[100%] py-5 h-[10vh] flex items-center justify-between bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-white px-10 rounded-3xl'>
        <h1 className='text-xl tracking-tight font-bold'>Total number of Responses : </h1>
        <h1 className='text-5xl font-bold'>{count}</h1>
      </div>
      <div className='flex items-center justify-between mt-10 mb-5 pr-5'>
        <h1 className='text-3xl font-bold tracking-tight ml-10'>Responses</h1>
        {!loader && <button onClick={downloadCSV} className='flex items-center justify-center text-xl tracking-tighter font-bold bg-[#167C46] text-white px-4 py-2 rounded-2xl hover:cursor-pointer'><FaFileExcel className='text-2xl text-white mr-3'/>Download as Excel (.csv)</button>}
        {loader && <button onClick={downloadCSV} className='flex items-center justify-center text-xl tracking-tighter font-bold bg-[#167C46] text-white px-[4vw] rounded-2xl hover:cursor-pointer'><FadeLoader className='mr-3 mt-5' height={8} margin={-10} radius={-13} width={3} color='white' speedMultiplier={2}/> Downloading...</button>}
      </div>
      <div className="flex flex-col gap-3">
      {responses.length > 0 ? (
        responses.map((form, index) => (
          <div key={index} className={`${theme == 'light' ? 'bg-white':'bg-[#101010]'} shadow-md rounded-lg flex flex-col py-3 px-10 justify-between`}>
            {Object.entries(form).map(([key, value], idx) => (
              <h1 key={idx}><strong>{key}:</strong> {value}</h1>  // ✅ Prints "key: value"
            ))}
          </div>
        ))
      ) : (
        <p className="text-gray-500 ml-10 mt-5">No Responses available.</p>
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
  )
}

export default Analytic