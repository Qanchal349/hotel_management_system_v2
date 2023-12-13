import Error from '@/app/error'
import Invoice from '@/components/invoice/Invoice'
import { getAuthHeader } from '@/helpers/authHeaders'



// server component 
export const metadata = {
   title:"Invoice 📩"
}

const getBooking = async(id:string)=>{
   const authHeader = getAuthHeader();
   const res = await fetch(`${process.env.API_URL}/api/bookings/${id}`,authHeader)  
   return  res.json() 

}



const InvoicePage = async({params}:{params:{id:string}}) => {

    const data = await getBooking(params?.id); 

    if(data?.errMessage){
        return <Error error={data}/>
    }
    
    return (
        <Invoice data={data}/>
    )

}



export default InvoicePage  