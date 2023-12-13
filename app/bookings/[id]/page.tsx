import Error from '@/app/error'
import BookingDetails from '@/components/bookings/BookingDetails'
import { getAuthHeader } from '@/helpers/authHeaders'



// server component 
export const metadata = {
   title:"Bookings Deatils 📅"
}

const getBooking = async(id:string)=>{
   const authHeader = getAuthHeader();
   const res = await fetch(`${process.env.API_URL}/api/bookings/${id}`,authHeader)  
   return  res.json() 

}



const MyBookingPage = async({params}:{params:{id:string}}) => {

    const data = await getBooking(params?.id); 

    if(data?.errMessage){
        return <Error error={data}/>
    }
    
    return (
        <BookingDetails data={data}/>
    )

}



export default MyBookingPage  