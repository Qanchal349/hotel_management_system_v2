import Error from '@/app/error'
import RoomDetails from '@/components/room/RoomDetails'


// server component 

interface Props {
     params:{
        id:string
     }
}

const getRoom = async(id:string)=>{
   const res = await fetch(`${process.env.API_URL}/api/rooms/${id}`,{
      next:{
         tags:["RoomDetails"]  // on demand re-validation
      }
   })  
   return await res.json() 
}


const RoomDetailsPage = async({params}:Props) => {

    const data = await getRoom(params?.id); 
    
    if(data?.errMessage){
        return <Error error={data}/>
    }
    return (
        <RoomDetails data={data}/>
    )

}


export async function generateMetadata({params}:Props){
    const data = await getRoom(params?.id);  // not request again used same cached data
    return {
        title: data?.room?.name 
    } 
}

export default RoomDetailsPage  