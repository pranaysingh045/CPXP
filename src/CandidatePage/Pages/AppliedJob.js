import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReqDetailsModal from '../../Dashboard/ReqDetailsModal';
import DecryptFunction from '../../AuthFolder/DecryptFunction';



export default function AppliedJob() {
  const [recomandedJobdata,setRecomJobdata]=useState([])
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
  useEffect(()=>{

    const fetchRecomandedJob=(async()=>{

      try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
        const userdetails=DecryptFunction()
        console.log('this is applied job details token',userdetails)
        const memberID=userdetails.candidateDetail.memberId
        console.log('this is accestoken & memberid',memberID)
        
        const data={
          "memberID": memberID
        }
        const response=await axios.post(`${baseUrl}/Candidate/CandidateRecommendedJob`,data)
        console.log('this is response data recomd job',response)
        if(response.status===200 && response.data.statusCode===200){
          setRecomJobdata(response.data.data)

        }

      }
      catch(error){
        console.log('this is recomded job',error)
      }

    });
    fetchRecomandedJob()

  },[])
  return (
    <div className='row   px-2'>
      <div className='table-rsponsive shadow px-0'>
        <table className='table  rounded'>
            <thead className='table-light py-4'>
              <tr>
                <th>Job title</th>
                <th>Job Code</th>
                
                <th >Company name</th>
                
                <th >Total Applied</th>  
                {/* how many candidate applied in this req */}
                <th >Location</th>
                <th>Job post</th>
                <th>View</th>
                
              </tr>
            </thead>
          
            <tbody>
              {recomandedJobdata.length>0?(recomandedJobdata.map((item)=>

                      <tr key={item.id}>
                      <td>{item.jobTitle}</td>
                      <td>{item.jobPostingCode}</td>
                      <td>{item.clientName}</td>
                      <td>4</td>
                      <td>{item.city}</td>
                      <td>{new Date(item.postedDate).toDateString()}</td>
                      <th onClick={()=>handlerModal(item.id)}><i class="fa-regular fa-eye"></i></th>
                      </tr>


              )):('<p>Not Match any job</p>')}

            
              
               
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

        <ReqDetailsModal showModal={showModal} closeModal={closeModal} reqId={JobId} />
    </div>
  )
}
