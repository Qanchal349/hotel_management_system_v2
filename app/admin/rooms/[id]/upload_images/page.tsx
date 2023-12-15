import React from 'react'
import Error from '@/app/error'
import UploadRoomImages from '@/components/admin/UploadRoomImages'

    export const metadata = {
      title:"Upload Images - Admin"
    }

    const getRooms = async(id:string)=>{
      
     const res = await fetch(`${process.env.API_URL}/api/rooms/${id}`,{
         next:{
            tags:['RoomDetails']
         }
     })  
     return await res.json() 

    } 

  const AdminUploadRoomImagesPage = async({params}:{params:{id:string}}) => {

  const data = await getRooms(params?.id); 

  if(data?.errMessage){
    return <Error error={data}/>
  }

  return (
      <UploadRoomImages data={data} />
  )

}
export default AdminUploadRoomImagesPage 