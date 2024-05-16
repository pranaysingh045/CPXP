import React, { useEffect, useState } from 'react'
import { Link,Navigate } from 'react-router-dom'

import EncryptDecry from '../AuthFolder/EncryptDecry'

export default function LeftMenu() {
  const [userdetails,setUser]=useState(null)
  useEffect(()=>{
    const details=sessionStorage.getItem('userdetails')
    if(details){
        const decryptdetails=EncryptDecry(details)
        const userdetail=JSON.parse(decryptdetails)
        setUser(userdetail)
        console.log('this is left menu',userdetail)
        //setUserdetails(userdetails)
    };
  },[])

  return (
    <div className='leftmenu_parentDiv shadow w-100'>

        <div>
           {userdetails  && userdetails.companyDetail.isApproved? <ul>
                <li><span><i class="fa-solid fa-grip"></i></span><Link to='/Dashboard'>Dashboard</Link></li>
                <li><span><i class="fa-solid fa-table-columns"></i></span><Link to='/PostJob'>Post New Job</Link></li>
                <li><span><i class="fa-solid fa-list-ul"></i></span><Link to='/joblist'>My job List</Link></li>
                
            </ul>:''}

        </div>



    </div>
  )
}
