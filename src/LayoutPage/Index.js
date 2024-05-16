import React, { useEffect, useState } from 'react'
import Header from './Header'
import LeftMenu from './LeftMenu'
import { Navigate, Outlet } from 'react-router-dom'
import EncryptDecry from '../AuthFolder/EncryptDecry'

export default function Index() {
    const [toggle,settoggle]=useState(false)
    const [userdetails,setUserdetails]=useState(null)
    const sidemenuClass=toggle?'sideNavbarMobile':'sideNavbar'
    const mainBodyClass=toggle?'mainContentMobile':'mainContent'

    const Menuclosefun=(()=>{
        settoggle(!toggle)
    })

    // useEffect(()=>{
    //     const details=sessionStorage.getItem('userdetails')
    //     if(details){
    //         const decryptdetails=EncryptDecry(details)
    //         const userdetails=JSON.parse(decryptdetails)
    //         setUserdetails(userdetails)

    //     }
        
    //     //setApprover(userdetails.companyDetail.isApproved)
    //     //const isAuthenticate=!!userdetails.refreshToken

    // },[])
    
    const details=sessionStorage.getItem('userdetails')
    if(details){
        const decryptdetails=EncryptDecry(details)
        const userdetails=JSON.parse(decryptdetails)
        //setUserdetails(userdetails)
        const isAuthenticate=!!userdetails.refreshToken
        console.log('this is nav bbar',userdetails)
        if(!isAuthenticate){
            
            return <Navigate to='/' replace />
        }

    }
    else{
        return <Navigate to='/' replace />

    }
    
    //setApprover(userdetails.companyDetail.isApproved)
    // //const isAuthenticate=!!userdetails.refreshToken
    //     console.log('this is nav bbar',userdetails)
    //     if(!userdetails){
            
    //         return <Navigate to='/' replace />
    //     }
        
        
    

    
    
    //console.log('this is approved or not ',userdetails.companyDetail.isApproved)
    

    
    
  return (
    <>
    <div className='container-fluid'>
        <div className='row shadow-sm'>
            <Header closefun={Menuclosefun} />
        </div>
        <div className='row '>
            <div className={`sideNavbar ${sidemenuClass}`}>
                <LeftMenu closefun={toggle}  />

            </div>
            <div className={`mainContent ${mainBodyClass}`}>
                <Outlet/>
                
            </div>
        </div>
    </div>
    
    </>
  )
}
