import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import Alertmessage from '../../Alertmessage'


const initialstate={
    documentTypedata:[],
    message:{message:'',type:''}
}

const reducer=(state,action)=>{
    switch(action.type){
        case 'fetchdocumenttype':
            return {...state,documentTypedata:action.payload}
        case 'message':
            return {...state,message:{message:action.payload.message,type:action.payload.type}}
        default:
            return state
    }
}
export default function DocumentModal({showModal,closeModal,id,loginuserid}) {
    const [state,dispatch]=useReducer(reducer,initialstate)
    const [documentformdetails,setDocumnetFormD]=useState({
        memberId:loginuserid,
        documetType:null,
        docuemntTitle:'',
        description:'',
        fileName:'',
        documentSource:'', //binary file data
        loginUserID:loginuserid
    })
    // input handler
    const handlerFormInput=((e)=>{
        const {name ,value,type,files}=e.target
        if(type=='file'){
            if(files && files.length>0){
                const uploadfile=files[0]
                if(uploadfile.type==='application/pdf'||uploadfile.type==='application/msword' || uploadfile.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                    if(uploadfile.size<=1024* 1024){
                        const reader=new FileReader()
                        reader.onloadend=()=>{
                            const base64string=reader.result.split(',')[1];
                            console.log('this is base file conv',base64string)
                            setDocumnetFormD({...documentformdetails,[name]:base64string,fileName:uploadfile.name});
                        }
                        reader.readAsDataURL(uploadfile)
                        
                        console.log('this is name fil',uploadfile.name)
                        console.log('this is reader',reader)
                    }
                    else{
                        console.log('file size should be 1mb')
                    }
                }
                else{
                    console.log('file formate should pdf')
                }
            }

        }
        else{
            setDocumnetFormD({...documentformdetails,[name]:value})
        }
    })
    console.log('modal call m')
    //fetch document type
    useEffect(()=>{
        const fetchDocumentype=(async()=>{
          try{
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            const data={
                "lookupType": 20
              }
            const response=await axios.post(`${baseUrl}/Master/GetGenericLookupByType`,data)
            console.log('this is error doc type',response)
            if(response.status===200 ){
              console.log('',response.data)
              dispatch({type:'fetchdocumenttype',payload:response.data})
            }
    
          }
          catch(error){
            console.log('this is error',error)
          }
        })
        fetchDocumentype()
    
      },[])

      // handlerAlert message
      const handlerAlert=(message,type)=>{
        dispatch({type:'message',payload:{message:message,type:type}})

        setTimeout(()=>{
            dispatch({type:'message',payload:{message:'',type:''}})

        },3000)
      }

      //form data submit
      const handlerDocumentFormSub=(async(e)=>{
        e.preventDefault();
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
        console.log('this is id of dpx dmkjf',id)
    
        console.log('this is from details after update details',documentformdetails)
        if(id){
            console.log('this is update method',id)
            try{
                
                console.log('this is update form de response',documentformdetails)
                const response=await axios.put(`${baseUrl}/MemberDocument/UpdateMemberDocument/${id}`,documentformdetails)
                console.log('this is update details from response',response)
                if(response.status===200 && response.data.statusCode===200){
                    handlerAlert(response.data.message,'success')
                    // dispatch({type:'message',payload:{message:,type:'warning'}})
                }
    
            }
            catch(error){
                handlerAlert('something wrong','danger')
                console.log('this is form submit error',error)
    
            }
        }
        else{
            console.log('thjis is submit'.id)
            try{
                const response=await axios.post(`${baseUrl}/MemberDocument/AddMemberDocument`,documentformdetails)
                console.log('this is upload from response',response)
                if(response.status===200 && response.data.statusCode===200){
                    handlerAlert(response.data.message,'success')
                    // dispatch({type:'message',payload:{message:,type:'warning'}})
                }
    
            }
            catch(error){
                handlerAlert('something wrong','danger')
                console.log('this is form submit error',error)
    
            }

        }

        
        console.log('this is form submition',documentformdetails)
      })

      // fetch document details by id

      useEffect(()=>{

        const fetchdocDetailsById=(async(id)=>{
            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            const data={
                id:3028
            }
            const response=await axios.get(`${baseUrl}/MemberDocument/GetMemberDocument/${id}`,data)
            console.log('this is respon by id',response.data)
            
            if(response.status===200 && response.data.statusCode===200){
                console.log('this is respon by id xyz',response.data.data)
                setDocumnetFormD({...documentformdetails,
                    //memberId:3028,
                    documetType:response.data.data[0].documetType,
                    docuemntTitle:response.data.data[0].docuemntTitle,
                    description:response.data.data[0].description,
                    fileName:response.data.data[0].documentName,
                    //documentSource:'', //binary file data
                    loginUserID:3028
                })
            }
            
            }
            catch(error){
                console.log('this is error',error)
            }
        });
        fetchdocDetailsById(id)
        console.log('this is by id call')

      },[id])


  return (
    <>
    <div className={`modal backdropmodal ${showModal?'show':''}`} id='modaldocument' style={{display:showModal?'block':'none'}}>
        <div className='modal-dialog modal-dialog-centered modal-lg'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>{id && id?<span className='text-info'>Edit Document</span>:'Add Document'}</h4>
                    <button className='btn btn-close' data-bs-dismiss='modal' onClick={closeModal} type='button'></button>
                </div>
                <div className='modal-body'>
                    {state.message.message!==''?<Alertmessage message={state.message} />:''}
                    <form onSubmit={handlerDocumentFormSub}>
                    <div className='row my-3'>
                    <div className='form-group '>
                            <label for='title'>Document type  </label>
                            <select type='text' value={documentformdetails.documetType} onChange={handlerFormInput} name='documetType' id='title' className='form-control' placeholder='Document title'>
                            <option>select document type</option>
                            {state.documentTypedata.length>0 ?(state.documentTypedata.map((item)=>
                               <option value={item.id}>{item.name}</option>
                            )):''}
                            </select>
                        </div>
                    </div>
                        <div className='row my-3'>
                        <div className='col-md-6'>
                        <div className='form-group'>
                            <label for='title'>Document title</label>
                            <input type='text' value={documentformdetails.docuemntTitle} onChange={handlerFormInput} id='title' name='docuemntTitle' className='form-control' placeholder='Document title'/>
                        </div>
                        </div>
                        <div className='col-md-6'>
                        <div className='form-group '>
                            <label for='dis'>Upload file</label>
                            <input type='file' onChange={handlerFormInput} name='documentSource' id='dis' className='form-control' />
                        </div>
                        </div>
                        </div>

                    <div className='row my-3'>
                        
                    <div className='form-group '>
                            <label for='dis'>Description</label>
                            <textarea type='text' value={documentformdetails.description} onChange={handlerFormInput} name='description' id='dis' className='form-control' placeholder='Description'/>
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
