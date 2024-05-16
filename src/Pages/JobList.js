import React, { useEffect, useReducer, useRef, useState } from 'react'
import MyRequestionList from '../Dashboard/MyRequestionList'
import EncryptDecry from '../AuthFolder/EncryptDecry';
import axios from 'axios';
import SpinnerLod from '../LayoutPage/SpinnerLod';
import TableContainer from '../LayoutPage/TableContainer';

import loaderimg from '../images/Spinner.svg'
import { handlerSortinfFun } from '../Common/Sorting';
import { handlerPagination, handlerPaginationData } from '../Common/Pegination';
import { Pagination } from 'react-bootstrap';
import ReqDetailsModal from '../Dashboard/ReqDetailsModal';
import Alertmessage from '../Alertmessage';
import { Link } from 'react-router-dom';


const Initreq={
  myjobdata:[],
  jobId:false,
  spinner:false,
  filterjobdata:[],
  paginationdata:[],
  pageitem:[],
  Jobstatus:[],
  message:{message:'',type:''},

}
const Myreqreducer=(state,action)=>{
  switch(action.type){
      case 'myjobdatalist':
          return {...state,myjobdata:action.payload};
      case 'setjobid':
          return {...state,jobId:action.payload};
      case 'sespinner':
          return {...state,spinner:action.payload};
      case 'filterjob':
        return {...state,filterjobdata:action.payload}
      case 'paginationdatafter':
        return {...state,paginationdata:action.payload}
      case 'pageitem':
        return {...state,pageitem:action.payload}
      case 'Jobstatus':
        return {...state,Jobstatus:action.payload}
      case 'alertmessage':
        return {...state,message:{message:action.payload.message,type:action.payload.type}}
     
      default:
          return state
  }

}

export default function JobList() {
  const [state,dispatch]=useReducer(Myreqreducer,Initreq)

  // later it add in initial state
  const [loader,setloader]=useState(false)
  const [sortdirection,setSortDirection]=useState('asc')
  const [currentpage,setCurrentPage]=useState(1)
  const [loginuserid,setLoginuserid]=useState(null)


  const fetchMyJobdetails=(async()=>{
    try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL;
        const details=sessionStorage.getItem('userdetails')
        // call common fun for key check and exp details later
        const userdetails=JSON.parse(EncryptDecry(details))
        console.log('this is myreq de',userdetails.companyDetail)
        const token=userdetails.refreshToken;
        setLoginuserid(userdetails.companyDetail.memberId)
        if(userdetails.companyDetail.companyID && userdetails.companyDetail.memberId){
            //const data={'loginUserID':userdetails.companyDetail.memberId,'companyID':userdetails.companyDetail.companyID}
            const data={'id':userdetails.companyDetail.memberId}
            dispatch({type:'setspinner',payload:true})
            setloader(true)

            const response=await axios.post(`${baseUrl}/JobPosting/MyJobPosting`,data)
            console.log('this is req details',response)
            if(response.status===200 && response.data.statusCode ===200){
                console.log('this is myreq data',response.data.data)
                dispatch({type:'myjobdatalist',payload:response.data.data})
                setloader(false)
                console.log(state.myjobdata)

            }

        }
        else{
            //not loged in
        }


    }
    catch(error){
      //error handler call here
        console.log('this is myre erro',error)

    }
    finally{
      setloader(false)

    }
    
})
  // fetch my job details data
  useEffect(()=>{
    
    fetchMyJobdetails()
  
},[]);
// fetch job status
useEffect(()=>{

  const fetchjobstatus=(async()=>{
    try{
      const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      
    const response=await axios.get(`${baseUrl}/Master/GetJobStatus`)
    
    console.log('this is job status',response)
      if(response.status==200){
        dispatch({type:'Jobstatus',payload:response.data})
      }
    }
    catch(error){
      console.log('this is err job status',error)
      
    }
  });
  fetchjobstatus();
},[])

  // sorting function 
  const handlerSortFunctionNum=((keyname)=>{
  
    const filterdata=handlerSortinfFun(state.myjobdata,sortdirection,keyname)
    console.log('this is sort data by sep fun',filterdata)
    if(filterdata && filterdata.length>0){
      dispatch({type:'filterjob',payload:filterdata});
      //dispatch({type:'paginationdatafter',payload:filterdata})
      setSortDirection(sortdirection==='asc'?'desc':'asc');
  
    }
    });

//pagination fun
useEffect(()=>{
  console.log('check filter change it call',state.filterjobdata)
  let data=state.myjobdata
  if(state.filterjobdata.length>0){
    data=state.filterjobdata

  }
    
    const peginations=handlerPagination({data,currentpage,setCurrentPage}) 
    console.log('this is my job pegination',peginations)
    dispatch({type:'pageitem',payload:peginations});
    const displaydata=handlerPaginationData(data,currentpage)
    dispatch({type:'paginationdatafter',payload:displaydata})

},[state.myjobdata,currentpage,state.filterjobdata])

const [showModal,setShowModal]=useState(false)
    const handlerModal=((id)=>{
        
        //setJobId(id)
        if(id){
            dispatch({type:'setjobid',payload:id})
            setShowModal(true)
        }


    })
    const closeModal=()=>{
        setShowModal(false)
    }
    const handlerUpdateJobStatus=async(statusid,jobid)=>{
      console.log('this is select value',statusid,jobid)
      try{
        if(statusid && jobid){
          const baseUrl=process.env.REACT_APP_API_URL_LOCAL
          const data={'jobPostingID':jobid,'statusID':statusid,'loginUserID':loginuserid}
          const response=await axios.post(`${baseUrl}/JobPosting/JobPostingStatusUpdateByID`,data)
          console.log('this is update jo',response)
          if(response.status===200){
            fetchMyJobdetails()
            
            handlerAlertmessage('update succussfully','success')

          }

        }

      }
      catch(error){
        handlerAlertmessage('Your job status not updated','danger')
        console.log('this is job upd err',error)
      }
    }
  
  const handlerAlertmessage=((message,type)=>{
    dispatch({type:'alertmessage',payload:{message:message,type:type}})
    setTimeout(()=>{
      dispatch({type:'alertmessage',payload:{message:'',type:''}})

    },3000)
  })
  
  return (
    <div className='container'>
    
    <div className='row   px-2'>
      {state.message && state.message.message!==''?<Alertmessage message={state.message}/>:''}
      <h3 className='mb-2'>My Job List</h3>
      {loader?(<SpinnerLod/>):
        (<div className='table-rsponsive shadow px-0'>
        <table className='table  rounded'>
            <thead className='table-light py-4'>
              <tr>
                <th>Job title</th>
                <th  onClick={()=>handlerSortFunctionNum('jobPostingCode')}>Job id {sortdirection==='asc'?<i class="fa-solid fa-sort-down"></i>:<i class="fa-solid fa-sort-up"></i>}</th>
                <th>Status</th>
                <th onClick={()=>handlerSortFunctionNum('noOfOpenings')}>No of Opening(s)</th>
                <th>Job post date</th>
                <th>Applied candidate(s)</th>
                <th>Created by</th>
                <th>Action</th>
                {/* <th>Edit</th> */}
                {/* <th>Delete</th> */}
                
              </tr>
            </thead>
          
            <tbody>
                {state.paginationdata.length>0 ? state.paginationdata.map((item)=> 
                <tr key={item.id}>
                <td onClick={()=>handlerModal(item.id)} className='text-primary'>{item.jobTitle}</td>
                <td>{item.jobPostingCode} </td>
                <td className='text-success'>
                  <select value={item.jobStatusID} onChange={(e)=>handlerUpdateJobStatus(e.target.value,item.id)} className={`badge rounded-pill bg-${item.jobStatusName==='Open'?'success':item.jobStatusName === 'Closed'?'danger':'info'}`}>
                    <option>change status</option>
                    {state.Jobstatus && state.Jobstatus.map((job)=>
                      <option  value={job.id}>{job.name}</option>
                      

                    )}
                    
                  </select>
                  {/* <span class="">{item.jobStatusName}</span> */}
                  </td> 
                {/* pills add for status */}
                <td>{item.noOfOpenings}</td>
                <td>{new Date().toDateString(item.postedDate)}</td>
                <td><Link  to={`/myrequestion/${item.id}`}>{!item.totalCandidate?0:item.totalCandidate}</Link></td>
                <td>Ravi</td>
                <td>
                  <div class="dropdown myjoblistaction"><i class="fa-solid fa-ellipsis-vertical dropdown-toggle" data-bs-toggle="dropdown"></i>
    
                      <ul class="dropdown-menu shadow">
                        <li><a class="dropdown-item" href="#">Edit</a></li>
                        <li><a class="dropdown-item" href="#">Find matching candidate</a></li>
                        <li><a class="dropdown-item" href="#">Exclusive carrer page</a></li>
                        <li><a class="dropdown-item-text" href="#">share on social media</a></li>
                        
                      </ul>
                  </div>
                </td>
                {/* <td><i class="fa-solid fa-pen text-success"></i></td> */}
                {/* <td><i class="fa-regular fa-trash-can text-danger"></i></td> */}
                
                
              </tr>
                
                
):<h3 className='text-center text-warning mt-2'>No job Found</h3>}
            </tbody>

       </table>
       <div className='row pl-4'>
         <div className='pagination-container'>
         <ul className='pagination pl-3'>
          <li className={`page-item ${currentpage<=1?'disabled':''}`} onClick={()=>setCurrentPage(currentpage-1)}><a className='page-link' href='#'>Previous</a></li>
          {state.pageitem.pagenationItem && state.pageitem.pagenationItem }
          
          <li className={`page-item ${currentpage===state.pageitem.totalpage?'disabled':''}`} onClick={()=>setCurrentPage(currentpage+1)}><a className='page-link'>Next</a></li>
        </ul>
        <span className='ml-5 pagenumspan'>Page {currentpage && currentpage} of {state.pageitem.totalpage &&state.pageitem.totalpage}</span>

         </div>
       </div>


        </div>)}
    
      
      
      
    

    </div>
    {showModal && <ReqDetailsModal showModal={showModal} reqId={state.jobId} closeModal={closeModal} />}
    
    </div>
  )
}
