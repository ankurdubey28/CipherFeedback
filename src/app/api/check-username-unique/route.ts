import {z} from "zod"
import {dbConnect} from "@/lib/db";
import {usernameValidation} from "@/schemas/signUpSchema";
import {NextResponse} from "next/server";
import UserModel from "@/model/User";

 const UsernameQuerySchema=z.object({
   username:usernameValidation,
 })

export async function GET(req:Request, res:Response){
   await dbConnect()

  try {
  const {searchParams}=new URL(req.url)
    //console.log(req.url)
    const queryParam={
    username:searchParams.get('username')
    }
    const result=UsernameQuerySchema.safeParse(queryParam)
    console.log(result)
    if(!result.success){
      return NextResponse.json({
        err:result.error.format().username?._errors || [],
        msg:"invalid query parameter"
      },{status:404})
    }
    const {username}=result.data
    const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})
    if(existingVerifiedUser){
      return NextResponse.json({
        success:false,
        msg:"Username already taken"
      })
    }
    return NextResponse.json({
      success:true,
      msg:"Username is unique and available"
    })
  }catch (err){
     console.error("error checking username",err)
    return NextResponse.json({
      success: false,
      msg:"error checking username"
    },{status:500})
  }
}