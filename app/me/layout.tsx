import UserSidebar from '@/components/layout/UserSidebar'
import React, { ReactNode } from 'react'

interface Props {
    children:ReactNode 
}


const UserLayout = ({children}:Props) => {
  return (
     <div>
         <div className="mt-1 mb-4 bg-light py-2">
              <h5 className='text-secondary text-center'>User Settings</h5>
         </div>
         <div className="container">
             <div className="row justify-content-around">
                <div className="col-12 col-lg-3">
                     <UserSidebar/>  
                </div>
                <div className="col-12 col-lg-9 user-dashboard ">
                     {children}
                </div>
             </div>
         </div>
     </div>
  )
}

export default UserLayout