'use client';
import { IBooking } from '@/backend/models/booking'
import { useDeleteBookingMutation } from '@/redux/api/bookingApi';
import { MDBDataTable } from 'mdbreact'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';


 interface Props {
     data:{
        bookings:IBooking[] 
     }
 }

  const AllBookings = ({data}:Props) => {
  
  const bookings = data?.bookings 
  const [deleteBooking,{error,isLoading,isSuccess}]  =  useDeleteBookingMutation()
  const router = useRouter()

  useEffect(() => {
    if(error && "data" in error){
        //@ts-ignore
         toast.error(error?.data?.errMessage)
    } 
    if(isSuccess){
        router.refresh();
        toast.success("Booking Deleted")
    }

   }, [error,isSuccess])


  const setBookings =()=> {
    const data:{columns:any[],rows:any[]} ={
        columns:[
            {
                label:"ID",
                field:'id',
                sort:"asc"
            },
            {
                label:"Amount Paid",
                field:'amountpaid',
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

  bookings.forEach((booking)=>{
      data?.rows?.push({
          id:booking._id,
          amountpaid:`$${booking?.amountPaid}`,
          _actions: (
              <>
                                                                  {/* // <i className="fa fa-eye"></i> */}
                  <Link href={`/bookings/${booking?._id}`} className='btn btn-primary'>👁‍🗨</Link>
                  <Link href={`/bookings/invoice/${booking?._id}`} className='btn btn-success ms-2'><i className="fa fa-receipt"></i></Link>
                  <button className="btn btn-outline-danger mx-2"  disabled={isLoading} onClick={()=>deleteBookingHandler(booking?._id)} ><i className="fa fa-trash"></i> </button>
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
 
 
  const deleteBookingHandler=(id:string)=>{
       deleteBooking(id)
  }


  return (
    <div className='container'>
         <h4 className='my-5'> All Bookings </h4>

         <MDBDataTable
          data={setBookings()}
          className="px-3"
          bordered
          striped
          hover
         
         />
    </div>
  )
}

export default AllBookings