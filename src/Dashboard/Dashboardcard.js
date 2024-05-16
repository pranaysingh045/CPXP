import React, { Suspense, useEffect, useReducer } from 'react'
import encryptDecry from '../AuthFolder/EncryptDecry';
import axios from 'axios';


const initialState={
    dashboradCardData:[],
    spinner:false,
    errormessage:'',
  }
const reducer=(state,action)=>{
    switch(action.type){
      case 'SET_Dashboard_CardData':
        return {...state,dashboradCardData:action.payload};
      case 'setspinner':
        return {...state,spinner:action.payload};
      case 'errormessage':
        return {...state,errormessage:{message:action.payload.message,type:action.payload.type}};
        
      default:
        return state
    }
  }

export default function Dashboardcard() {
    const [state,dispatch]=useReducer(reducer,initialState);
    useEffect(()=>{

        const fetchDashboard_CardData=(async()=>{
          
    
          try{
            // const userdetails=sessionStorage.getItem('details')
            const encryp_userdetails=sessionStorage.getItem('userdetails')
            const decrypt_userDetailsstring=encryptDecry(encryp_userdetails)
            const userdetails=JSON.parse(decrypt_userDetailsstring)
            console.log('this is dash token',userdetails)
    
            
            if(userdetails){
            //   console.log('this is user dd',userdetails)
            //  const details=encryptDecry(userdetails)
            //  const userobj=JSON.parse(details)'Content-Type': 'application/json'
            
            
            const baseUrl = process.env.REACT_APP_API_URL_LOCAL;
            const token=userdetails.refreshToken
            console.log('this is refresh token',token)
            const data={'companyID':userdetails.companyDetail.companyID,'memberID':userdetails.companyDetail.memberId}
            console.log('this i dash id',data)
            dispatch({type:'setspinner',payload:true})
            const response=await axios.post(`${baseUrl}/Master/getEmployerDashboard`,data,{header:{'Authorization':`Bearer ${token}`}})
            console.log('this is response dashb',response)
            if(response.data.statusCode===200){
              dispatch({type:'SET_Dashboard_CardData',payload:response.data.data})
    
            }
          }
          }
          catch(error){
            console.log('this is error for dahsbo',error)
            if(error.response.status===500){
              handlerAlertmessage('server error','danger')
            }
            else{
              handlerAlertmessage('something wrong','danger')
            }
            //add alert message
            console.log('this is dashbord er',error)
          }
          dispatch({type:'setspinner',payload:false})
    
        });
        fetchDashboard_CardData()
    
      },[])
     const handlerAlertmessage=(message,type)=>{
       dispatch({type:'errormessage',payload:{message:message,type:type}})
    
       setTimeout(()=>{
        dispatch({type:'errormessage',payload:''})
    
       },3000)
     }
  return (
    <><div className='row dashboardcard px-2'>
    <div className='col-md-3'>
      <div className='card shadow rounded Firstcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-briefcase"></i>
          </div>
          <div className='cardText'>
            <h2>{state.dashboradCardData.jobPosted}</h2>
             <h3 className='card-title'>job Posted</h3>
          </div>
        </div>
      </div>
    </div>
    <div className='col-md-3'>
      <div className='card shadow rounded Secondcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-briefcase"></i>
          </div>
          <div className='cardText'>
            <h2>{state.dashboradCardData.openJob}</h2>
             <h3 className='card-title'>Open jobs</h3>
          </div>
        </div>
      </div>
    </div>
    <div className='col-md-3'>
      <div className='card shadow rounded Thirdcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-user"></i>
          </div>
          <div className='cardText'>
            <h2 className='text-center'>{state.dashboradCardData.totalCandidate}</h2>
             <h3 className='card-title text-center'>Applicants</h3>
          </div>
        </div>
      </div>
    </div>
    <div className='col-md-3'>
      <div className='card shadow rounded Fourthcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-user-tie"></i>
          </div>
          <div className='cardText'>
            <h2>{state.dashboradCardData.totalSubmission}</h2>
             <h3 className='card-title'>Shortlisted </h3>
          </div>
        </div>
      </div>
    </div>

    
    
    
  </div>
  </>
  )
}
