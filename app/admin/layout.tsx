import AdminSidebar from '@/components/layout/AdminSidebar'
import React, { ReactNode } from 'react'

interface Props {
    children:ReactNode 
}


const AdminLayout = ({children}:Props) => {
  return (
     <div>
         <div className="mt-1 mb-4 bg-light py-2">
              <h5 className='text-secondary text-center'>Admin Dashboard</h5>
         </div>
         <div className="container">
             <div className="row justify-content-around">
                <div className="col-3 col-lg-3">
                     <AdminSidebar/>  
                </div>
                <div className="col-9 col-lg-9 user-dashboard ">
                     {children}
                </div>
             </div>
         </div>
     </div>
  )
}

export default AdminLayout