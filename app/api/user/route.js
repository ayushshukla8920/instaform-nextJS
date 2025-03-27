import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const user = require('@/models/user');

export const POST = async(req)=>{
    connectToDB();
    try {
        const {token} = await req.json();
        console.log(token);
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        console.log(payload);
        const email = payload.email;
        console.log(process.env.JWT_SECRET);
        if(!token){
            return NextResponse.json({error: "Un-Authorised Access"},{status: 200});
        }
        const userResponse = await user.findOne({email});
        if(!userResponse){
            return NextResponse.json({error: "Un-Authorised Access"},{status: 200});
        }
        return NextResponse.json(userResponse,{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500});
    }
}