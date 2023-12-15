import React from 'react'
import { getAuthHeader } from '@/helpers/authHeaders'
import Error from '@/app/error'
import UpdateRoom from '@/components/admin/UpdateRoom'

export const metadata = {
   title:"Update Room - Admin"
}

   const getRooms = async(id:string)=>{
     
     const authHeaders = getAuthHeader()
     const res = await fetch(`${process.env.API_URL}/api/rooms/${id}`,{
         headers:authHeaders.headers
     })  
     return await res.json() 

  } 

  const AdminUpdateRoomPage = async({params}:{params:{id:string}}) => {

  const data = await getRooms(params?.id); 
  if(data?.errMessage){
    return <Error error={data}/>
  }

  return (
      <UpdateRoom data={data} />
  )

}
export default AdminUpdateRoomPage 