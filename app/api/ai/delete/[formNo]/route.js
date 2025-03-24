const form = require('@/models/Form');
const analytics = require('@/models/analytics');
const user = require('@/models/user');
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');

export const POST = async(req, {params})=>{
    try {
        const {formNo} = await params;
        const {token} = await req.json();
        const email = jwt.decode(token,process.env.JWT_SECRET);
        const userResponse = await user.find({email});
        if(!token){
            return NextResponse.json({error: "Un-Authorised Access"},{status: 200});
        }
        const formResponse = await form.find({formNo});
        if(!formResponse[0].owner.equals(userResponse[0]._id)){
            return NextResponse.json({error: "Un-Authorised to Delete this Form"},{status: 200});
        }
        await form.findOneAndDelete({formNo});
        await analytics.findOneAndDelete({formNo});
        return NextResponse.json({msg: "Success"},{status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Something went wrong"},{status: 500});
    }
}