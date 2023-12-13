import React from 'react'
import { getAuthHeader } from '@/helpers/authHeaders'
import Error from '@/app/error'
import AllUsers from '@/components/admin/AllUsers'

export const metadata = {
   title:"All Users - Admin"
}

   const getRooms = async()=>{
     
     const authHeaders = getAuthHeader()
     const res = await fetch(`${process.env.API_URL}/api/admin/users`,{
         headers:authHeaders.headers
     })  
     return await res.json() 

  } 

  const AllAdminUsersPage = async() => {

  const data = await getRooms(); 
  if(data?.errMessage){
    return <Error error={data}/>
  }

  return (
      <AllUsers data={data} />
  )

}
export default AllAdminUsersPage 