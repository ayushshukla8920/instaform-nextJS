import connectToDB from "@/lib/db";
import { NextResponse } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const user = require('@/models/user');
const form = require('@/models/Form');
const jwt = require('jsonwebtoken');

const SYSTEM_PROMPT =  `An exemplary embodiment of an AI agent is designed to generate HTML forms exclusively from user-provided prompts that contain solely form-related specifications. If the input is valid, the agent generates the corresponding HTML code using Tailwind CSS, including the Tailwind Play CDN script (with Tailwind pre-configured on the server). The output is strictly plain HTML code without additional commentary, language identifiers, or triple quote markers.
The generated form is centered on the page and adopts a dark or light theme based on the user’s prompt. Every form includes a required email field to facilitate further contact. The form’s action is set to "/api/analytics/submit" and its method is POST, and a title tag is incorporated.
The design specifications are as follows: • The page background color is #EFEFEF while the form background is white, with the overall layout using "flex flex-col items-center justify-center" to ensure proper centering. • The form remains centered on the page, and its heading employs a text size of 4xl. • Input text is rendered in black. • The form heading is styled with the Tailwind CSS classes "font-bold bg-gradient-to-bl from-[#B100A2] to-[#624AD7] text-transparent bg-clip-text". • The submit button features bold, white text and is styled with the Tailwind classes "bg-gradient-to-bl from-[#B100A2] to-[#624AD7]" make sure to give class min-h-screen to the body instead of h-screen.
and language name and tripls quotes should not be there. If it is a quiz make sure to maintain proper spacing between questionsa and give full questions instead of placeholder questions as this form will get automatically deployed and no user editing is allowed.`

function generateFormNumber() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `form_${randomNumber}`;
}

export const POST = async(req)=>{
    connectToDB();
    try {
        const {prompt,token} = await req.json();
        const {email} = jwt.decode(token,process.env.JWT_SECRET);
        const userResponse = await user.find({email});
        if(!token){
            return NextResponse.json({error: "Un-Authorised Access"},{status:200});
        }
        if(!prompt){
            return NextResponse.json({error: "No Prompt Recieved"},{status:200});
        }
        const result = await model.generateContent(SYSTEM_PROMPT+prompt);
        if(result.response.candidates[0].content.parts[0].text.includes("Invalid Prompt.")){
            return NextResponse.json({error: "Invalid Prompt."},{status:200});
        }
        var is_exist = true
        var formNo;
        while(is_exist){
            formNo = generateFormNumber();
            const result = await form.find({formNo});
            if(result.length == 0){
                is_exist = false;
            }
        }
        const htmlString = result.response.candidates[0].content.parts[0].text;
        const match = htmlString.match(/<title>(.*?)<\/title>/i)[1];
        await form.create({owner: userResponse[0]._id,body: htmlString,formNo,formName: match});
        return NextResponse.json({msg: "Success",formNo},{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status:500});
    }
}
