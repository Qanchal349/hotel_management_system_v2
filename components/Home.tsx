'use client' 
import RoomItem from './room/RoomItem'
import { IRoom } from '@/backend/models/room'
import CustomPagination from './layout/CustomPagination'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'



interface Props {
   data:{
    filteredRoomCount:number,
    rooms:IRoom[],
    resPerPage:number, 
    roomsCount:number
   }
}

const Home = ({data}:Props) => {

  const searchParams = useSearchParams() 
  const location = searchParams.get('location') 
  const { roomsCount,filteredRoomCount,rooms,resPerPage} = data 


  return (
    <div>
    <section id="rooms" className="container mt-5">
      <h5 className="mb-3 ml-2 stays-heading">
        {location ? `${filteredRoomCount} Rooms found in ${location}`:'All Rooms'}
      </h5>
      <Link href="/search" className="ml-2 back-to-search">
        <i className="fa fa-arrow-left"></i> Back to Search
      </Link>
      <div className="row mt-4">
          {rooms.length===0 ? (<>
               <div className='alert alert-danger mt-5 w-100'>No Rooms.</div>
          </>):(<>
               
            {rooms.map((room,i)=>(<RoomItem key={i} room={room} />))}    

          </>)}
      
      </div>
    </section>

     <CustomPagination resPerPage={resPerPage} filteredRoomCount={filteredRoomCount}/>

  </div>
  )
}

export default Home