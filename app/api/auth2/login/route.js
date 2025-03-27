import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const user = require('@/models/user');
const bcrypt = require('bcryptjs');

export const POST = async(req)=>{
    connectToDB();
    var token;
    try{
        const {email,password} = await req.json();
        const response = await user.find({email: email});
        if(response.length==0){
            return NextResponse.json({error: "Invalid Email"},{status: 200});
        }
        const isMatch = bcrypt.compareSync(password,response[0].password); 
        if(!isMatch){
            return NextResponse.json({error: "Invalid Password"},{status: 200});
        }
        token = jwt.sign(email,process.env.JWT_SECRET);
    }
    catch(error){
        console.error(error);
        return NextResponse.json({error: "Internal Server Error"},{status: 500});
    }
    return NextResponse.json({msg:"Success",token},{status: 200});
}