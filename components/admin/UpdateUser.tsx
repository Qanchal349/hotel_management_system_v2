'use client';
import { IUser } from '@/backend/models/user'
import { useUpdateUserMutation } from '@/redux/api/userApi';
import React, { useEffect, useState } from 'react'
import ButtonLoader from '../layout/ButtonLoader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


interface Props{
     data:{
         user:IUser
     }
}

const UpdateUser = ({data}:Props) => {

 const user:IUser = data?.user;   

 const [name, setName] = useState(data?.user?.name)
 const [email, setEmail] = useState(data?.user?.email)
 const [role, setRole] = useState(data?.user?.role)
 const [updateUser,{error,isLoading,isSuccess}] = useUpdateUserMutation()
 const router = useRouter()

 
 const submitHandler=(e:React.FormEvent<HTMLFormElement>)=>{
     e.preventDefault();
     const userData = {name,email,role} 
     updateUser({id:user?._id,body:userData})
 }

  
  useEffect(() => {
    if (error && "data" in error) {
       //@ts-ignore
      toast.error(error?.data?.errMessage);
    }

    if (isSuccess) {
     
      router.refresh();
      toast.success("User Updated");
    }
  }, [error, isSuccess]);



  return (
       
    <div className="row wrapper">
    <div className="col-10 col-lg-8">
      <form
        className="shadow rounded bg-body"
        onSubmit={submitHandler} 
      >
        <h6 className="mb-4">Update User</h6>

        <div className="mb-3">
          <label htmlFor="name_field" className="form-label">Name</label>
          <input
            type="text"
            id="name_field"
            className="form-control"
            name="name"
            value={name}
            required
            onChange={(e)=>setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email_field" className="form-label">Email</label>
          <input
            type="email"
            id="email_field"
            className="form-control"
            name="email"
            value={email}
            required
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role_field" className="form-label">Role</label>
          <select id="role_field" className="form-select" onChange={(e)=>setRole(e.target.value)} name="role" required value={role}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading} className="btn form-btn w-100 mt-4 mb-3">
           {isLoading ? <ButtonLoader/> : "Update"} 
        </button>
      </form>
    </div>
  </div>


  )
}

export default UpdateUser