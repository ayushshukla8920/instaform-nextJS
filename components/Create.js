"use client"
import React, { useEffect, useState } from 'react'
import { MdOutlineContactPage } from "react-icons/md";
import { MdOutlineFeedback } from "react-icons/md";
import { FaQuestion,FaRegUser,FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";
import FadeLoader from "react-spinners/FadeLoader";
import { TbCopy } from "react-icons/tb";
import { useGlobalContext } from '@/context/GlobalContext';

const Create = () => {
    const {user,token,theme} = useGlobalContext();
    const [prompt,setPrompt] = useState('');
    const [loader,setLoader] = useState("");
    const [promptlength,setPromptLength] = useState(0);
    const [formUrl, setFormUrl] = useState(null)
    useEffect(() => {
        setPromptLength(prompt.length);
    }, [prompt]);
    
    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('text');
        if (pastedData.length + prompt.length > 10000) {
          e.preventDefault();
          const remainingChars = 10000 - prompt.length;
          setPrompt(prompt + pastedData.slice(0, remainingChars));
        }
    };

    const commonPrompts = (n) => {

      const prompt1 = `Generate a responsive Contact Form with fields for Full Name, Email Address, Phone Number, and Message. The form should have proper validation to ensure all required fields are filled and that the email and phone number formats are correct. Include a submit button with a visually appealing design.`;
      
      const prompt2 = `Create a user-friendly feedback form that allows users to share their opinions and suggestions. The form should include fields for the user's name (optional), a rating system (e.g., 1 to 5 stars or a satisfaction scale), a text area for detailed feedback, and a dropdown to categorize the feedback type (e.g., Product, Service, Support, Other). Include a submit button and ensure the form is visually appealing and accessible.`;

      const prompt3 = `Create an Inquiry Form that collects user details and their inquiry. The form should include fields for Full Name, Email Address, Phone Number (optional), Subject of Inquiry, and a Detailed Message. Ensure the form has a clean and user-friendly design with proper validation for required fields.`;

      const prompt4 = `Generate a simple Basic Information Form that collects essential personal details. The form should include the following fields:

      Full Name (Text Input) - Required
      Email Address (Email Input) - Required
      Phone Number (Number Input) - Required
      Date of Birth (Date Picker) - Required
      Gender (Dropdown: Male, Female, Other) - Optional
      Address (Multiline Text Area) - Optional

      The form should be clean, user-friendly, and responsive. Include basic validation for required fields and ensure proper formatting for email and phone number inputs. At the bottom, provide a Submit button to send the form data. Ensure accessibility and a simple design for easy usability.`;

      if(n==1){
        setPrompt(prompt1);
      }
      if(n==2){
        setPrompt(prompt2);
      }
      if(n==3){
        setPrompt(prompt3);
      }
      if( n==4){
        setPrompt(prompt4);
      }
    }
    const copyToClipboard = () => {
      navigator.clipboard.writeText(formUrl);
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

    const handleSubmit = async(e) => {
      e.preventDefault();
      setLoader('true');
      try{
        const response = await fetch('/api/ai/generate-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, token }),
        });
        const data = await response.json(); 
        console.log(data);         
        if(data.msg == 'Success'){
          setFormUrl(`https://instaform.vercel.app/api/ai/form/${data.formNo}`);
          setPrompt('');
        }
        if(data.error){
          toast.error(data.error, {
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
        console.error(error);
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
      setLoader('');
    }

  return (
    <div className={`ml-[17%] w-[83%] min-h-screen flex flex-col justify-center items-center ${theme == 'light' ? 'bg-[#EFEFEF]':'bg-[#191919]'} pt-10`}>
        <div className={`flex flex-col w-[60vw] ${formUrl ? 'blur-sm' : ''}`}>
            <h1 className="bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text text-5xl font-bold">Hi there, {user.name} <br /> What would you like to create today ?</h1>
            <h1 className='text-xl text-slate-400 text-left mt-3'>Use one of the most common prompts <br /> below or use your own to begin</h1>
        </div>
      <div className={`flex justify-center items-center gap-10 w-[60vw] h-[20vh] mt-10 ${formUrl ? 'blur-sm' : ''}`}>
        <div onClick={()=>{commonPrompts(1)}} className={`hover:cursor-pointer h-[100%] w-[25%] ${theme == 'light'? 'bg-white text-black': 'bg-[#101010] text-white'} rounded-2xl flex flex-col justify-between p-5 font-bold text-lg tracking-tighter`}>
            <h1>Create a Contact Form</h1>
            <MdOutlineContactPage className='text-2xl'/>
        </div>
        <div onClick={()=>{commonPrompts(2)}} className={`hover:cursor-pointer h-[100%] w-[25%] ${theme == 'light'? 'bg-white text-black': 'bg-[#101010] text-white'} rounded-2xl flex flex-col justify-between p-5 font-bold text-lg tracking-tighter`}>
            <h1>Create a Feedback Form</h1>
            <MdOutlineFeedback className='text-2xl'/>
        </div>
        <div onClick={()=>{commonPrompts(3)}} className={`hover:cursor-pointer h-[100%] w-[25%] ${theme == 'light'? 'bg-white text-black': 'bg-[#101010] text-white'} rounded-2xl flex flex-col justify-between p-5 font-bold text-lg tracking-tighter`}>
            <h1>Generate an Inquiry Form</h1>
            <FaQuestion className='text-2xl'/>
        </div>
        <div onClick={()=>{commonPrompts(4)}} className={`hover:cursor-pointer h-[100%] w-[25%] ${theme == 'light'? 'bg-white text-black': 'bg-[#101010] text-white'} rounded-2xl flex flex-col justify-between p-5 font-bold text-lg tracking-tighter`}>
            <h1>Create a Basic Information Form</h1>
            <FaRegUser className='text-2xl'/>
        </div>
      </div>
      <div className={`${theme == 'light' ? 'bg-white text-black' : 'bg-[#101010] text-white'} text-xl w-[60vw] h-[25vh] mt-10 rounded-2xl ${formUrl ? 'blur-sm' : ''}`}>
        <textarea key={theme} value={prompt} onPaste={handlePaste} onChange={(e)=>{if(prompt.length<1001){setPrompt(e.target.value)}}} name="prompt" id="prompt" className='w-[100%] h-[68%] p-3 focus:outline-none' placeholder='Write your prompt here...'></textarea>
        <div className='flex gap-5 justify-end items-center px-5'>
            <h1>{promptlength}/10000</h1>
            {loader && <button onClick={handleSubmit} className='w-10 h-10 bg-[#634AC6] rounded-xl text-center px-2 hover:cursor-pointer'><FadeLoader className='mx-[12.5px] mt-[17px]' height={8} margin={-10} radius={-13} width={3} color='white' speedMultiplier={2}/>  </button>}
            {!loader && <button onClick={handleSubmit} className='w-10 h-10 bg-[#634AC6] rounded-xl text-center px-2 hover:cursor-pointer'><FaArrowRight className='text-white text-2xl' /></button>}
        </div>
      </div>
      {formUrl && (
          <div className={`ml-[10vw] flex flex-col fixed top-1/4 left-1/2 transform -translate-x-1/2 ${theme=='light' ?'bg-[#efefef] border-[2px] border-black': 'bg-[#191919] border-[2px] border-white text-white'} p-5 rounded-xl shadow-lg w-[50vw] h-[40vh]`}>
              <button
                  onClick={() => setFormUrl(null)}
                  className={`rounded-lg !text-right text-2xl ${theme=='light' ? 'text-black': 'text-white'} hover:cursor-pointer`}>
                  X
              </button>
              <div className='flex flex-col items-center mt-4'>
                <h2 className='text-4xl font-bold mb-2 bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text'>Form Created Successfully!</h2>
                <div className='flex items-center justify-center mt-10'>
                  <h1 className={`${theme=='light' ? 'text-black': 'text-white'} text-2xl font-bold tracking-tighter mr-3`}>URL to Form : </h1>
                  <p className='text-xl text-blue-500 break-words'>{formUrl}</p>
                  <TbCopy onClick={copyToClipboard} className={`${theme=='light' ? 'text-black': 'text-white'} ml-3 text-3xl hover:cursor-pointer`}/>
                  <a href={formUrl} target='_blank'><HiMiniArrowTopRightOnSquare className={`${theme=='light' ? 'text-black': 'text-white'} ml-3 text-3xl hover:cursor-pointer`} /></a>
                </div>
              </div>
          </div>
      )}
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

export default Create