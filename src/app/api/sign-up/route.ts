import { dbConnect } from "@/lib/db";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req:NextResponse) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
          {
            success: false,
            message: "Username already taken",
          },
          { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
    if(existingUserByEmail.isVerified){
      return NextResponse.json({
        success: false,
        message:"User already exist with this "
      })
    }
    else{
      const hashedPass=await bcrypt.hash(password,10)
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      existingUserByEmail.password=hashedPass
      existingUserByEmail.verifyCode=verifyCode;
      existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+360000)
      await existingUserByEmail.save()
    }
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new UserModel({
      username,
      email,
      password: hashedPass,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
      isAcceptingMessage: true,
      messages: [],
    });

    await newUser.save();

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);

    if (!emailResponse.success) {
      return NextResponse.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
      );
    }

    return NextResponse.json(
        {
          success: true,
          message: "User registered successfully. Verification email sent.",
        },
        { status: 201 }
    );
  } catch (err) {
    console.error("Error registering user", err);
    return NextResponse.json(
        {
          success: false,
          message: "Error registering user",
        },
        { status: 500 }
    );
  }
}
