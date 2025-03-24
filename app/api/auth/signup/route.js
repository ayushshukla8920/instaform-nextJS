import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const user = require('@/models/user');
const bcrypt = require('bcryptjs');

export const POST = async(req)=>{
    connectToDB();
    var token;
    try{
        const {name,email,password} = await req.json();
        const userexist = await user.find({email});
        if(userexist.length > 0 ){
            return NextResponse.json({error: "Email Already Exists"},{status: 200});
        }
        const hashedNewPassword = await bcrypt.hash(password, 10); 
        await user.create({name,email,password: hashedNewPassword});
        token = jwt.sign(email,process.env.JWT_SECRET);
    }
    catch(error){
        return NextResponse.json({error: "Internal Server Error"},{status: 500});
    }
    return NextResponse.json({msg:"Signup Successful",token},{status: 200});
}