import React, { useEffect, useState } from 'react'
import profileimage from '../images/Logo_164.jpg'
import companylogo from '../images/CareerLogo.png'
import { Link,  useNavigate } from 'react-router-dom'
import DecryptFunction from '../../AuthFolder/DecryptFunction'

export default function HeaderC(props) {
  const [loginuser,setLoginuser]=useState(false)
  const navigat=useNavigate()
  
  const handlerLogout=(async()=>{
    console.log('cand logout')
    sessionStorage.removeItem('candidatedetails');
    navigat('/candidate/login')
    console.log('cand last logut m')  
  })
  useEffect(()=>{
    const userdetails=DecryptFunction()
    const loginuser=userdetails.candidateDetail.emailID
    setLoginuser(loginuser)
    

  },[])
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
        <img src={profileimage} alt="Logo" style={{width:'40px'}} className='profileLogo'  /> <spa>{loginuser && loginuser} </spa>
      </span>
      <ul class="dropdown-menu shadow ">
        
        <li><h5 class="dropdown-header">userid</h5></li>
        <li><Link class="dropdown-item" to="/candidate/profile">Profile</Link></li>
        <li class="nav-item">
          <Link class="dropdown-item" to="/candidate/setting">Setting</Link>
        </li>
        <li><span class="dropdown-item" to='' onClick={handlerLogout} >Logout</span></li>
      
      </ul>
     </div>
  </div>
</nav>
    
    </>
  )
}
