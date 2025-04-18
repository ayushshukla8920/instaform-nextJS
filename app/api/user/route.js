import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const user = require('@/models/user');

export const POST = async(req)=>{
    connectToDB();
    try {
        const {token} = await req.json();
        const email = jwt.decode(token);
        if(!token){
            return NextResponse.json({error: "Un-Authorised Access"},{status: 200});
        }
        const userResponse = await user.find({email});
        if(!userResponse){
            return NextResponse.json({error: "Un-Authorised Access"},{status: 200});
        }
        return NextResponse.json(userResponse[0],{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500});
    }
}