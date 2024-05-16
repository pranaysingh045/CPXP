import React,{useEffect, useState} from "react";
import SkillModal from "./SkillModal";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import Alertmessage from "../../Alertmessage";

export default function Skills() {
  const [skillmodal,setSkillModal]=useState(false)
    const [skillsId,setskillId]=useState(null)
    const [skillsData,setSkilldata]=useState([])
    const [message,setMessage]=useState({message:'',type:''})
  const handlerSkillmodal=((id)=>{
    if(id !==null){
        setskillId(id)
        setSkillModal(!skillmodal)
        
    console.log('this is modal ed',skillmodal,skillsId)
    }
    else{
        setskillId(null)
        setSkillModal(!skillmodal)
    console.log('this is modal ed',skillmodal,skillsId)
    }
    
  });
  const fetchSkillsdetails=(async()=>{
    try{
      const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      const data={
        "memberID": 3030
      }
      const response=await axios.post(`${baseUrl}/MemberSkill/GetMemberSkill`,data)
      console.log('this is skill',response)
      if(response.status===200 && response.data.statusCode===200){
        setSkilldata(response.data.data)
      }
      
    }
    catch(error){
      console.log('this is skill error',error)
    }

  });
  useEffect(()=>{
    
    fetchSkillsdetails()

  },[]);

  //delete skills
  const handlerDeleteSkill=(async(id)=>{
    console.log('skill delete id',id)
    try{
      const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      if(id){
        const response=await axios.delete(`${baseUrl}/MemberSkill/DeleteMemberSkill/${id}`)
        console.log('this is response deler',response)
        if(response.status===200){
          fetchSkillsdetails()
          handlerAlertmessage(response.data.message,'success')
        }
      }
      
    }
    catch(error){
      console.log('this is error',error)
      handlerAlertmessage('Internal error','warning')

    }
  });

  const handlerAlertmessage=(message,type)=>{
    setMessage({message:message,type:type})
    setTimeout(()=>{
      setMessage({message:'',type:''})

    },3000)
  }
  return (
    <div id="skill">
      <div className="card">
        <div className="card-header customcardheaderprofil">
          <a href="#skills" className="" data-bs-toggle="collapse">
            Skills
          </a>
          <button className="btn mx-auto" onClick={()=>handlerSkillmodal(null)}><i class="fa-solid fa-plus"></i> Add</button>
        </div>
        <div className="collapse show" data-bs-parent="#skill" id="skills">
          <div className="card-body customcardbody">
            {message.message.length>0?<Alertmessage message={message} />:''}
            <div className="row   px-2">
              <div className="table-rsponsive ">
                <table className="table shado rounded">
                  <thead className="table-ligh py-4">
                    <tr>
                      <th>Skill</th>
                      <th>Exprience(Years)</th>
                      <th>Last Used</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillsData.length>0?(skillsData.map((item)=>

                              <tr key={item.id}>
                              <td>{item.skillName}</td>
                              <td>{item.yearsOfExperience}</td>
                              <td>{new Date(item.lastUsed).toLocaleDateString()}</td>
                              <td onClick={()=>handlerSkillmodal(item.id)}>
                                <i class="fa-solid fa-pen text-success"></i>
                              </td>
                              <td onClick={()=>handlerDeleteSkill(item.id)}>
                                <i class="fa-regular fa-trash-can text-danger"></i>
                              </td>
                              </tr>


                    )):('record not found')}
                    
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {skillmodal && <SkillModal showModal={skillmodal} closeModal={handlerSkillmodal} id={skillsId}  />}
    </div>
  );
}
