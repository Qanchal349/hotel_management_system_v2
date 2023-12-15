import React from 'react'
import Home from '@/components/Home'
import Error from './error'

export const metadata = {
   title:"Bookit"
}

   const getRooms = async(searchParams:string)=>{
    
    const urlParmas = new URLSearchParams(searchParams) 
    const queryString = urlParmas.toString() 
    try {
      const res = await fetch(`${process.env.API_URL}/api/rooms?${queryString}`,{cache:'no-cache'})  
      const data =  await res.json() 
      return data;
    } catch (error) {
       console.log("error=>",error);
    }
  } 

  const HomePage = async({searchParams}:{searchParams:string}) => {

  const data = await getRooms(searchParams); 
  if(data?.errMessage){
    return <Error error={data}/>
  }

  return (
      <Home data={data} />
  )

}
export default HomePage