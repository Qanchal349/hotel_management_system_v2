'use client';
import Link from 'next/link'
import React, { useEffect } from 'react'
import {signOut,useSession} from "next-auth/react" 
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setIsAuthenticated, setUser } from '@/redux/features/userSlice';

const Header = () => {

const dispatch = useAppDispatch()
const {user} = useAppSelector((state)=>state.auth)  


const {data} = useSession() 

 useEffect(() => {
     if(data){
        dispatch(setUser(data?.user)) 
        dispatch(setIsAuthenticated(true))  
     }
 }, [dispatch,data])
 
const logoutHandler = ()=>{
   signOut();
}


  return (
    <nav className="navbar sticky-top py-2">
    <div className="container">
      <div className="col-6 col-lg-3 p-0">
        <div className="navbar-brand">
          <Link href="/" style={{textDecoration:"none",color:"crimson",fontWeight:"bold",fontFamily:"revert",textShadow: "2px 2px #d8d7d7"}}>
            Bookit.
          </Link>
        </div>
      </div>

      <div className="col-6 col-lg-3 mt-3 mt-md-0 text-end">
         {user ? (
            <div className="ml-4 dropdown d-line">
            <button
              className="btn dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <figure className="avatar avatar-nav">
                <img
                  src= {user?.avatar ? user?.avatar?.url :"/images/default_avatar.jpg"}
                  alt=""
                  className="rounded-circle placeholder-glow"
                  height="50"
                  width="50"
                />
              </figure>
              <span className="placeholder-glow ps-1">{user?.name}</span>
            </button>
  
            <div
              className="dropdown-menu w-100"
              aria-labelledby="dropdownMenuButton1"
            >
              {user?.role==='admin' && <Link href="/admin/dashboard" className="dropdown-item">Dashboard</Link>}
              <Link href="/bookings/me" className="dropdown-item">My Bookings</Link>
              <Link href="/me/update" className="dropdown-item">Profile</Link>
              <Link href="/" onClick={logoutHandler}  className="dropdown-item text-danger">Logout</Link>
            </div>
          </div>
         ):(
           <> 
             {data===undefined && (
                <div className="placeholder-glow">
                   <figure className="avatar avatar-nv placeholder bg-secondary"></figure>
                   <span className="placeholder w-25 bg-secondary ms-2"></span>
                </div>
             )}
             { data===null && <Link href="/login" className='btn btn-danger px-4 text-white login-header-btn float-right'>Login</Link>}
           </>
           )}
        
      </div>
    </div>
  </nav>
  )
}

export default Header