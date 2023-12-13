import {cookies} from "next/headers"

export const getAuthCookieName = () =>
process.env.NODE_ENV==='production'?"__Secure-next-auth.session-token":"next-auth.session-token"

export const getAuthHeader = () =>{

    const nextCookies = cookies()
    const nextAuthSessionToken = nextCookies.get(getAuthCookieName())

     return {
         headers:{
            Cookie:`${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`
         }
     }
}