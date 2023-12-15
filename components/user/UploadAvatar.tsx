'use client';
import { useLazyUpdateSessionQuery, useUploadAvatarMutation } from '@/redux/api/userApi';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ButtonLoader from '../layout/ButtonLoader';



const UploadAvatar = () => {
 const router = useRouter();

 const [avatar, setAvatar] = useState("")
 const [avatarPreview, setAvatarPreview] = useState("")
 const [uploadAvatar,{isLoading,isSuccess,error}] = useUploadAvatarMutation()
 const {user} = useAppSelector((state)=>state.auth)
 const [updateSession,{data}] = useLazyUpdateSessionQuery()

 useEffect(() => {
   if(user?.avatar){
      setAvatarPreview(user?.avatar?.url)
   }
    if(error && 'data' in error){
       //@ts-ignore
    toast.error(error?.data?.errMessage) 
    } 

    if(isSuccess){
    //@ts-ignore 
      updateSession()
      router.refresh()
    }

 }, [user,error,isSuccess])
 
 const onchange:React.ChangeEventHandler<HTMLInputElement> = (e)=>{
    const files = Array.from(e.target.files || []) 
    const reader = new FileReader();
    reader.onload =()=>{
         if(reader.readyState===2){
             setAvatar(reader.result as string)
             setAvatarPreview(reader.result as string) 
         } 
    }

    reader.readAsDataURL(files[0])
 }


 const submitHander=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const userData = {avatar}
    uploadAvatar(userData)   
 }  

  return (
    <div className ="row wrapper">
    <div className ="col-10 col-lg-8">
      <form
        className ="shadow rounded bg-body"
        onSubmit={submitHander}
      >
        <h2 className ="mb-4">Upload Avatar</h2>

        <div className ="form-group">
          <div className ="d-flex align-items-center">
            <div className ="me-3">
              <figure className ="avatar item-rtl">
                <img src={avatarPreview} className ="rounded-circle" alt="image" />
              </figure>
            </div>
            <div className ="input-foam">
              <label className ="form-label" htmlFor="customFile">
                Choose Avatar
              </label>
              <input
                type="file"
                name="avatar"
                className ="form-control"
                id="customFile"
                accept="images/*"
                onChange={onchange}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className ="btn form-btn w-100 py-2">
             {isLoading ? <ButtonLoader/> : "UPDATE"}
        </button>
      </form>
    </div>
  </div>
  )
}

export default UploadAvatar