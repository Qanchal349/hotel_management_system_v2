'use client';
import { IRoom } from '@/backend/models/room';
import { calculateDaysOfStay } from '@/helpers/helpers';
import {useGetBookedDatesQuery, useLazyCheckBookingAvailabilityQuery, useLazyStripeCheckoutQuery, useNewBookingMutation } from '@/redux/api/bookingApi';
import React , {useState,useEffect} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ButtonLoader from '../layout/ButtonLoader';
import { useAppSelector } from '@/redux/hooks';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';



interface Props{
   room:IRoom 
}



const BookingDatePicker = ({room}:Props) => {

 const [checkInDate, setCheckInDate] = useState(new Date())
 const [checkOutDate, setCheckOutDate] = useState(new Date())
 const [daysOfStay, setDaysOfStay] = useState(0)
 const [newBooking] = useNewBookingMutation()
 const {isAuthenticated} = useAppSelector((state)=>state.auth)
 const router = useRouter()

 const [stripeCheckout,{error,isLoading,data:checkoutData}] = useLazyStripeCheckoutQuery()
 const [checkBookingAvailability,{data}] = useLazyCheckBookingAvailabilityQuery()
 const {data:{bookedDates:dates}={}} = useGetBookedDatesQuery(room._id)

 const excludeDates = dates?.map((date:string)=> new Date(date))||[] // change string dates into Date object
 console.log(checkoutData?.url)
 const isAvailable = data?.isAvailable


 const onChange = (dates:Date[])=>{
    const [checkInDate,checkOutDate]  = dates
    setCheckInDate(checkInDate);
    setCheckOutDate(checkOutDate) 

    if(checkInDate && checkOutDate){
       const days = calculateDaysOfStay(checkInDate,checkOutDate);
       setDaysOfStay(days)
       checkBookingAvailability({
          id:room._id,
          checkInDate:checkInDate.toISOString(),
          checkOutDate:checkOutDate.toISOString()
       })
    }
 }


   useEffect(() => {
      
   if(error && "data" in error){
       //@ts-ignore
       toast.error(error?.data?.errMessage) ; 
   }
   
   if(checkoutData){
      booking()
      router.replace(checkoutData?.url);   
   }
   
   }, [error,checkoutData])
  


 const bookRoom = async() =>{
    const amount = room.pricePerNight*daysOfStay

    const checkOutData = {
       checkInDate:checkInDate.toISOString(),
       checkOutDate:checkOutDate.toISOString(),
       daysOfStay,
       amount
    };
    stripeCheckout({id:room?._id,checkOutData})
 }

 


 
 const booking = async() =>{
    const bookingData = {
       room:room?._id,
       checkInDate,
       checkOutDate,
       daysOfStay,
       amountPaid:room.pricePerNight*daysOfStay,
       paymentInfo:{
          id:"Payment Id",
          status:"ACTIVE"
       }
    }

   await newBooking(bookingData)
 }



  return (
     
      <div className="booking-card shadow p-4">
            <p className="price-per-night"><b>${room?.pricePerNight}</b> / night</p>
            <hr />
            <p className="mt-1 mb-3">Pick Check In & Check Out Date</p>
            <DatePicker
              className="w-100"
              selected={checkInDate}
              onChange={onChange}
              startDate={checkInDate}
              endDate={checkOutDate}
              excludeDates={excludeDates} 
              minDate={new Date()}
              selectsRange
              inline
            />

        {isAvailable===true && (
          <div className="alert alert-success my-3">
                 Room is Available. Book now
          </div>
        )}
         {isAvailable===false && (
          <div className="alert alert-danger my-3">
                 Room is not Available.Try different dates.
          </div>
        )}
         {isAvailable && !isAuthenticated && (
          <div className="alert alert-danger my-3">
                 Login to book room.
          </div>
        )}

       {isAvailable && isAuthenticated && 
       <button className="btn py-2 form-btn w-100" disabled={isLoading} onClick={bookRoom} >
            {isLoading ? <ButtonLoader/> : `Pay $${daysOfStay*room?.pricePerNight}`} 
       </button>
       }
   </div>
  
  )
}

export default BookingDatePicker