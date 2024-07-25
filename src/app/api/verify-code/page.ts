import {dbConnect} from "@/lib/db";
import UserModel from "@/model/User";
import {NextRequest, NextResponse} from "next/server";
import {verifySchemaValidation} from "@/schemas/verifySchema";
import {usernameValidation} from "@/schemas/signUpSchema";


export async function POST(req:NextRequest) {
 await dbConnect()

  try {
    const {username,code}=await req.json()
    const validCode=verifySchemaValidation.safeParse(code)
    const validUsername=usernameValidation.safeParse(username)

    if(!validCode.success || !validUsername.success){
      return NextResponse.json({
        success:false,
        msg:"Invalid Input"
      },{status:500})
    }
    const decodedUsername=decodeURIComponent(username)

    const user=await UserModel.findOne({
      username:decodedUsername
    })

    if(!user){
      return NextResponse.json({
        success:false,
        msg:"user not found"
      },{status:500})
    }

    const isCodeValid=user.verifyCode===code
    const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date()

    if(isCodeValid && isCodeNotExpired){
      user.isVerified=true;
      await user.save()

      return NextResponse.json({
        success:true,
        msg:"Account verification successfully"
      },{status:200})
    }
    else if(!isCodeNotExpired){
      return NextResponse.json({
        success:false,
        msg:"Code Expired"
      },{status:400})
    }
    else{
      return NextResponse.json({
        success:false,
        msg:"Wrong code "
      },{status:400})
    }
  }catch (err){

  }
}