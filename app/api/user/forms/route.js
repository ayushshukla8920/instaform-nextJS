import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const user = require('@/models/user');
const form = require('@/models/Form');
const jwt = require('jsonwebtoken');

export const POST = async(req)=>{
    connectToDB();
    try {
        const {token} = await req.json();
        const {email} = jwt.verify(token,process.env.JWT_SECRET);
        if(!token){
            return NextResponse.json({error: "Un-Authorised Access"},{status:200});
        }
        const userResponse = await user.find({email});
        if(userResponse.length == 0){
            return NextResponse.json({error: "Un-Authorised Access"},{status:200});
        }
        const owner = userResponse[0]._id;
        const Forms = await form.find({owner});
        return NextResponse.json(Forms,{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status:500});
    }
}