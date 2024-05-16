import React, { useState } from 'react'

import logo from '../images/CareerLogo.png';
import EmployerDetails from './EmployerDetails';
import Alertmessage from '../Alertmessage';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from '../images/Spinner.svg'


export default function Signup(props) {
    const [IsotVerif,setOtpVerify]=useState(false)
    const [alertMessage,setAlertMessage]=useState(false)
    const [showEmailOtpModal,setEmailOtpModal]=useState(false)
    const [verficationEmail,setVerificationEmail]=useState(null)
    const [EmailVerifiCode,setVerificationCode]=useState('')
    const [spinner,setSpinner]=useState(false)

    
   
    const closeModel=(()=>{
        setEmailOtpModal(false)
        setVerificationCode('')
    })
   
// Email verification
    const handlerSendEmailVerif=(async(e)=>{
        e.preventDefault()

        try{
            if(verficationEmail){
                const baseUrl = process.env.REACT_APP_API_URL_LOCAL;
                if(!validateEmail()){
                    handlerAlertMessage('Please enter valid bussiness email','danger')
                    return false
                }                // {'pEmail':verficationEmail}
                console.log('this is verifi em')
                setSpinner(true)
                const response=await axios.post(`${baseUrl}/Register/EmployerEmailVerification`,{'emailID':verficationEmail})
                console.log('this is verificatiom emai',response)
                if (response.data.statusCode===200){
                    
                    //handlerAlertMessage(response.data.message,'success')
                    //set response code after getting and pass in popu 
                    setEmailOtpModal(true) //open model

                }
                else if(response.data.statusCode===401){
                    handlerAlertMessage(String(response.data.message),'danger')

                }
                setSpinner(false)
            }

        }
        catch(err){
            
            handlerAlertMessage('there is some error','danger')

        }
        
    })
    // Email otp verification 
    const HandlerCheckVerificationOtp=(async(e)=>{
        e.preventDefault()
        console.log('this is verification code',EmailVerifiCode)
        if(EmailVerifiCode){
            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                const response=await axios.post(`${baseUrl}/Register/EmployerVerificationCode`,{'emailID':verficationEmail,'verificationCode':EmailVerifiCode})
                console.log('this is vercd',response)
                console.log('response.data.statusCode',response.data.statusCode)
                if(response.data.statusCode===200){
                    //show alert message email verification sucussfuly and open employer details
                    
                    //setAlertMessage(response.data.message)
                    setOtpVerify(true)
                    setVerificationCode('')

                }
                else if(response.data.statusCode===401){
                    handlerAlertMessage(response.data.message,'danger')
                    setVerificationCode('')

                }

            }
            catch(error){

                console.log('this is email verification error',error)

            }

            
            console.log('verfy otp suc')
           
        }
    })

    const validateEmail=()=>{
        const email=/^[a-zA-Z0-9.%+-]+@(?!gmail\.com|hotmail\.com|icloud\.com\|outlook\.com|yahoo\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!email.test(verficationEmail)){
            
            return false
        }
        else{
            return true
        }


    }

    const handlerAlertMessage=((message,type)=>{
        setAlertMessage({message:message,type:type})



        setTimeout(() => {
            setAlertMessage(false)
            
        }, 3000);
    
    })
  return (
    <div className='conatiner '>
        
        <div className='row LoginContainerRow'>
            <div className='col-md-4 leftLoginbox' >
                <div className='leftParentcontener'>
                    <div className='row '>
                    <img src={logo} className='companyLogo img-fluid imglogo'  />

                    </div>
                <div className='leftBoxText'>
                Transform Your Hiring Process with CareerpageXP - Where Dreams Find Their Career!
                {/* Welcome  to CareerpageXP, find and hire best talent with CareerpageXP platform! */}
                <span></span>
                </div>

                </div>
                
            

            </div>
            {spinner && <div className='col-md-4  m-auto'>
                <img src={Spinner}  className='d-flex m-auto' />
            </div>}
            {!IsotVerif && !spinner?
            <div  className='col-md-4 m-auto  shadow rounded py-5 px-5'>
                
            <div className='row'>
                {!showEmailOtpModal && alertMessage ? <div className='col-md-12 my-2'>
                    <Alertmessage message={alertMessage} />

                </div>:''}
                <form onSubmit={handlerSendEmailVerif} className='was-validated'>

                <div className='col-md-12 my-2'>
                    <label className='' id='email'>Business email </label>
                    <input className='form-control' maxLength={50}  onChange={((e)=>{setVerificationEmail(e.target.value)})} type='email' placeholder='Enter Email' required />
                </div>
                <div className='col-md-12'>
                   <button type='submit' className='btn form-control loginbtn mt-3' >Verify Email</button>
                </div>
                <p className='mt-3'>Already have an account? <Link to='/'>Login</Link></p>
                
                </form>

            </div>
            
            
        {IsotVerif && <button className='btn btn-primary mt-3'>Submit</button>}

            </div>:''}
            {IsotVerif?<div className='col-md-7 m-auto '>
            <EmployerDetails verifyemail={verficationEmail}/>
                </div>:''}
        </div>
        

{/* otp verification popup */}
<div class="modal  modalbgcolor" id="myModal"  style={{display:showEmailOtpModal?'block':'none'}}>
  <div class="modal-dialog modal modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        {!IsotVerif?<h4 class="modal-title">Email verification !</h4>:''}
        <button type="button" class="btn-close" onClick={closeModel}></button>
      </div>

      <div class="modal-body">
        {alertMessage && <div className='form-group'>
            <Alertmessage message={alertMessage} />
        </div>}
        {!IsotVerif?<form onSubmit={HandlerCheckVerificationOtp} className='was-validated'>
            <div className='form-group'>
                <p>Verification code sent to {verficationEmail}</p>
                <label className='form-label' >Enter Verification Code</label>
                <input placeholder='Enter Verification code'  required maxLength={8} value={EmailVerifiCode} onChange={((e)=>setVerificationCode(e.target.value))} type='text' className='form-control' />

            </div>
            <div className='form-group my-3'>
                <button type='submit' className='btn loginbtn form-control'>Submit</button>

            </div>

        </form>:<div className='row d-flex popupverificationOtp_icon'><span><i class="fa-solid fa-check"></i></span><p className='mt-3'>Email Verified Successfully</p></div>}
        
      </div>

      

    </div>
  </div>
</div>

        
        
      </div>

      

  )
}
