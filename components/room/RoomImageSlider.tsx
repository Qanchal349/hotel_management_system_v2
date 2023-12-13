import { IImage } from '@/backend/models/room'
import Image from 'next/image'
import React from 'react'
import { Carousel } from 'react-bootstrap'



interface Props{
     images:IImage[]
}

const RoomImageSlider = ({images}:Props) => {



  return (
  
    <Carousel>
         {images?.length > 0 ? (
            images?.map((image)=>(
                <Carousel.Item key={image?.public_id}>
                    <div style={{width:"100%",height:'460px'}}>
                        <Image
                          className='d-block m-auto'
                          src={image?.url}
                          alt={image?.url} 
                          unoptimized
                          fill
                         /> 
                    </div>
                </Carousel.Item>
            ))
           
         ):( <Carousel.Item>
            <div style={{width:"100%",height:'460px'}}>
                <img 
                  className='d-block m-auto'
                  src=" "
                  alt="image" 
                 /> 
            </div>
        </Carousel.Item>)}
    </Carousel>
   
  )
}

export default RoomImageSlider