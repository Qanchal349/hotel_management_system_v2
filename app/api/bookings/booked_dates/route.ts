import dbConnect from "@/backend/config/dbConnect";
import { getRoomBookedDates, newBooking } from "@/backend/controllers/bookingController";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse} from "next/server";


interface RequestContext{} 
const router = createEdgeRouter<NextRequest,RequestContext>() ;


dbConnect();

router.get(getRoomBookedDates) 

export async function GET(request:NextRequest,ctx:RequestContext):Promise<NextResponse> {
   return router.run(request,ctx) as Promise<NextResponse>
}
