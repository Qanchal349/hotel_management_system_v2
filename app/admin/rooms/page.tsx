import React from 'react'
import { getAuthHeader } from '@/helpers/authHeaders'
import Error from '@/app/error'
import AllRooms from '@/components/admin/AllRooms'

export const metadata = {
   title:"All Rooms - Admin"
}

   const getRooms = async()=>{
     
     const authHeaders = getAuthHeader()
     const res = await fetch(`${process.env.API_URL}/api/admin/rooms`,{
         headers:authHeaders.headers
     })  
     return await res.json() 

  } 

  const AdminRoomPage = async() => {

  const data = await getRooms(); 
  if(data?.errMessage){
    return <Error error={data}/>
  }

  return (
      <AllRooms data={data} />
  )

}
export default AdminRoomPage 