'use client';
import { IRoom } from '@/backend/models/room'
import React, { useEffect } from 'react'
import StarRatings from "react-star-ratings" 
import RoomImageSlider from './RoomImageSlider';
import RoomFeatures from './RoomFeatures';
import BookingDatePicker from './BookingDatePicker';
import NewReview from '../review/NewReview';
import ListReviews from '../review/ListReviews';


interface Props{
     data:{
        room:IRoom 
     }
}

const RoomDetails = ({data}:Props) => {
  const {room} = data;

  useEffect(() => {
   //if(room?.location) setMap()        
    
  }, [])
  

  return (
    <div className="container container-fluid">
    <h2 className="mt-5">{room.name}</h2>
    <p>{room.address}</p>

    <div className="ratings mt-auto mb-3">
                <StarRatings
                rating={room?.ratings}
                starRatedColor="crimson"
                numberOfStars={5}
                name='rating'
                starSpacing='1px'
                starDimension='20px' 
                />
      <span className="no-of-reviews">({room?.numOfReviews} Reviews)</span>
    
    </div>
      
    <RoomImageSlider images={room?.images}/>

    <div className="row my-5">
      <div className="col-12 col-md-6 col-lg-8">
        <h3>Description</h3>
        <p>{room?.description} </p>

        {/* <!-- RoomFeatures Component --> */}
         <RoomFeatures room={room}/>
        {/* <!-- End RoomFeatures Component --> */}
 </div>

      <div className="col-12 col-md-6 col-lg-4">
       <BookingDatePicker room={room}/>
         
        {/* <!-- Room Location Map (if available) goes here --> */}
      </div>
    </div>

    <NewReview roomId={room?._id} />
    <ListReviews reviews={room?.reviews}/>
  
  </div>
  )
}

export default RoomDetails