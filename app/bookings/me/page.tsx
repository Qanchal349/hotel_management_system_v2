import Error from '@/app/error'
import MyBooking from '@/components/bookings/MyBooking'
import { getAuthHeader } from '@/helpers/authHeaders'

// server component 

export const metadata = {
   title:"My Bookings 📅"
}

const getBookings = async()=>{
   const authHeader = getAuthHeader();
   const res = await fetch(`${process.env.API_URL}/api/bookings/me`,authHeader)  
   return  res.json() 
}


const MyBookingPage = async() => {

    const data = await getBookings(); 
    
    if(data?.errMessage){
        return <Error error={data}/>
    }
    return (
        < MyBooking data={data}/>
    )

}



export default MyBookingPage  