import React from 'react'
import { getAuthHeader } from '@/helpers/authHeaders'
import Error from '@/app/error'
import AllBookings from '@/components/admin/AllBookings'

export const metadata = {
   title:"All Bookings - Admin"
}

 const getBookings = async()=>{
     
     const authHeaders = getAuthHeader()
     const res = await fetch(`${process.env.API_URL}/api/admin/bookings`,authHeaders)  
     return await res.json() 

  } 

  const AdminBookingPage = async() => {

  const data = await getBookings(); 
  if(data?.errMessage){
    return <Error error={data}/>
  }

  return (
      <AllBookings data={data} />
  )

}
export default AdminBookingPage 