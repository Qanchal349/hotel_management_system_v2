'use client';
import { useResetPasswordMutation } from '@/redux/api/authApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ButtonLoader from '../layout/ButtonLoader';


 interface Props {
    token:string 
 }

 const NewPassword = ({token}:Props) => {
 const router = useRouter()
 const [confirmPassword, setConfirmPassword] = useState('')
 const [password, setPassword] = useState('')
 const [resetPassword,{isLoading,error,isSuccess}] = useResetPasswordMutation()

 useEffect(() => {
    if(error && 'data' in error){
       //@ts-ignore
        toast.error(error?.data?.errMessage) 
    } 
   if(isSuccess){
      toast.success("Password reset was successfull")
      router.push("/login") 
   }
  
 }, [error,isSuccess])
 

 const submitHandler=(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
   const userData = {confirmPassword,password};
   resetPassword({token,body:userData})
 }


  return (
    <div className="row wrapper">
    <div className="col-10 col-lg-5">
      <form
        className="shadow rounded bg-body"
        onSubmit={submitHandler}
      >
        <h2 className="mb-4">New Password</h2>

        <div className="mb-3">
          <label htmlFor="password_field" className="form-label"> Password </label>
          <input
            type="password"
            id="password_field"
            className="form-control"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirm_password_field" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password_field"
            className="form-control"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn form-btn w-100 py-2">
          {isLoading ? <ButtonLoader/> : "Set Password"}
        </button>
      </form>
    </div>
  </div>
  )
}

export default NewPassword