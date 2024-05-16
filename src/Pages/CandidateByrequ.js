import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import  '../CSS/Login.css'
import candidateimg from '../images/Logo_164.jpg'
import axios from 'axios'
import Candidatedetails from './Candidatedetails'



export default function CandidateByrequ() {
    const [candidateDetails,setCandidateData]=useState([])
    const [candidateID,setCandidateId]=useState(null)
    const [showslide,setslide]=useState(false)

    const {id}=useParams()
    console.log('this is req id',id)
    // fetch candidate
  const handlerFetchCandidate=useMemo(async()=>{        
    try{

        if(id){
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            
            const response=await axios.post(`${baseUrl}/JobPosting/JobWiseCandidate`,{'id':id})
            console.log('this is response candidae',response)
            if(response.status===200 && response.data.statusCode===200){
                setCandidateData(response.data.data)
            }
        }
        else{
            //handler alert message 
            //setCandidateData([])  later will check without id
            return
        }
    }
    catch(error){
      console.log('this is error re',error)
      // handler alert message

    }

})

const handlerCandidatedetail=(memberID)=>{
  console.log('this is memberid for canva',memberID)
  setCandidateId(memberID)
  setslide(true)
  
};
const closeslide=()=>{
  setslide(false)
}


  return (
    <>

        <div className='container'>
            <div className='row my-3'>
            <h5 className=''>Candidate List</h5>
            </div>
            <div className='row   px-2'>
                
                <div className='table-rsponsive '>
                <table className='table shadow rounded'>
            <thead className='table-light py-4'>
              <tr>
                <th>Candidate Name</th>
                <th>Stage</th>
                <th>Applied role</th>
                <th>Matching</th>
                <th>Source</th>
                <th>Applied date</th>
                <th>View details</th>
                <th>Edit</th>
                <th>Delete</th>
                
              </tr>
            </thead>
            <tbody>
                {candidateDetails && candidateDetails.map((item,index)=>
                     <tr key={index}>
                
                     <td><img className='rounded-circle candidateimg' src={candidateimg} /> {item.candidateName}</td>
                     <td className='text-info'>{item.currentLevel}</td>
                     <td>{item.jobTitle}</td>
                     <td>
                      <div className='progress'>
                        <div className='progress-bar' style={{width:`${parseInt(item.matchingPercentage)}`}}>{parseInt(`${item.matchingPercentage}`)}%</div>
                      </div>
                     </td>
                     <td>{item.source}</td>
                     <td>{new Date(item.dateAppliedOn).toDateString()}</td>
                     <td  onClick={()=>handlerCandidatedetail(item.memberID)} ><i class="fa-regular fa-eye text-primary"></i></td>
                     <td><i class="fa-solid fa-pen text-success"></i></td>
                     <td><i class="fa-regular fa-trash-can text-danger"></i></td>
                     
                     
                   </tr>

                )}
           
              
              
            </tbody>

          </table>

                </div>
            </div>
        </div>

        {/* candidate details for popup */}
    
      {candidateID && <Candidatedetails candidateid={candidateID} closeslide={closeslide} showslide={showslide} />}
        
{showslide && <div class="offcanvas-backdrop fade show"></div>}
      
    </>
  )
}
