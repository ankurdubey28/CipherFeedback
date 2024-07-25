import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import {dbConnect} from "@/lib/db";
import UserModel, {Message} from "@/model/User";
import {User} from "next-auth";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";


export async function GET(req:NextRequest){
  await dbConnect()
  const session=await getServerSession(authOptions)
  const user:User=session?.user as User
  if(!session || !session.user){
    return NextResponse.json({
      success:false,
      msg:"Not Authenticated"
    },{status:401})
  }
  const userId=new mongoose.Types.ObjectId(user._id)
  try {
    const user:Message[]=await UserModel.aggregate([
      {$match:{id:userId}},
      {$unwind:'$messages'},
      {$sort:{'messages.createdAt':-1}},
      {$group:{_id:"$_id",messages:{$push:"$messages"}}},
    ])
    if(!user || user.length===0){
      return NextResponse.json({
        success:false,
        msg:"Not Authenticated"
      },{status:401})
    }

    return NextResponse.json({
      success:true,
      msg:user[0].messages
    },{status:401})
  }catch (err){
    return NextResponse.json({
      success:false,
      msg:"Error occurred"
    },{status:401})
  }
}