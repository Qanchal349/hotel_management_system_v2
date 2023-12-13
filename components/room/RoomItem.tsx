'use client' ;
import { IRoom } from '@/backend/models/room';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import StarRatings from "react-star-ratings" 




interface Props {
   room:IRoom
}

const RoomItem = ({room}:Props) => {

 

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3 d-flex">
    <div className="card p-2 w-100">
      <Image
        className="card-img-top mx-auto"
        src={room?.images?.length > 0 ? room.images[0].url:""}
        alt={room?.name}
        height={170}
        width={100}
        unoptimized
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <a href={`/rooms/${room?._id}`}>{room?.name}</a>
        </h5>
        <div className="mt-auto">
          <p className="card-text mt-2"><b>${room.pricePerNight}</b> / night</p>
        </div>
        <div>
          <div className='d-flex'>

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
          <Link className="btn view-btn mt-3 w-100" href={`/rooms/${room?._id}`}>View Details</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default RoomItem