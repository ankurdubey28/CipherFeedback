import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import {dbConnect} from "@/lib/db";
import UserModel from "@/model/User";
import {User} from "next-auth";
import {NextRequest, NextResponse} from "next/server";


export async function POST(req:NextRequest){
  await dbConnect()
  const session=await getServerSession(authOptions)
  const user:User=session?.user as User
  if(!session || !session.user){
    return NextResponse.json({
      success:false,
      msg:"Not Authenticated"
    },{status:401})
  }
  const userId=user._id
  const {acceptMessages}=await req.json()
  try {
   const UpdatedUser= await UserModel.findByIdAndUpdate(
      userId,
    {isAcceptingMessage:acceptMessages},
    {new:true}
    )

    if(!UpdatedUser){
      return NextResponse.json({
        success:false,
        msg:"Failed to Update User status to accpet messages"
      },{status:401})
    }
    return NextResponse.json({
      success:true,
      msg:"Message acceptance status updated successfully",
      UpdatedUser
    },{status:200})
  }catch (err){
    console.log("Failed to Update User status to accpet messages")
    return NextResponse.json({
      success:false,
      msg:"Failed to Update User status to accpet messages"
    },{status:401})
  }

}

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
  const userId=user._id
  try {
    const FoundUser=await UserModel.findById(userId)
    if(!FoundUser){
      return NextResponse.json({
        success:false,
        msg:"User Not Found"
      },{status:404})
    }
    return NextResponse.json({
      success:true,
      isAcceptingMessage:FoundUser.isAcceptingMessage
    },{status:404})
  }catch (err){
    console.log("Failed to Update User status to accpet messages")
    return NextResponse.json({
      success:false,
      msg:"Error Fetching User status to accpet messages"
    },{status:401})
  }
}