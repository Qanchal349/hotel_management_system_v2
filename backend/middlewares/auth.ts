import { NextRequest, NextResponse } from "next/server";
import { IUser } from "../models/user";
import {getToken} from "next-auth/jwt"


export const isAuthenticatedUser = async(req:NextRequest,event:any,next:any)=>{
    
  const session = await getToken({req})  
 
  if(!session){
     return NextResponse.json({
        "message":"Login first to access this route"
     },{status:401})
  }

   //@ts-ignore
  req.user = session.user as IUser 
  return next()
}


export const authorizeRoles = (...roles:string[])=>{

    return (req:NextRequest ,event:any,next:any)=> {
       //@ts-ignore
      if(!roles.includes(req.user.role)) {
          return NextResponse.json({
             //@ts-ignore
             errMessage:`Role (${req.user.role}) is not allowed to access this resources`
          },{status:403})
      } 
      return next();
    }

}