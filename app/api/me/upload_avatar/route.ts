import dbConnect from "@/backend/config/dbConnect";
import { uploadUserAvatar} from "@/backend/controllers/authController";
import { isAuthenticatedUser } from "@/backend/middlewares/auth";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse} from "next/server";


interface RequestContext{} 
const router = createEdgeRouter<NextRequest,RequestContext>() ;


dbConnect();

router.use(isAuthenticatedUser).put(uploadUserAvatar)  

export async function PUT(request:NextRequest,ctx:RequestContext):Promise<NextResponse> {
   return router.run(request,ctx) as Promise<NextResponse>    
}