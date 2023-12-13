'use client';
import { IUser } from '@/backend/models/user';
import { useDeleteUserMutation } from '@/redux/api/userApi';
import { MDBDataTable } from 'mdbreact'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';



 interface Props {
     data:{
        users:IUser[] 
     }
 }

  const AllUsers = ({data}:Props) => {
  
  const users = data?.users 
  const [deleteUser,{error,isLoading,isSuccess}]  =  useDeleteUserMutation()
  const router = useRouter()


  useEffect(() => {
    if(error && "data" in error){
         //@ts-ignore
        toast.error(error?.data?.errMessage)
    } 
    if(isSuccess){
        router.refresh();
        toast.success("User Deleted")
    }

   }, [error,isSuccess])


  const setUsers =()=> {
    const data:{columns:any[],rows:any[]} ={
        columns:[
            {
                label:"ID",
                field:'id',
                sort:"asc"
            },
            {
                label:"Name",
                field:'name',
                sort:"asc"
            },
            {
                label:"Role",
                field:'role',
                sort:"asc"
            },
            {
                label:"Email",
                field:'email',
                sort:"asc"
            },
            {
                label:"Actions",
                field:"actions",
                sort:"asc"
            }
        ],
        rows:[]
    }

  users.forEach((user)=>{
      data?.rows?.push({
          id:user._id,
          name:user?.name,
          email:user?.email,
          role:user?.role,
          _actions: (
              <>
                                                                  {/* // <i className="fa fa-eye"></i> */}
             <Link href={`/admin/users/${user?._id}`} className='btn btn-primary'>🖊</Link>
             <button className="btn btn-outline-danger mx-2"  disabled={isLoading} onClick={()=>deleteUserHandler(user?._id)} ><i className="fa fa-trash"></i></button>
              </>
          ),
          get actions() {
              return this._actions;
          },
          set actions(value) {
              this._actions = value;
          },
      })
  })

    return data;
  }
 
 
  const deleteUserHandler=(id:string)=>{
         deleteUser(id)
  }


  return (
    <div className='container'>
         <h4 className='my-5'> All Users </h4>

         <MDBDataTable
          data={setUsers()} 
          className="px-3"
          bordered
          striped
          hover
         
         />
    </div>
  )
}

export default AllUsers