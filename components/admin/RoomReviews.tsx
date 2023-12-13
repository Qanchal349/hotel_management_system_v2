'use client';
import { IReview } from '@/backend/models/room';
import { revalidateTag } from '@/helpers/revalidate';
import { useDeleteRoomReviewMutation, useLazyGetRoomReviewsQuery } from '@/redux/api/roomApi';
import { MDBDataTable } from 'mdbreact';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';



const RoomReviews = () => {
  const [roomId, setRoomId] = useState("")
  const router = useRouter();
  const [getRoomReviews,{error,data}] = useLazyGetRoomReviewsQuery()
  const [deleteRoomReview,{isSuccess}] = useDeleteRoomReviewMutation()
  const reviews = data?.reviews || []

  const getRoomReviewHandler=()=>{
      getRoomReviews(roomId);  
  }

  useEffect(() => {
    if (error && "data" in error) {
       //@ts-ignore
      toast.error(error?.data?.errMessage);
    }
    if (isSuccess) {
      revalidateTag("RoomDetails")
      router.refresh();
      toast.success("Review Deleted");
    }

  }, [error,isSuccess])

 
  const deleteReviewHandler =(id:string)=>{
       deleteRoomReview({id,roomId})
  }
  

  const setReviews =()=> {
    const data:{columns:any[],rows:any[]} ={
        columns:[
            {
                label:"Room ID",
                field:'id',
                sort:"asc"
            },
            {
                label:"Rating",
                field:'rating',
                sort:"asc"
            },
            {
                label:"Comment",
                field:'comment',
                sort:"asc"
            },
            {
                label:"Actions",
                field:'actions',
                sort:"asc"
            },
        ],
        rows:[]
    }

  reviews?.forEach((review:IReview)=>{
      data?.rows?.push({
           id:review._id,
           rating: review?.rating,
           comment: review?.comment,
          _actions: (
              <>
                <button className='btn btn-outline-danger ms-2' 
                  onClick={()=>deleteReviewHandler(review?._id)} 
                ><i className="fa fa-trash"></i></button>
              </>
          ),
          get actions() {
              return this._actions;
          },
          set actions(value) {
              this._actions = value;
          },
      })
  })

    return data;
}
 




  return (
       
   <div>
    <div className="row justify-content-center mt-5">
      <div className="col-6">
        <div className="form-check">
          <label htmlFor="roomId_field">Enter Room ID</label>
          <input
            type="text"
            id="roomId_field"
            className="form-control"
            value={roomId}
            onChange={(e)=>setRoomId(e.target.value)}
          />

          <button className="btn form-btn w-100 py-2 mt-3"
             onClick={getRoomReviewHandler}
          >Fetch Reviews</button>
        </div>
      </div>
    </div>

   

   {reviews?.length > 0 ? (
       <MDBDataTable
       data={setReviews()}
       className="px-3"
       bordered
       striped
       hover
      
      />
   ):(
     roomId!=="" &&  <h5 className="mt-5 text-center">No Reviews</h5>
   )}


  </div>

  )
}

export default RoomReviews