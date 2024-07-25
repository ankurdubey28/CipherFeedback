import UserModel from "@/model/User";
import {dbConnect} from "@/lib/db";
import {Message} from '@/model/User'
import {NextRequest, NextResponse} from "next/server";


export async function POST(req:NextRequest){
  await dbConnect()

 const {username,content}= await req.json()
  try {
  const user=  UserModel.findOne({username:username})
    if(!user){
      return NextResponse.json({
        success:false,
        msg:"User not found"
      },{status:401})
    }

    if(!user.isAcceptingMessage){
      return NextResponse.json({
        success:false,
        msg:"User not accepting Message"
      },{status:404})
    }
    const newMessage:Message={content,createdAt:new Date()}
    user.messages.push(newMessage)
    await user.save()

    return NextResponse.json({
      success:true,
      msg:"Message sent successfully"
    },{status:200})
  }catch (err){
    console.log("Failed to send any Message",err)
    return NextResponse.json({
      success:false,
      msg:"Message Not sent"
    },{status:500})
  }
}