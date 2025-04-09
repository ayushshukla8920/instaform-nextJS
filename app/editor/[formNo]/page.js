"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function FormPreview() {
    const {user,token,theme} = useGlobalContext();
    const iframeRef = useRef(null);
    const { formNo } = useParams();
    const [HTML, setHTML] = useState("");
    const [clickedText, setClickedText] = useState("");
    const [selectedElement, setSelectedElement] = useState(null);
    useEffect(() => {
        async function fetchForm() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/ai/form/${formNo}`);
                setHTML(response.data);
            } catch (error) {
                console.error("Error fetching form:", error);
            }
        }
        fetchForm();
    }, [formNo]);
    useEffect(() => {
        const attachClickHandler = () => {
            const iframe = iframeRef.current;
            if (!iframe) return;
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDocument) return;
            const handleClickInsideIframe = (event) => {
                event.preventDefault();
                const target = event.target;
                const tagName = target.tagName.toLowerCase();
                const allowedTags = [
                    "label",
                    "p",
                    "span",
                    "strong",
                    "em",
                    "b",
                    "i",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "button"
                ];
            
                if (!allowedTags.includes(tagName)) {
                    console.log("Clicked non-editable element:", tagName);
                    return;
                }
                const selectedText = target.innerText.trim();
                if (selectedText) {
                    setClickedText(selectedText);
                    setSelectedElement(target);
                }
            };
            iframeDocument.addEventListener("click", handleClickInsideIframe);
            return () => {
                iframeDocument.removeEventListener("click", handleClickInsideIframe);
            };
        };
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.onload = attachClickHandler;
        }
    }, [HTML]);
    const handleTextChange = (e) => {
        const newText = e.target.value;
        setClickedText(newText);
        if (selectedElement) {
            const radioInput = selectedElement.querySelector('input[type="radio"]');
            if (radioInput) {
                selectedElement.innerHTML = '';
                selectedElement.appendChild(radioInput); 
                const textNode = document.createTextNode(" " + newText); 
                selectedElement.appendChild(textNode);
            } else {
                selectedElement.innerText = newText; 
            }
        }
    };
    return (
        <>
            <div className={`w-full h-[10vh] flex items-center justify-between px-10 fixed bg-[#101010] text-white`}>
                <Link href='/forms'><button className="text-white font-semibold bg-gradient-to-bl from-[#B100A2] to-[#624AD7] hover:cursor-pointer hover:scale-[1.02] transition-all h-8 rounded-md w-[10vw]">Back to Forms</button></Link>
                <h1 className="text-4xl font-bold">Form Editor</h1>
            </div>
            <div className="w-full min-h-screen flex">
                <iframe
                    ref={iframeRef}
                    srcDoc={HTML}
                    style={{ width: "70%", height: "100vh", border: "1px solid #ccc", marginTop: "10vh" }}
                    title="Form Preview"
                ></iframe>
                <div className={`w-[30%] h-[100vh] px-10 py-5 mt-[10vh] fixed ml-[70%] bg-[#191919] text-white`}>
                    <h1>Edit Area</h1>
                    <textarea
                        value={clickedText}
                        placeholder="Click on text inside the form..."
                        className="w-[100%] px-4 py-2 border h-[50vh] font-semibold text-2xl"
                        onChange={handleTextChange}
                    />
                </div>
            </div>
        </>
    );
}

export default FormPreview;
