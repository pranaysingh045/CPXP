import React,{useEffect, useState} from "react";
import EducationModal from "./EducationModal";
import axios from "axios";
import Alertmessage from "../../Alertmessage";

export default function Education() {
    const [educationmodal,setEducationModal]=useState(false)
    const [educationId,setEduId]=useState(null)
    const [fetchEducationData,setEducationdata]=useState([])
    const [message,setMessage]=useState({message:'',type:''})
  const handlerEducationmodal=((id)=>{
    if(id !==null){
        setEduId(id)
        setEducationModal(!educationmodal)
        
    console.log('this is modal ed',educationmodal,educationId)
    }
    else{
        setEduId(null)
        setEducationModal(!educationmodal)
    console.log('this is modal ed',educationmodal,educationId)
    }
    
  })

  useEffect(()=>{
    const fetchEducationdetails=(async()=>{
      
      try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
        const data={
          "memberID": 3030
        }
        const response=await axios.post(`${baseUrl}/MemberEducation/GetMemberEducation`,data)
        console.log('this is response education',response)
        if(response.status===200 && response.data.statusCode===200){
          setEducationdata(response.data.data)
        }
      }
      catch(error){
        console.log('this is response err education',error)

      }
      
    })
    fetchEducationdetails()

  },[]);
  const handlerDeleteEdu=(async(id)=>{
    try{
      const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      if(id){
        const response=await axios.delete(`${baseUrl}/MemberEducation/DeleteMemberEducation/${id}`)
        console.log('this is response deler',response)
        if(response.status===200){
          handlerAlertmessage(response.data.message,'success')
        }
      }
      
    }
    catch(error){
      console.log('this is error',error)
      handlerAlertmessage('Internal error','warning')

    }

  })
  const handlerAlertmessage=(message,type)=>{
    setMessage({message:message,type:type})
    setTimeout(()=>{
      setMessage({message:'',type:''})

    },3000)
    
  }
  return (
    <>
      <div className="" id="accordion">
        <div className="card">
          <div className="card-header customcardheaderprofil">
            <a className="" data-bs-toggle="collapse" href="#education">
              Education
            </a>
            <button className="btn mx-auto" onClick={()=>handlerEducationmodal(null)}><i class="fa-solid fa-plus"></i> Add</button>
          </div>
          <div className="collapse show" data-bs-parent="#accordion" id="education">
            <div className="card-body customcardbody">
              {message.message.length>0? <Alertmessage message={message} />:''}
              <div className="row   px-2">
                <div className="table-rsponsive ">
                  <table className="table shado rounded">
                    <thead className="table-ligh py-4">
                      <tr>
                        <th>Level Of Education</th>
                        <th>Degree/Exam Title</th>
                        <th>Duration</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchEducationData.length>0?fetchEducationData.map((item)=>
                      
                            <tr key={item.id}>
                            <td>{item.levelOfEducationName}</td>
                            <td>{item.degreeTitle}</td>
                            <td>{new Date(item.attendedFrom).toLocaleDateString()} - {new Date(item.attendedTo).toLocaleDateString()}</td>
                            <td onClick={()=>handlerEducationmodal(item.id)}>
                              <i class="fa-solid fa-pen text-success"></i>
                            </td>
                            <td onClick={()=>handlerDeleteEdu(item.id)}>
                              <i class="fa-regular fa-trash-can text-danger"></i>
                            </td>
                            </tr>

                      )
                      :'No record Found'}
                     
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EducationModal showModal={educationmodal} closeModal={handlerEducationmodal} id={educationId} />

      
    </>
  );
}
