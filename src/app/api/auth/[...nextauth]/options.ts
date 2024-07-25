import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {dbConnect} from "@/lib/db";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions={
  providers:[
    CredentialsProvider({
       id:"credentials",
      name:"Credentials",
      credentials: {
        username: {label: "Username", type: "text", placeholder: "username"},
        password: {label: "Password", type: "password", placeholder: "password"},
      },
        async authorize(credentials:any):Promise<any>{
           await dbConnect()
          try {
           const user= await UserModel.findOne({
              $or:[{email:credentials.email},{username:credentials.username}]})

            if(!user){
              throw new Error("NO user Found")
            }
            if(!user.isVerified){
              throw new Error("verify your account first")
            }
            const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
            if(isPasswordCorrect){
              return user;
            }
            else{
              throw new Error("invalid credentials")
            }
          }catch (err){
             throw new Error()
          }
        }

      })
  ],
  pages:{
    signIn:'/sign-in'
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET,
  callbacks:{
    async session({session,user,token}){
      if(token){
        session.user._id=token._id
        session.user.isVerified=token.isVerified
        session.user.isAcceptingMessages=token.isAcceptingMessages
        session.user.username=token.username
      }
      return session
    },
    async jwt({token,user}){
      if(user){
        token._id=user._id?.toString()
        token.isVerified=user.isVerified
        token.isAcceptingMessages=user.isAcceptingMessages
        token.username=user.username
      }
      return token
    }
  }
}