import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function CardProfileView({showModal,closeModal}) {
    const [profileviewer,setProfileViewer]=useState([])
    useEffect(()=>{
        const fetchProfileviewr=(async()=>{
            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                const data={
                    "memberID": 3030
                  }
                const response=await axios.post(`${baseUrl}/Candidate/CandidateProfileviewsList`,data)
                console.log('this is respon fg',response)
                if(response.status===200 && response.data.statusCode===200){
                    console.log(response.data.data.candidateViewList)
                    setProfileViewer(response.data.data.candidateViewList)
                }
            }
            catch(error){
                console.log('this is profile viewer err',error)
            }

        });
        fetchProfileviewr()

    },[])
  return (
    <div>
        <div className={`modal backdropmodal ${showModal?'show':''}`} id='modaleducation' style={{display:showModal?'block':'none'}}>
        <div className='modal-dialog modal-dialog-centered modal-s'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>Profile View</h4>
                    <button className='btn btn-close' data-bs-dismiss='modal' onClick={closeModal} type='button'></button>
                </div>
                <div className='modal-body'>
                    {profileviewer.length>0? profileviewer.map((item)=>
                        <p className='pendingprofil'><b>Employeer</b>: {item.viewerName} || <b>Company</b>: {item.companyName}</p>
                    ):'No body have view your profile yet'}

                    
                    
                
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}
