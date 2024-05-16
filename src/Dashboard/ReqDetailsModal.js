import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import loder from '../images/Spinner.svg'
import Alertmessage from '../Alertmessage';
import SpinnerLod from '../LayoutPage/SpinnerLod'; 
export default function ReqDetailsModal({reqId,showModal,closeModal}) {
    const [jobdetails,setJobdetails]=useState([])
    const [spinner,setSpinner]=useState(false)
    const [errermessage,setErrormessage]=useState(false)
    const [message,setMessage]=useState('')
    const handlerAlertmessage=(message,type)=>{
        setErrormessage(true)

        setMessage({message:message,type:type})

        setTimeout(()=>{
            setErrormessage(false)
        },3000)


    }
    const fetchdatamemo=useMemo(()=>{
console.log('popup use modal ',reqId)
        const fetchJobdetails=(async()=>{
            if(reqId){
                try{
                    const baseUrl=process.env.REACT_APP_API_URL_LOCAL;
                    const details=sessionStorage.getItem('details')
                    // call common fun for key check and exp details later
                    setSpinner(true)
                    const response= await axios.post(`${baseUrl}/JobPosting/JobPostingDetailByID`,{'id':reqId})
                    if(response.status===200 && response.data.statusCode){
                       
                        setJobdetails(response.data.data)
                    }
    
    
                }
                catch(error){
                    var message='something wrong';
                    if(error.response){
                        message=error.response.data.message
                    }
                    handlerAlertmessage(message,'danger')
                    console.log('this is job details erro',error)
    
                }
                setSpinner(false)
            }
            else{
              return
                
                handlerAlertmessage('Job details not found','danger')
            }
        });
        fetchJobdetails();

        // return ()=>{
        //   console.log('popu clearn and close')

        // }


    },[reqId])
  return (
    <>
    <div className={`modal backdropmodal ${showModal?'show':''}`} id={`requestionmodal${reqId}`} style={{display:showModal?'block':'none'}} >
        <div key={reqId} className='modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3 className='modal-title'>Requisition Details</h3>
              <button className='btn btn-close' data-bs-dismiss='modal' onClick={closeModal} type='button'></button>
            </div>
           {spinner &&  <SpinnerLod/>}
            {errermessage && <Alertmessage message={message}/>}
            { !spinner && jobdetails && jobdetails.map((item)=><div className='modal-body'>
              <div className='row' key={item.jobPostingCode}>
                <div className='col-md-4 basicdetailsbox'>
                  <h5>{item.jobTitle}</h5>
                  <p><strong>Requistion Id </strong>: {item.jobPostingCode}</p>
                  <p><strong>Job Status</strong> : {item.jobStatusName}</p>
                  <p><i class="fa-solid fa-location-dot"></i> <strong className='text-bold'>Location</strong> : {item.city} {item.countryName}</p>
                  <p><i class="fa-solid fa-layer-group"></i> <strong>Industry</strong> : {item.jobCategory}</p>
                  <p><i class="fa-solid fa-wallet"></i> <strong>Required Experience</strong> : {item.minExpRequired} - {item.maxExpRequired} Year(s)</p>
                  <p><strong>Job type</strong> : {item.requisitionType}</p>
                  <p><strong>Salary Range</strong> : {item.minSalary} - {item.maxSalary}</p>
                  <p><strong>No of opening(s)</strong> : {item.noOfOpenings}</p>
                  
                  <p><i class="fa-regular fa-calendar-days"></i> <strong>Created </strong> : {item.postedDate}</p>
                  <p><i class="fa-regular fa-calendar-days"></i> <strong>Published</strong> : {item.publishDate ?item.publishDate:'Not published'}</p>

                </div>
                <div className='col-md-8 reqsModalJDtitle pl-4'>
                  
                  <div dangerouslySetInnerHTML={{__html:item.jobDescription}} ></div>
                  

                </div>
              </div>
              

            </div>)}
          </div>
        </div>
      </div>
    
    </>
  )
}
