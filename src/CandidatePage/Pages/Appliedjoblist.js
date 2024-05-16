import React, { useEffect, useReducer,useState } from 'react'
import RecommendedJob from './RecommendedJob'
import axios from 'axios'
import SpinnerLod from '../../LayoutPage/SpinnerLod'
import ReqDetailsModal from '../../Dashboard/ReqDetailsModal'

const initialstate={
  appliedJobData:[],
  setspinner:false,
}

const reducer=(state,action)=>{
  switch(action.type){
    case 'appliedjobdata':
      return {...state,appliedJobData:action.payload}
    default:
      return state
  }
}

export default function Appliedjoblist() {
  const [state,dispatch]=useReducer(reducer,initialstate)

  useEffect(()=>{
    const fetchAppliedjob=(async()=>{
      try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL;
        const data={"memberID": 3030}
        dispatch({type:'setspinner',payload:true})
        const response=await axios.post(`${baseUrl}/Candidate/CandidateJobCart`,data)
        if(response.status===200 && response.data.statusCode===200){
          console.log('this is parse')
          // const data=JSON.parse(response.data.data.data)
          const data=response.data.data.memberProfile
          dispatch({type:'appliedjobdata',payload:data})
          console.log('thjis is parsed data applied',data)
        }
        console.log(response)
      }
      catch(error){
        console.log('this is error respo',error)

      }
      finally{
        dispatch({type:'setspinner',payload:false})
      }
    });
    fetchAppliedjob()

  },[])

  // popup regarding details
  const [showModal,setShowModal]=useState(false)
  const [JobId,setJobId]=useState(null)
    const handlerModal=((id)=>{
        // dispatch({type:'setjobid',payload:id})
        setJobId(id)
        //setJobId(id)
        if(id){
            setShowModal(true)
        }


    });
    const closeModal=()=>{
      setShowModal(false)
  }

  return (
    <div className='container'>
      {state.setspinner && <SpinnerLod/>}
      
      {!state.setspinner &&<><div className='row mt-2 mb-1'>
        <h3>Applied Job</h3>
      </div>
      <div className='row   px-2'>
      <div className='table-rsponsive shadow px-0'>
        <table className='table  rounded'>
            <thead className='table-light py-4'>
              <tr>
                <th>Job title</th>
                <th>Job Code</th>
                
                <th >Company name</th>
                
                <th >Status</th>  
                {/* how many candidate applied in this req */}
                <th >Location</th>
                <th>Applied</th>
                <th>View</th>
                
              </tr>
            </thead>
          
            <tbody>
              {state.appliedJobData.length>0? (state.appliedJobData).map((item)=>

                      <tr key={item.id}>
                      <td>{item.jobTitle}</td>
                      <td>{item.jobPostingCode}</td>
                      <td>{item.companyName}</td>
                      <td>{item.currentLevelName}</td>
                      <td>Hyderbada</td>
                      <td>{new Date(item.applyDate).toDateString()}</td>
                      <th onClick={()=>handlerModal(item.jobPostingId)} jobid={item.JobPostingId}><i class="fa-regular fa-eye"></i></th>
                      </tr>



              ):<h4>Not Found record</h4>}
            
              
              
              
            
              
                
            </tbody>

       </table>
       <div className='row pl-4'>
         {/* <div className='pagination-container'>
         <ul className='pagination pl-3'>
          <li className={`page-item ${currentpage<=1?'disabled':''}`} onClick={()=>setCurrentPage(currentpage-1)}><a className='page-link' href='#'>Previous</a></li>
          {state.pageitem.pagenationItem && state.pageitem.pagenationItem }
          
          <li className={`page-item ${currentpage===state.pageitem.totalpage?'disabled':''}`} onClick={()=>setCurrentPage(currentpage+1)}><a className='page-link'>Next</a></li>
        </ul>
        <span className='ml-5 pagenumspan'>Page {currentpage && currentpage} of {state.pageitem.totalpage &&state.pageitem.totalpage}</span>

         </div> */}
       </div>


        </div>
    </div></>}
      

      <ReqDetailsModal showModal={showModal} closeModal={closeModal} reqId={JobId} />
    </div>
  )
}
