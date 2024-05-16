import React,{useEffect, useState} from "react";

import ExperienceModal from "./ExperienceModal";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import Alertmessage from "../../Alertmessage";

export default function Experience() {
    const [expriencenmodal,setExprienceModal]=useState(false)
    const [exprienceId,setEduId]=useState(null)
    const [exprenceDetails,setExprenceData]=useState([])
    const [message,setMessage]=useState({message:'',type:''})
    const handleralertMessage=((message,type)=>{
      setMessage({message:message,type:type})
      setTimeout(()=>{
        setMessage({message:'',type:''})
      },3000)
    })
  const handlerExprienceModal=((id)=>{
    if(id !==null){
        setEduId(id)
        setExprienceModal(!expriencenmodal)
        
    console.log('this is modal ed',expriencenmodal,exprienceId)
    }
    else{
        setEduId(null)
        setExprienceModal(!expriencenmodal)
    console.log('this is modal ed',expriencenmodal,exprienceId)
    }
    
  })

  useEffect(()=>{
    const fetchExprencedata=(async()=>{
      try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
        const data={
          "memberID": 3030
        }
        const response=await axios.post(`${baseUrl}/MemberExperience/GetMemberExperience`,data)
        console.log('this is exprence',response)
        if(response.status===200 && response.data.statusCode===200){
          setExprenceData(response.data.data)

        }

      }
      catch(error){
        console.log('this  is error exprience',error)

      }

    });
    fetchExprencedata()

  },[])

  const handlerDeleteEdu=(async(id)=>{
    try{
      if(id){
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      const response=await axios.delete(`${baseUrl}/MemberExperience/DeleteMemberExperience/${id}`)
      if(response.status===200 && response.data.statusCode===200){
        handleralertMessage(response.data.message,'success')
      }
      }

    }
    catch(error){
      //later add erro handler
      handleralertMessage('Not deleted something wrong','success')

    }
    console.log('delete item edu',id)
  })

  return (
    <div id="accordian">
      {message.message.length!=''?<Alertmessage message={message} />:''}
      <div className="card">
        <div className="card-header customcardheaderprofil">
          
          <a href="#exprence" data-bs-toggle="collapse">
            Experience
          </a>
          <button className="btn mx-auto" onClick={()=>handlerExprienceModal(null)}><i class="fa-solid fa-plus"></i> Add</button>
        </div>
        <div className="collapse show" data-bs-parent="#accordian" id="exprence">
          <div className="card-body customcardbody">
            <div className="row   px-2">
              <div className="table-rsponsive ">
                <table className="table shado rounded">
                  <thead className="table-ligh py-4">
                    <tr>
                      <th>Employer/Company Name</th>
                      <th>Job Title</th>
                      <th>Employment Duration</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exprenceDetails.length>0?(exprenceDetails.map((item)=>
                    <tr key={item.id}>
                    <td>{item.companyName}</td>
                    <td>{item.positionName}</td>
                    <td>{new Date(item.dateFrom).toLocaleDateString()} - {new Date(item.dateTo).toLocaleDateString()}</td>
                    <td onClick={()=>handlerExprienceModal(item.id)}>
                      <i class="fa-solid fa-pen text-success"></i>
                    </td>
                    <td onClick={()=>handlerDeleteEdu(item.id)}>
                      <i class="fa-regular fa-trash-can text-danger"></i>
                    </td>
                  </tr>
                    
                    
                    )):'Record not found'}
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExperienceModal showModal={expriencenmodal} closeModal={handlerExprienceModal} id={exprienceId}/>
      
    </div>
  );
}
