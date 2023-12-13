import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
   
    const secret = request.nextUrl.searchParams.get('secret')
    const tag = request.nextUrl.searchParams.get("tag");

    if(secret!==process.env.REVALIDATE_TOKEN){
         return NextResponse.json({
             errMessage:"Invalid Secret"
         },{status:401})
    }
  
    if(!tag){
        return NextResponse.json({
            errMessage:"Missing Tag Param"
        },{status:400})  
    }

  revalidateTag(tag)
  return NextResponse.json({
     revalidateTag:true, now:Date.now()
  })

}