import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import Booking, { IBooking } from "../models/booking";
import Moment from "moment"
import {extendMoment} from "moment-range"
import ErrorHandler from "../utils/errorHandler";
//import moment from "moment";


const moment = extendMoment(Moment) 

// create new booking 
export const newBooking = catchAsyncErrors(async(req:NextRequest)=>{
     
    const body = await req.json();
    const {room,checkInDate,checkOutDate,daysOfStay,amountPaid,paymentInfo}=body;

    const booking = await Booking.create({
        room,checkInDate,checkOutDate,
        daysOfStay,amountPaid,paymentInfo ,
         //@ts-ignore
        user:req.user._id ,
        paidAt:Date.now()
    })

    return NextResponse.json({
        booking
    })

})




// check Room Availability    /api/bookings/check
export const checkRoomAvailability = catchAsyncErrors(async(req:NextRequest)=>{
     
    const {searchParams} = new URL(req.url) 
    const roomId = searchParams.get('roomId') 
    const checkInDate = new Date(searchParams.get('checkInDate') as string)
    const checkOutDate = new Date(searchParams.get('checkOutDate') as string)

    const bookings:IBooking[] = await Booking.find({
         room:roomId,
         $and:[
            {checkInDate:{$lte:checkOutDate}} ,
            {checkOutDate:{$gte:checkInDate}} ,
         ]
    })
 
    const isAvailable:boolean = bookings.length===0 

    return NextResponse.json({
        success:true,
        isAvailable 
    })

})



// get room booked date     /api/bookings/get_booked_dates 
export const getRoomBookedDates = catchAsyncErrors(async(req:NextRequest)=>{
     
    const {searchParams} = new URL(req.url) 
    const roomId = searchParams.get('roomId')

    const bookings = await Booking.find({room:roomId})
    const bookedDates = bookings.flatMap((booking)=> Array.from(
        moment.range(moment(booking.checkInDate),moment(booking.checkOutDate)).by('day')
    )) 
   
    return NextResponse.json({
        success:true,
        bookedDates
    })

})


// Get current user bookings    /api/bookings/me
export const myBookings = catchAsyncErrors(async(req:NextRequest)=>{

    //@ts-ignore
    const bookings = await Booking.find({user:req.user._id})
    return NextResponse.json({
        success:true,
        bookings
    })

})


// get booking details            /api/bookings/:id
export const getBookingDetails = catchAsyncErrors(async(req:NextRequest,{params}:{params:{id:string}})=>{

    const booking = await Booking.findById(params.id).populate("user room")
     //@ts-ignore
    if(booking.user?._id.toString()!==req.user._id && req?.user?.role!=="admin"){
        throw new ErrorHandler("You cannot view this booking",403) 
    }
    return NextResponse.json({
        success:true,
        booking
    })

})


// get Last 6months sales  
export const getLastSixMonthsSales = async()=>{
    const last6MonthsSales:any = [];
    const currentDate = moment();

    async function fetchSalesForMonths(startDate:moment.Moment,endDate:moment.Moment){
       const result = await Booking.aggregate([
          // stage 1 Filter data 
          {
               $match:{
                 createdAt:{$gte:startDate.toDate(),$lte:endDate.toDate()}
               }
          },

          // stage 2 group data 
          {
             $group:{
                 _id:null,
                 totalSales:{$sum:"$amountPaid"},
                 numberOfBookings:{$sum:1}
             }
          }
       ]) 
       
    const {totalSales,numberOfBookings} = result?.length > 0 ? result[0]:{totalSales:0,numberOfBookings:0}
    last6MonthsSales.push({
          monthName:startDate.format("MMM"),
          totalSales,
          numberOfBookings
       })
    }

    for(let i=0 ; i<6; i++){
      const startDate = moment(currentDate).startOf("month");
      const endDate = moment(currentDate).endOf("month");
      await fetchSalesForMonths(startDate,endDate);
      currentDate.subtract(1,"months") 
    }
   return last6MonthsSales;
}


// get top performing rooms
const getTopPerformingRoom = async(startDate:Date,endDate:Date)=>{
    const topRooms = await Booking.aggregate([
          {
             // Filter documents
             $match:{
                createdAt:{$gte:startDate,$lte:endDate}  
             },
          },
          {
            // Group Documents
             $group:{
                 _id:"$room",
                 bookingsCount:{$sum:1}
             }
          },
          {
            // Sort documents by bookingsCount in desc order 
              $sort:{
                 bookingsCount:-1
              }
          },
          { 
            // Limit the documents
            $limit:3 // top 3 
          },

          {  
            // Retrieve additional data from rooms collection like room name 
              $lookup:{
                 from:"rooms",
                 localField:"_id",
                 foreignField:"_id",
                 as:"roomData"
              }
          },
          {  
             // takes rooms data and deconstruct into documents  
             $unwind:"$roomData"
          },
          {
             //  Shape the output documents 
             $project:{
                 _id:0,
                 roomName:"$roomData.name",
                 bookingsCount:1
             }
          }

    ])   
   return topRooms;
}


// get SaleStats         => /api/admin/sales_stats
export const getSalesState = catchAsyncErrors(async(req:NextRequest)=>{
    const {searchParams}  = new URL(req.url) 
    const startDate = new Date(searchParams.get('startDate') as string);
    const endDate = new Date(searchParams.get('endDate') as string)
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);

    const bookings = await Booking.find({
        createdAt:{$gte:startDate,$lte:endDate} ,
    })

    const numberOfBookings = bookings.length 
    const totalSales = bookings.reduce((acc,booking)=> acc+booking.amountPaid,0)
    const sixMonthsSalesData = await getLastSixMonthsSales() 
    const topRooms = await getTopPerformingRoom(startDate,endDate);
    
    return NextResponse.json({
        numberOfBookings,
        totalSales,
        sixMonthsSalesData,
        topRooms
    })

})


// Get admin bookings   => /api/admin/bookings
export const allAdminBookings = catchAsyncErrors(async(req:NextRequest)=>{
     
    const bookings = await Booking.find();
    return NextResponse.json({
        bookings
    })

})



// delete admin bookings   => /api/admin/bookings/:id 
export const deleteBooking = catchAsyncErrors(async(req:NextRequest,{params}:{params:{id:string}})=>{
    const booking = await Booking.findById(params.id)

    if(!booking)
      throw new ErrorHandler("Booking not found with this id",404)
 
    await booking?.deleteOne();
    return NextResponse.json({
        success:true 
    })

})

