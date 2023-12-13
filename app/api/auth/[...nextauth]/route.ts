import User, { IUser } from "@/backend/models/user";
import { NextApiRequest, NextApiResponse } from "next";
import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

type Credentials={
    password:string,
    email:string 
}

type Token = {
    user:IUser
}

async function auth(req:NextRequest,res:any){
      
 return await nextAuth(req,res,{
     session:{
        strategy:'jwt'
     },
     providers:[
        CredentialsProvider({

             // @ts-ignore
             async authorize(credentials:Credentials){
                 const {email,password} = credentials;
                 const user = await User.findOne({email}).select('+password')
                 if(!user){
                   throw new Error("Invalid Email or Password")  
                 }
                 const isPasswordMatch = await bcrypt.compare(password,user.password)
                 if(!isPasswordMatch)
                 throw new Error("Invalid Email or Password") 

                 return user;
             }
        })
     ],

     callbacks:{
          jwt: async({token,user})=>{
              const jwtToken = token as Token 
              user && (token.user=user)
             //TODO -update session when user is update 
             if(req.url?.includes("/api/auth/session?update")){
               const updatedUser = await User.findById(jwtToken?.user?._id)
               token.user = updatedUser
             }

             return token  
          } ,

          session:async({session,token}) =>{
              session.user = token.user as IUser
              //@ts-ignore 
              delete session?.user?.password 
              return session;
          }
     },
    pages:{
       signIn:'/login' 
    },
    secret: process.env.NEXTAUTH_SECRET
 })




}


export {auth as GET ,auth as POST} 