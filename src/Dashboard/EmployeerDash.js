import axios from 'axios';
import React, { Suspense, useEffect, useReducer } from 'react'
import encryptDecry from '../AuthFolder/EncryptDecry';
import candidateimg from '../images/Logo_164.jpg'
import TableContainer from '../LayoutPage/TableContainer';
// import MyRequestionList from './MyRequestionList';
import CandidateList from './CandidateList';
import SpinnerLod from '../LayoutPage/SpinnerLod';
import Alertmessage from '../Alertmessage';
import { json } from 'react-router-dom';
// import  from './Dashboardcard';

// const MyRequestionList=React.lazy(()=>import("./MyRequestionList"));
const Dashboardcard=React.lazy(()=>import('./Dashboardcard'));
const MyRequestionList=React.lazy(()=>import('./MyRequestionList'));


// const initialState={
//   dashboradCardData:[],
//   spinner:false,
//   errormessage:'',
// }

//create reducer
// const reducer=(state,action)=>{
//   switch(action.type){
//     case 'SET_Dashboard_CardData':
//       return {...state,dashboradCardData:action.payload};
//     case 'setspinner':
//       return {...state,spinner:action.payload};
//     case 'errormessage':
//       return {...state,errormessage:{message:action.payload.message,type:action.payload.type}};
//       return
//     default:
//       return state
//   }
// }
export default function EmployeerDash() {

  // const [state,dispatch]=useReducer(reducer,initialState);

//   useEffect(()=>{

//     const fetchDashboard_CardData=(async()=>{
      

//       try{
//         // const userdetails=sessionStorage.getItem('details')
//         const encryp_userdetails=sessionStorage.getItem('userdetails')
//         const decrypt_userDetailsstring=encryptDecry(encryp_userdetails)
//         const userdetails=JSON.parse(decrypt_userDetailsstring)
//         console.log('this is dash token',userdetails)

        
//         if(userdetails){
//         //   console.log('this is user dd',userdetails)
//         //  const details=encryptDecry(userdetails)
//         //  const userobj=JSON.parse(details)'Content-Type': 'application/json'
        
        
//         const baseUrl = process.env.REACT_APP_API_URL_LOCAL;
//         const token=userdetails.refreshToken
//         console.log('this is refresh token',token)
//         const data={'companyID':userdetails.companyDetail.companyID,'memberID':userdetails.companyDetail.memberId}
//         console.log('this i dash id',data)
//         dispatch({type:'setspinner',payload:true})
//         const response=await axios.post(`${baseUrl}/Master/getEmployerDashboard`,data,{header:{'Authorization':`Bearer ${token}`}})
//         console.log('this is response dashb',response)
//         if(response.data.statusCode===200){
//           dispatch({type:'SET_Dashboard_CardData',payload:response.data.data})

//         }
//       }
//       }
//       catch(error){
//         console.log('this is error for dahsbo',error)
//         if(error.response.status===500){
//           handlerAlertmessage('server error','danger')
//         }
//         else{
//           handlerAlertmessage('something wrong','danger')
//         }
//         //add alert message
//         console.log('this is dashbord er',error)
//       }
//       dispatch({type:'setspinner',payload:false})

//     });
//     fetchDashboard_CardData()

//   },[])
//  const handlerAlertmessage=(message,type)=>{
//    dispatch({type:'errormessage',payload:{message:message,type:type}})

//    setTimeout(()=>{
//     dispatch({type:'errormessage',payload:''})

//    },3000)
//  }

  return (
    <div className='container '>
      {/* {state.errormessage && <Alertmessage message={state.errormessage} />} */}
      {/* {state.spinner?<SpinnerLod/>:
      } */}
      <Suspense fallback={<SpinnerLod/>}>
           <Dashboardcard/>


      </Suspense>
      
      
        {/* Myrequestion Table*/}
          {/* <TableContainer header={'Requisition Details'}> */}
          
          <Suspense fallback={<SpinnerLod/>}>
              <MyRequestionList/>

          </Suspense>
           

          {/* </TableContainer> */}
          
      
      {/* candidate details */}
      
        <TableContainer header='Candidate Details'>
          <CandidateList/>
        </TableContainer>
     

      

      {/* candidate details for popup */}
      <div className='offcanvas offcanvas-end bg-dark' id='candidate'>
        <div className='offcanvas-header'>
          <h5 className='text-white'>Candidate Details</h5>
          <button className='btn btn-close' type='button' data-bs-dismiss='offcanvas'></button>
        </div>
        <div className='offcanvas-body'>
          <div className='row justify-content-center borde py-3 bg-secondary rounded'>
          <img className='rounded-circle candidateprofileimage' src={candidateimg} />
          <h6 className='text-center text-white'>Pranay singh</h6>
          <p className='text-center text-white'>Software Developer</p>
          <span className='text-white'><i class="fa-regular fa-envelope"></i> pranay@talentrackr.in</span>
          <span className='text-white'><i class="fa-solid fa-phone"></i> 9937765432</span>
          </div>
          <div className='row  mt-3 bg-secondary py-4 rounded'>
            <h5 className='text-white'>Application Details</h5>
              

          </div>
          <div className='row  mt-3 bg-secondary py-4 rounded'>
            <h5 className='text-white'>Work Experience</h5>
              

          </div>

        </div>
      </div>



    </div>
  )
}
