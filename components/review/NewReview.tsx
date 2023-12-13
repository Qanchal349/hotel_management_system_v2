'use client';
import { revalidateTag } from '@/helpers/revalidate';
import {useCanUserReviewQuery, usePostReviewMutation } from '@/redux/api/roomApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import StarRatings from "react-star-ratings" 


const NewReview = ({roomId}:{roomId:string}) => {

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [postReview,{error,isSuccess}] = usePostReviewMutation();
  const {data:{canReview}={}} = useCanUserReviewQuery(roomId);
  const router = useRouter();


   useEffect(() => {
   if(error && 'data' in error){
     //@ts-ignore
      toast.error(error?.data?.errMessage) 
   }
   if(isSuccess){
      revalidateTag('RoomDetails')
      toast.success("Review Posted")
      router.refresh()
   }

   }, [error,isSuccess])
   

   const submitHandler =()=>{

     const reviewData = {
        rating,
        comment,
        roomId
     }
       postReview(reviewData) 
   }


  return (
    <>

    {canReview && (
        <button
        type="button"
        className="btn form-btn mt-4 mb-5"
        data-bs-toggle="modal"
        data-bs-target="#ratingModal"
        >
        Submit Your Review
        </button>
    )}

  <div
      className="modal fade"
      id="ratingModal"
      tabIndex={-1} 
      role="dialog"
      aria-labelledby="ratingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
       
          <div className="modal-header">
            <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* <!-- Placeholder for Review Content --> */}

            <StarRatings
                rating={rating}
                starRatedColor="crimson"
                numberOfStars={5}
                name='rating'
                starSpacing='1px'
                starDimension='20px' 
                changeRating={(e:any)=>setRating(e)}
            />
             <div className="form-floating">
                <textarea name="review_field" 
                 id="review_field" placeholder='Leave comment'
                 className="form-control mt-4"
                 style={{height:'100px'}} 
                 value={comment}
                 onChange={(e)=>setComment(e.target.value)}
                 >
                 </textarea>
                 <label htmlFor="">Comment</label>
            </div>  
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn my-3 form-btn w-100"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={submitHandler}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
 </>
  )
}

export default NewReview