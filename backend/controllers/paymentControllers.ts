import { NextRequest, NextResponse } from "next/server";
import { catchAsyncErrors } from "../middlewares/catchAsyncError";
import Room from "../models/room";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Generate stripe checkout session   /api/payment/checkout_session/:roomId
export const stripeCheckoutSession = catchAsyncErrors(async(req:NextRequest,{params}:{params:{id:string}})=>{
   
  const {searchParams} = new URL(req.url);
  const checkInDate = searchParams.get("checkInDate");
  const checkOutDate = searchParams.get("checkOutDate");
  const daysOfStay = searchParams.get("daysOfStay");
  const roomAmount = searchParams.get("amount");

  // Get room details 
  const room = await Room.findById(params.id)

  // create stripe checkout session 
  const session = await stripe.checkout.sessions.create({
     payment_method_types:['card'],
     success_url:`${process.env.API_URL}/bookings/me`,
     cancel_url:`${process.env.API_URL}/room/${room?._id}`,
      //@ts-ignore
     customer_email:req.user.email ,
     client_reference_id:params?.id,
     metadata:{checkInDate,checkOutDate,daysOfStay}, 
     mode:"payment",
     line_items:[
          {
             price_data:{
                currency:"usd",
                unit_amount:Number(roomAmount)*100,
                product_data:{
                    name:room?.name,
                    description:room?.description ,
                    images:[`${room?.images[0]?.url}`]
                },
                
             },
             quantity:1
          }
     ]

  })
    return NextResponse.json(session)

})





