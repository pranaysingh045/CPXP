import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function CandidateExprence({cid}) {

    const [exprience,setExprience]=useState([])


    useEffect(()=>{


        const fetchExprienceDetails=(async()=>{

            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                const data={"memberID":cid}
                const response=await axios.post(`${baseUrl}/MemberExperience/GetMemberExperience`,data)
                console.log('this  is response profile',response)
                if(response.status===200 && response.data.statusCode){
                    setExprience(response.data.data)
                }

            }
            catch(error){
                console.log('this is error cand ',error)
                
            }

        });
        fetchExprienceDetails()
        


    },[cid])
  return (
    <>
    <div className='card shadow'>
                
                <div className='card-body'>
                    <div className='row componaylogo'>
                        {/* <div className='col-md|lg|xl-3 d-flex justify-content-center align-item-center col-sm-4 div'>
                            <img className='img-fluid' src='' />
                        </div> */}
                        {exprience && exprience.map((item)=>(<>
                        <div className='col-md|lg|xl-12  col-sm-12 cardTextcontainer'>
                        <p>{item.positionName}</p>
                        <span className='text-secondary mt-1'> <i class="fa-solid fa-landmark"></i> {item.companyName}</span>
                        <p className='texticon mt-1'>
                            <span className='exp'><i class="fa-solid fa-briefcase"></i> {(item.dateFrom).split("T")[0]} - {(item.dateTo).split("T")[0]}</span>
                            <span className='loc'><i class="fa-solid fa-location-dot"></i> {item.city}</span>
                             <span className='rup'><i class="fa-solid fa-indian-rupee-sign"></i> 3 - 4 LPA </span>
                        </p>
                        

                    </div>
                     <a href="#exp" className='expviewmore'  data-bs-toggle="collapse"><i class="fa-regular fa-eye"></i> View More</a>
                     <div id="exp" class="collapse">
                     <p className='card-title cardhiglight text-secondary'> {item.responsibilities} </p>
                         
                     </div></>)
                        )}
                        
                    </div>
                    
                    
                </div>
            </div>


    </>
  )
}
