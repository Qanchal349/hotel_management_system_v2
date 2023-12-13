import { IReview } from '@/backend/models/room'
import React from 'react'
import StarRatings from "react-star-ratings" 

interface Props{
   reviews:IReview[]
}


const ListReviews = ({reviews}:Props) => {


  return (
    <div className="reviews w-75 mb-5">
      <h6>{reviews?.length} Reviews</h6>
    <hr />
   
     {reviews?.map((review)=>(
        
        <div className="review-card my-3">
   
        <div className="row">
          <div className="col-3 col-lg-1">
            <img
              src={review?.user?.avatar?.url} 
              alt={review?.user?.name}
              width="60"
              height="60"
              className="rounded-circle"
            />
          </div>
          <div className="col-9 col-lg-11">
              <StarRatings
                rating={review?.rating}
                starRatedColor="crimson"
                numberOfStars={5}
                name='rating'
                starSpacing='1px'
                starDimension='24px' 
                />
            <p className="review_user mt-1"> by {review?.user?.name}</p>
         
            <p className="review_comment">
              {review?.comment}
            </p>
          </div>
          <hr />
        </div>
      </div>
    ))}  
  </div>
  )
}

export default ListReviews