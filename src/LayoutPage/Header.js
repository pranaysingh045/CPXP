import React, { useEffect, useState } from 'react'
import profileimage from '../images/Logo_164.jpg'
import companylogo from '../images/CareerLogo.png'
import { Link,  useNavigate } from 'react-router-dom'
import encryptDecry from '../AuthFolder/EncryptDecry'
import EncryptDecry from '../AuthFolder/EncryptDecry'
export default function Header(props) {
  const navigate=useNavigate()
  const [companydetails,setCompanydetails]=useState()

  useEffect(()=>{
    
    const details=sessionStorage.getItem('userdetails')
    const decryptdetails=EncryptDecry(details)
    const userdetails=JSON.parse(decryptdetails)
    if(userdetails){
      
    setCompanydetails(userdetails.companyDetail)
    

    }
    

  },[])

  const LogOut=(()=>{
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('details')
    navigate('/')

  })
  return (
    <>
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
  <div class="container-fluid">
    <Link class="navbar-brand" href="javascript:void(0)"><img src={companylogo} className='img-fluid companyLogo'/></Link>
    <button className='btn btn-primary mobilemenubutton' onClick={props.closefun}>Close</button>
    
    <div>
    <i class="fa-regular fa-bell"></i>
    </div>
    <div class="dropdown profiledropdownmain_div">

      <span class=" dropdown-toggle profiledropdown" data-bs-toggle="dropdown">
        <img src={profileimage} alt="Logo" style={{width:'40px'}} className='profileLogo'  /> <spa>{companydetails && companydetails.emailID} </spa>
      </span>
      <ul class="dropdown-menu shadow ">
        
        <li><h5 class="dropdown-header">CompID-{companydetails && companydetails.companyID}</h5></li>
        <li><Link class="dropdown-item" to="/Profile">Profile</Link></li>
       {companydetails && companydetails.isApproved? <li class="nav-item">
          <Link class="dropdown-item" to="/setting">Setting</Link>
        </li>:''}
        <li><Link class="dropdown-item" to="" onClick={LogOut}>Logout</Link></li>
      
      </ul>
     </div>
  </div>
</nav>
    
    </>
  )
}
