import React, { useState } from 'react'
import logo from '../images/CareerLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import Alertmessage from '../Alertmessage'
import axios from 'axios';
import CryptoJS from 'crypto-js';

export default function CandidateLogin() {
    const [loginDetails,setLoginDetails]=useState({username:'',password:''})
    const [alertMessage,setAlertMessage]=useState(false)

    const handlerAlertMessage=((message,type)=>{
        setAlertMessage({message:message,type:type})



        setTimeout(() => {
            setAlertMessage(false)
            
        }, 3000);
    
    })
    const navigate=useNavigate()
    const InputHandler=((e)=>{
        const {name,value}=e.target
        setLoginDetails({...loginDetails,[name]:value});

    })
    const handlerLogin=(async(e)=>{
        e.preventDefault();
        console.log('this is call ',loginDetails)
        if(loginDetails.username && loginDetails.password){

            try{
                // const baseUrl=process.env.REACT_APP_API_URL_LOCAL;
                const baseUrl = process.env.REACT_APP_API_URL_LOCAL;
                

                
                console.log('this is base url',baseUrl)
                const response=await axios.post(`${baseUrl}/login/CandidateLogin`,loginDetails)
                console.log('this is candidate response login',response.data)
                if(response.data.success){
                    const encryptionkey=new Date()
                    const encryptiontoken=CryptoJS.AES.encrypt(JSON.stringify(response.data.data),encryptionkey.toDateString()).toString();
                    //const userdetails=CryptoJS.AES.encrypt(JSON.stringify(response.data.data.companyDetail),encryptionkey.toDateString()).toString();

                    // sessionStorage.setItem('authToken',response.data.accessToken),JSON.stringify(response.data.data.companyDetail)
                    sessionStorage.setItem('candidatedetails',encryptiontoken)
                    // console.log('this is comp detail',response.data.data.companyDetail)
                    // sessionStorage.setItem('details',userdetails)
                    
                    navigate('/candidate/dashboard')

                }
                else{
                    handlerAlertMessage(String(response.data.message),"danger")
                    setLoginDetails({username:'',password:''})
                }
                
                
                
            }
            catch(err){
                console.log('this is error message',err)
                handlerAlertMessage("something wrong","danger")

            }
            //console.log('this is user name',loginDetails.username)
            // if(loginDetails.username==='pranaysingh045@gmail.com'){
            //     navigate('/Dashboard')
            // }
            // else{
            //     handlerAlertMessage("User not exists","danger")

            // }
        }
        else{
            handlerAlertMessage("User and password is required","danger")
        }

    })
  return (
    <>
    <div className='conatiner Login_mainContainer'>
        <div className='row LoginContainerRow'>
            
            {/* <div className='col-md-4 leftLoginbox' >
                <div className='leftParentcontener'>
                    <div className='row '>
                    <img src={logo} className='companyLogo img-fluid imglogo'  />

                    </div>
                <div className='leftBoxText'>
                Transform Your Hiring Process with CareerpageXP - Where Dreams Find Their Career!
                <span>👋</span>
                </div>

                </div>
                
            

            </div> */}
            
            <div className='col-md-4  m-auto'>
                {/* <div className='row justify-content-center '>
                    <img src={logo} className='companyLogo img-fluid imglogo'  />

                
                </div> */}
                
                
                <div className='row'>
                    <h2 className='loginTextheader'>Candidate Login</h2>
                    <p>Please enter your details to access your account</p>
                </div>
                <div className='row'>
                    {alertMessage?<Alertmessage message={alertMessage} />:''}

                </div>

                <div className='row bg-secondar'>
                    <form onSubmit={handlerLogin}>

                    <div className='form-group  my-2'>
                        <label className='' id='email'>Email</label>
                        <input className='form-control' value={loginDetails && loginDetails.username} required maxLength={25} name='username' type='email' onChange={InputHandler} placeholder='Enter Email' />
                    </div>
                    <div className='form-group  my-2'>
                        <label id='password'>Password</label>
                        <input className='form-control' value={loginDetails && loginDetails.password} type='password' required maxLength={30} name='password' onChange={InputHandler} placeholder='Enter Password' />
                        {/* <span className='text-mute passwordnotifi'>Password must be 8 characters</span> */}
                    </div>
                    
                    
                    <div className='form-group'>
                    <button className='btn loginbtn mt-3 m-auto form-control' type='submit'>Sign in</button>

                    </div>
                    <div className='col-md-8 login_forgetPasColumn mt-3'>
                        <a href='#'>Forgot password?</a>
                        <p><Link to='/candidate/registration'>Signup</Link></p>

                    </div>
                    </form>
                    {/* <p className=''>By clicking sign in, you agree to the careerpageXP <a href='#'>Terms of Service & Privacy policy</a></p> */}
                    

                </div>
                {/* <div className='row'>
                    <p>Not an enterprise user? Go to 
                </div> */}
        

            </div>
        </div>
        
      </div>

    </>
  )
}
