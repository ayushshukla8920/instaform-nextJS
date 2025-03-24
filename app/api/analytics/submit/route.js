import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
const analytics = require('@/models/analytics');
export const POST = async(req)=>{
    connectToDB();
    try {
        const refer = req.headers.get('referer');
        const formData = await req.formData();
        const jsonData = Object.fromEntries(formData.entries());
        const formNo = `form_${refer.slice(-6)}`;
        const updatedEntry = await analytics.findOneAndUpdate(
            { formNo: formNo },
            {
                $setOnInsert: { formNo: formNo },
                $push: { responses: jsonData }
            },
            { new: true, upsert: true }
        );
        
        return new NextResponse(
            `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Success</title>
                <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
            </head>
            <body>
                <div class="w-full h-screen flex justify-center items-center text-white text-5xl font-bold bg-slate-800">
                    <h1>Form Submitted Successfully</h1>
                </div>
            </body>
            </html> 
            `,{
                headers: { "Content-Type": "text/html" }
            }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500})
    }
}