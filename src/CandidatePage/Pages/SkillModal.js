import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import Alertmessage from '../../Alertmessage';
import { type } from '@testing-library/user-event/dist/type';


const initilstate={
    Skilldata:[],
    message:{message:'',type:''}

}
const reducer=(state,action)=>{
    switch(action.type){
        case 'fetchskill':
            return {...state,Skilldata:action.payload}
        case 'alertmessage':
            return {...state,message:{message:action.payload.message,type:action.payload.type}}
        default:
            return state
    }
}
export default function SkillModal({showModal,closeModal,id}) {
    const [state,dispatch]=useReducer(reducer,initilstate)
    const [skillformdata,setSkillFormdata]=useState({
        lastUsed:'',
        yearsOfExperience:null,
        comment:'',
        memberId:3030,
        skillId:null,
        loginUserID:3030
    })
   
    useEffect(()=>{
        const fetchskillByid=(async(id)=>{
            if(id){
                try{
                    const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                    const response=await axios.get(`${baseUrl}/MemberSkill/GetMemberSkill/${id}`)
                    console.log('this is repo id skill',response)
                    if(response.status===200 && response.data.statusCode===200){
                        const data=response.data.data
                        console.log('this is inside skill data',data)
                        setSkillFormdata({...skillformdata,
                            skillId:data[0].id,
                            yearsOfExperience:data[0].yearsOfExperience,
                            lastUsed:data[0].lastUsed.split("T")[0],
                            
                        })

                    }
    
                }
                catch(error){
                    console.log('this is error skill id',error)
    
                }
                
            }
            // else{
            //     console.log('this is skill id not foiund',id)
            //     handlAlertMessage('skill id not found','danger')
            // }
        });
        fetchskillByid(id)
 

    },[id])

    const handlerInput=(e)=>{
        const {name,value}=e.target
        setSkillFormdata({...skillformdata,[name]:value})
    }
//fetch skill data
    useEffect(()=>{
        const fetchSkilldata=(async()=>{

            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                const response=await axios.get(`${baseUrl}/Master/GetSkills`)
                if(response.status===200){
                    console.log('this is skill modd',response.data)
                    dispatch({type:'fetchskill',payload:response.data})

                }

            }
            catch(error){
                console.log('this is error skill',error)
            }


        });
        fetchSkilldata()

    },[]);

    //add skill
const handlerSubmitForm=(async(e)=>{
    e.preventDefault()
    console.log('thjis is form skilladd',skillformdata);
    try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
        var response
        if(id){
            console.log('this is update opretion',id)
            response=await axios.put(`${baseUrl}/MemberSkill/UpdateMemberSkill/${id}`,skillformdata)
        }
        else{
            console.log('this is add operation',id)
            response=await axios.post(`${baseUrl}/MemberSkill/AddMemberSkill`,skillformdata)
        }
        
        console.log('this is res skill sdd',response)
        if(response.status===200 && response.data.statusCode===200){
            handlAlertMessage(response.data.message,'success')
        }
    }
    catch(error){
        handlAlertMessage('Internal error','warning')
    }

});
const handlAlertMessage=(message,type)=>{
    dispatch({type:'alertmessage',payload:{message:message,type:type}})

    setTimeout(()=>{
        dispatch({type:'alertmessage',payload:{message:'',type:''}})
        
    },3000)
}

  return (
    <>
    <div className={`modal backdropmodal ${showModal?'show':''}`} id='modaleducation' style={{display:showModal?'block':'none'}}>
        <div className='modal-dialog modal-dialog-centered modal-lg'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>{id && id?<span className='text-info'>Edit Skill -{id} </span>:'Add Skill'}</h4>
                    <button className='btn btn-close' data-bs-dismiss='modal' onClick={closeModal} type='button'></button>
                </div>
                <div className='modal-body'>
                    {state.message.message.length>0?<Alertmessage message={state.message} />:''}
                    <form onSubmit={handlerSubmitForm}>
                    <div className='row my-3'>
                    <div className='form-group '>
                            <label for='title'>Skill</label>
                            <select type='text' value={skillformdata.skillId} onChange={handlerInput} name='skillId' id='title' className='form-control' placeholder='Document title'>
                            <option value=''>Select skill</option>
                            {state.Skilldata && (state.Skilldata).map((item)=>
                            <option value={item.id}>{item.name}</option>
                            
                            )}
                            
                            
                            </select>
                        </div>
                    </div>
                        <div className='row my-3'>
                        <div className='col-md-6'>
                        <div className='form-group'>
                            <label for='title'>Years</label>
                            <input type='text' value={skillformdata.yearsOfExperience} onChange={handlerInput} name='yearsOfExperience' id='title' className='form-control' placeholder='Document title'/>

                        </div>
                        </div>
                        <div className='col-md-6'>
                        <div className='form-group '>
                            <label for='dis'>Last used</label>
                            <input type='date' value={skillformdata.lastUsed} onChange={handlerInput} name='lastUsed' id='dis' className='form-control' />
                        </div>
                        </div>
                        </div>

                    <button className='btn btn-primary'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    </>
  )
}
