import {NextResponse,NextRequest} from "next/server";
export {default} from "next-auth/middleware"
import {getToken} from "next-auth/jwt";

export async function middleware(req:NextRequest){
  const token=await getToken({req:req})
  const url=req.nextUrl
  if(token &&
      (
        url.pathname.startsWith('/sign-in') ||
             url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
      )
  ){
    return NextResponse.redirect(new URL('/dashboard',req.url))
  }

}


export const config={
  matcher:['/sign-in','/sign-up','/','/dashboard:path*','/verify:path*']
}