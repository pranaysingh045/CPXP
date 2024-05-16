import React, { useState } from 'react'
import HeaderC from './HeaderC'
import CaLeftMenu from './CaLeftMenu'
import { Navigate, Outlet } from 'react-router-dom'

export default function Layout() {
    const [toggle,settoggle]=useState(false)
    const sidemenuClass=toggle?'sideNavbarMobile':'sideNavbar'
    const mainBodyClass=toggle?'mainContentMobile':'mainContent'
    const Menuclosefun=(()=>{
        settoggle(!toggle)
    })
  return (
    <>
    <div className='container-fluid'>
        <div className='row shadow-sm'>
            <HeaderC closefun={Menuclosefun} />
        </div>
        <div className='row '>
            <div className={`sideNavbar ${sidemenuClass}`}>
                {/* <LeftMenu closefun={toggle} /> */}
                <CaLeftMenu closefun={toggle} />

            </div>
            <div className={`mainContent ${mainBodyClass}`}>
                <Outlet/>
                
            </div>
        </div>
    </div>
    
    </>
  )
}
