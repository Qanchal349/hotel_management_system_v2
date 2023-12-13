'use client';
import { IImage, IRoom } from '@/backend/models/room'
import { revalidateTag } from '@/helpers/revalidate';
import { useDeleteRoomImagesMutation, useUploadRoomImagesMutation } from '@/redux/api/roomApi';
import { useRouter } from 'next/navigation';
import React, {ChangeEventHandler, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ButtonLoader from '../layout/ButtonLoader';


interface Props {
     data:{
         room:IRoom
     }
}


const UploadRoomImages = ({data}:Props) => {

    const [images, setImages] = useState<string[]>([])
    const [imagesPreview, setImagesPreview] = useState<string[]>([])
    const [uploadedImages, setUploadedImages] = useState<IImage[]>([])
    const router = useRouter()

    const [uploadRoomImages,{error,isLoading,isSuccess}]  = useUploadRoomImagesMutation();
    const [deleteRoomImages,{error:deleteError,isLoading:deleteLoading,isSuccess:deleteSuccess}] = useDeleteRoomImagesMutation()

    useEffect(() => {
      if(error && 'data' in error){
         //@ts-ignore
         toast.error(error?.data?.errMessage)
      }
      if(isSuccess){
         revalidateTag("RoomDetails");
         setImagesPreview([])
         router.refresh();
         toast.success("Images Uploaded")
      }

      if(data){
          setUploadedImages(data?.room?.images)
      }

    }, [error,isSuccess,data])


    useEffect(() => {
      if(deleteError && 'data' in deleteError){
         //@ts-ignore
         toast.error(deleteError?.data?.errMessage)
      }
      if(deleteSuccess){
         revalidateTag("RoomDetails");
         setImagesPreview([])
         router.refresh();
         toast.success("Images Deleted")
      }

    }, [deleteError,deleteSuccess])
    


   const onChange:ChangeEventHandler<HTMLInputElement> = (e) =>{
      const files = Array.from(e.target.files || []);
      setImages([])
      setImagesPreview([])

      files.forEach((file)=>{
         const reader = new FileReader();
         reader.onload=()=>{
             if(reader.readyState===2){
                setImages((oldArray)=> [...oldArray,reader.result as string]) 
                setImagesPreview((oldArray)=> [...oldArray,reader.result as string])  
             }
         }
         reader.readAsDataURL(file)
      })
     }


    const submitHandler = ()=>{
         uploadRoomImages({id:data?.room?._id,body:{images}})
    } 


    const removeImagePreview=(removeImgUrl:string)=>{
      const filteredImagesPreview = imagesPreview.filter((img)=>img!=removeImgUrl) 
      setImagesPreview(filteredImagesPreview) ;
      setImages(filteredImagesPreview); 
    }


    const handleImageDelete=(imgId:string)=>{
          deleteRoomImages({id:data?.room?._id,body:{imgId}}) 
    }


    return (
       
        <div>
        <div className="row wrapper">
          <div className="col-10 col-lg-7 mt-5 mt-lg-0">
            <form
              className="shadow rounded bg-body"
              onSubmit={submitHandler}
            >
              <h5 className="mb-4">Upload Room Images</h5>
  
              <div className="form-group">
                <label htmlFor="customFile" className="form-label">Choose Images</label>
  
                <div className="custom-file">
                  <input
                    type="file"
                    name="product_images"
                    className="form-control"
                    id="customFile"
                    multiple
                    required
                    onChange={onChange}
                  />
                </div>
  
             {imagesPreview?.length > 0 && 
                <div className="new-images mt-4">
                  <p className="text-warning">New Images:</p>
                  <div className="row mt-4">
                   
                   {imagesPreview?.map((img)=>(
                        <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={img} 
                            alt={img}
                            className="card-img-top p-2"
                            style={{width: "100%", height: "80px"}}

                          />
                          <button
                            style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
                            type="button"
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            onClick={()=>removeImagePreview(img)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                       </div>
                        
                   ))}
                     
                 </div>
                </div>
             }
              {uploadRoomImages?.length > 0 && 
                <div className="uploaded-images mt-4">
                  <p className="text-success">Room Uploaded Images:</p>
                  <div className="row mt-1">
                     {uploadedImages?.map((img)=>(
                            
                         <div className="col-md-3 mt-2">
                            <div className="card">
                              <img
                                src={img?.url}
                                alt={img?.url}
                                className="card-img-top p-2"
                                style={{width: "100%" ,height: "80px"}}
                              />
                              <button
                                style={{backgroundColor: "#dc3545" , borderColor: "#dc3545"}}
                                className="btn btn-block btn-danger cross-button mt-1 py-0"
                                onClick={()=>handleImageDelete(img.public_id)}
                                disabled={deleteLoading}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>
                            
                     ))}                  
                  </div>
                </div>
              }

              </div>
  
              <button
                id="register_button"
                type="submit"
                className="btn form-btn w-100 py-2"
                disabled={isLoading || deleteLoading}
              >
                 {isLoading? <ButtonLoader/> : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </div>

    )
 

}










export default UploadRoomImages