import connectToDB from '@/lib/db';
import Form from '@/models/Form';
import { NextResponse } from 'next/server';

export const GET = async(req, {params})=>{
    connectToDB();
    try {
        const {formNo} = await params;
        if(!formNo){
            return NextResponse.json({error: "No FormNumber Recieved"},{status: 200});
        }
        const response = await Form.find({formNo});
        if(response.length==0){
            return NextResponse.json({error: "Invalid Form Number"},{status: 200});
        }
        else{
            return new NextResponse(response[0].body, {
                status: 200,
                headers: { "Content-Type": "text/html" },
            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500});
    }
}
