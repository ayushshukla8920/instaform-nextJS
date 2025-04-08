"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function FormPreview() {
    const iframeRef = useRef(null);
    const { formNo } = useParams();
    const [HTML, setHTML] = useState("");
    const [clickedText, setClickedText] = useState("");
    const [selectedElement, setSelectedElement] = useState(null); // Store clicked element reference

    useEffect(() => {
        async function fetchForm() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/ai/form/${formNo}`);
                setHTML(response.data); // Store HTML content
            } catch (error) {
                console.error("Error fetching form:", error);
            }
        }
        fetchForm();
    }, [formNo]); // Fetch only when formNo changes

    useEffect(() => {
        const attachClickHandler = () => {
            const iframe = iframeRef.current;
            if (!iframe) return;

            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDocument) return;

            const handleClickInsideIframe = (event) => {
                event.preventDefault();
                const selectedText = event.target.innerText.trim();
                console.log("Clicked text:", selectedText);

                if (selectedText) {
                    setClickedText(selectedText);
                    setSelectedElement(event.target); // Store clicked element reference
                }
            };

            iframeDocument.addEventListener("click", handleClickInsideIframe);

            return () => {
                iframeDocument.removeEventListener("click", handleClickInsideIframe);
            };
        };

        // Attach event listener when iframe loads
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.onload = attachClickHandler;
        }
    }, [HTML]); // Runs when HTML updates

    // Function to update the selected text inside the iframe
    const handleTextChange = (e) => {
        const newText = e.target.value;
        setClickedText(newText);

        if (selectedElement) {
            selectedElement.innerText = newText; // Update the text inside the iframe
        }
    };

    return (
        <div className="w-full min-h-screen">
            <iframe
                ref={iframeRef}
                srcDoc={HTML}
                style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}
                title="Form Preview"
            ></iframe>
            <textarea
                value={clickedText}
                placeholder="Click on text inside the form..."
                className="w-full px-4 py-2 border mt-4"
                onChange={handleTextChange} // Update HTML when text changes
            />
        </div>
    );
}

export default FormPreview;
