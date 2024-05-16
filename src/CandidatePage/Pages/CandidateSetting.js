import axios from 'axios'
import React, { useState } from 'react'
import Alertmessage from '../../Alertmessage'
import DecryptFunction from '../../AuthFolder/DecryptFunction'

export default function CandidateSetting() {
  const [message,setMessage]=useState({message:'',type:''})
  const handlerAlertmessage=(message,type)=>{

    setMessage({message:message,type:type})

    setTimeout(()=>{
      setMessage({message:'',type:''})
    },3000)
  }
  const [changepassword,setpassworddetails]=useState({
    'userName':'',
    'oldPassword':'',
    'newPassword':''
  })

  const handlerInput=((e)=>{
    const {name,value}=e.target
    console.log('this is value',name,value)
    setpassworddetails({...changepassword,[name]:value})

  })

  const handlerChangePassword=(async(e)=>{
    e.preventDefault();
    try{
      
    const baseUrl=process.env.REACT_APP_API_URL_LOCAL;
    const userdetails=DecryptFunction()
    const useremail=userdetails.candidateDetail.emailID
    changepassword.userName=useremail
    // later get email from session storaage
    const response=await axios.post(`${baseUrl}/Login/ChangePassword`,changepassword)
    console.log('this is respo change spass',response)
    if(response.status==200 && response.data.statusCode==200){
      setpassworddetails({
        'userName':'',
        'oldPassword':'',
        'newPassword':''
      })
      handlerAlertmessage(response.data.message,'warning')
    }

    }
    catch(error){
      handlerAlertmessage('something wrong','warning')
      console.log('this is details',changepassword)

    }
    

  })
  return (
    <div className='container'>
      <form onSubmit={handlerChangePassword}>
        { message.message!==''? <Alertmessage message={message}/>:''}
      <div className='row'>
        {/* <div className='col-md-6 mt-2'>
          <div className='form-group'>
            <label for='email'>Email</label>
            <input type='text' name='userName' onChange={handlerInput}  placeholder='email id' className='form-control' id='email' />
          </div>
        </div> */}
        <div className='col-md-8 m-auto'>
          <div className='row m-auto'>
          <div className='col-md-6 mt-2'>
          <div className='form-group'>
            <label for='oldpass'>Old password</label>
            <input type='text' name='oldPassword' onChange={handlerInput}  placeholder='old password' className='form-control' id='oldpass' />
          </div>
        </div>
        <div className='col-md-6 mt-2'>
          <div className='form-group'>
            <label for='new'>New password</label>
            <input type='text' name='newPassword' onChange={handlerInput} placeholder='email id' className='form-control' id='new' />
          </div>
        </div>
        <div className='col-md-6 my-auto py-2'>
        <button type='submit mt-3' className='btn btn-primary my-auto'>Change password</button>

        </div>
          </div>
        </div>
      </div>
      </form>

    </div>
  )
}
