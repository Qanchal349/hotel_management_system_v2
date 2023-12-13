import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import User from "../models/user";
import ErrorHandler from "../utils/errorHandler";
import { delete_file, upload_file } from "../utils/cloudinary";
import { resetPasswordHTMLTemplate } from "../utils/emailTemplates";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto"


// Register User ---  /api/auth/register 
export const registerUser = catchAsyncErrors(async(req:NextRequest)=>{
  const {name,email,password}  = await req.json() 
  const user = await User.create({name,email,password})
  
  return NextResponse.json({
     success:true,
     user
  })
})



// update profile => /api/me/update 
export const updateProfile = catchAsyncErrors(async(req:NextRequest)=>{
  const body  = await req.json() 

  const userData = {
     name:body.name,
     email:body.email 
  }

  //@ts-ignore
  const user = await User.findByIdAndUpdate(req.user._id,userData)
  
    return NextResponse.json({
     success:true,
     user
   })
   
})



// update password   /api/me/update_password 
export const updatePassword = catchAsyncErrors(async(req:NextRequest)=>{
  const body  = await req.json() 
  //@ts-ignore
  const user = await User.findById(req?.user?._id).select("+password")
  
  const isMatched = await user.comparePassword(body.oldPassword) 
  if(!isMatched)
    throw new ErrorHandler("Old Password is incorrect",400) 
  
   user.password = body.password
   await user.save()  

  return NextResponse.json({
     success:true,
   })
   
})



// upload user avatar   /api/me/upload_avatar 
export const uploadUserAvatar = catchAsyncErrors(async(req:NextRequest)=>{
  const body  = await req.json() 
  const avatarResponse = await upload_file(body?.avatar,"products")
  // remove avatar from cloudinary
  //@ts-ignore
  if(req?.user?.avatar?.public_id)
  //@ts-ignore
   await delete_file(req?.user?.avatar?.public_id) 

   //@ts-ignore
  const user = await User.findByIdAndUpdate(req?.user?._id,{avatar:avatarResponse})
  return NextResponse.json({
     success:true,
     user 
   })
   
})


// forgot password   /api/password/forgot  
export const forgotPassword = catchAsyncErrors(async(req:NextRequest)=>{
  const body  = await req.json() 
  const user = await User.findOne({email:body.email}) 
 if(!user){
   throw new ErrorHandler("User not found with this email",404)
 }

 const resetToken = user.getResetPasswordToken();
 await user.save();

 const resetUrl = `${process.env.API_URL}/password/reset/${resetToken}` ;
 const message = resetPasswordHTMLTemplate(user?.name,resetUrl);

    try {
        await sendEmail({
           email:user.email,
           subject:"Bookit Password Recovery",
           message
        })
    } catch (error:any) {
       user.resetPasswordToken=undefined;
       user.resetPasswordExpire=undefined 
       await user.save();
       throw new ErrorHandler(error?.message,500)
    }

 return NextResponse.json({
     success:true,
 })
   
})


// reset password   /api/password/reset/:token 
export const resetPassword = catchAsyncErrors(async(req:NextRequest,{params}:{params:{token:string}})=>{
   const body  = await req.json() 
   const resetPasswordToken = crypto.createHash('sha256').update(params.token).digest('hex')
   const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
   }) 
  if(!user){
    throw new ErrorHandler("Reset Password Token is invalid or has been expired",404)
  }
 
  if(body.confirmPassword!==body.password)
     throw new ErrorHandler("Password does not matched",400)

  user.password = body.password;
  user.resetPasswordToken=undefined;
  user.resetPasswordExpire=undefined 
  await user.save();

  return NextResponse.json({
      success:true,
  })
    
 })



 //get all users      =>/api/admin/users 
 export const allAdminUser = catchAsyncErrors(async(req:NextRequest)=>{
   
   const users = await User.find()
   
     return NextResponse.json({
      success:true,
      users
    })
    
 })





  //get user detail      =>/api/admin/user/:id 
  export const getUserDetails = catchAsyncErrors(async(req:NextRequest,{params}:{params:{id:string}})=>{
   
     const user = await User.findById(params.id)
     if(!user)
       throw new ErrorHandler("User not found",404)
     return NextResponse.json({
      success:true,
      user
     })
 })


  //update user detail      =>/api/admin/user/:id 
  export const updateUserDetails = catchAsyncErrors(async(req:NextRequest,{params}:{params:{id:string}})=>{
   const body = await req.json();
   let user = await User.findById(params.id)
   if(!user)
     throw new ErrorHandler("User not found",404)

   const newUserData = {
       name:body?.name,
       email:body?.email,
       role:body?.role 
   }  

   user = await User.findByIdAndUpdate(params.id,newUserData) 

   return NextResponse.json({
      success:true,
      user
   })
 })


 
  //delete user       =>/api/admin/user/:id 
  export const deleteUser = catchAsyncErrors(async(req:NextRequest,{params}:{params:{id:string}})=>{
   
   const user = await User.findById(params.id)
   if(!user)
     throw new ErrorHandler("User not found",404)
  
   if(user?.avatar?.public_id){
      await delete_file(user?.avatar?.public_id) 
   }   
   await user.deleteOne(); 
    
   return NextResponse.json({
    success:true,
    
   })
})




  


