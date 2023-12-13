import React from 'react'
import { getAuthHeader } from '@/helpers/authHeaders'
import Error from '@/app/error'
import AllUsers from '@/components/admin/AllUsers'
import UpdateUser from '@/components/admin/UpdateUser'

export const metadata = {
   title:"User - Admin"
}


   interface Props {
       params :{id:string}
   }

   const getUser = async(id:string)=>{
     const authHeader = getAuthHeader();
     const res = await fetch(`${process.env.API_URL}/api/admin/users/${id}`,authHeader)  
     return await res.json()   

   } 
   
  const UpdateUserPage = async({params}:Props) => {

  const data = await getUser(params?.id); 
  if(data?.errMessage){
    return <Error error={data}/>
  }

  return (
      <UpdateUser data={data} />
  )

}
export default UpdateUserPage 