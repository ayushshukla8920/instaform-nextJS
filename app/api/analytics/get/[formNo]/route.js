import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
const user = require('@/models/user');
const analytics = require('@/models/analytics');
const jwt = require('jsonwebtoken');

export const POST = async(req,{params})=>{
    connectToDB();
    try {
        const {formNo} = await params;
        const {token} = await req.json();
        const {email} = jwt.decode(token,process.env.JWT_SECRET);
        const userResponse = await user.find({email});
        if(!token){
            return NextResponse.json({error: "Un-Authorised Access"},{status: 200});
        }
        if(!formNo){
            return NextResponse.json({error: "No FormNumber Recieved"},{status: 200});
        }
        const response = await analytics.find({formNo});
        if(response.length==0){
            return NextResponse.json({msg: "No Analytics Available"},{status: 200});
        }
        else{
            return NextResponse.json(response[0],{status: 200});
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500});
    }
}