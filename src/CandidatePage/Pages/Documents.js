import React, { useEffect, useReducer } from 'react'
import DocumentModal from './DocumentModal'
import axios from 'axios'
import Alertmessage from '../../Alertmessage'
import DecryptFunction from '../../AuthFolder/DecryptFunction'
import { type } from '@testing-library/user-event/dist/type'

const initialstate={
  shoModal:false,
  editid:null,
  documentdata:[],
  message:{message:'',type:''},
  loginuserid:null,
}

const reducer=(state,action)=>{
  switch(action.type){
    case 'showmodal':
      console.log('this is reducer',state.shoModal)
      return {...state,shoModal:action.payload}
    case 'editid':
      return {...state,editid:action.payload}
    case 'fetchdocument':
      return {...state,documentdata:action.payload}
    case 'alertmessage':
      return {...state,message:{message:action.payload.message,type:action.payload.type}}
    case 'loginuserid':
      return {...state,loginuserid:action.payload}
    default:
      console.log('this is reducer',state.shoModal)
      return state
  }
}

export default function Documents() {
  const [state,dispatch]=useReducer(reducer,initialstate)

  const handlerModal=(id)=>{
    if(id===null){
      dispatch({type:'showmodal',payload: !state.shoModal})
      dispatch({type:'editid',payload:null})
    }
    else{
      dispatch({type:'showmodal',payload: !state.shoModal})
      dispatch({type:'editid',payload:id})

    }
  }
  const fetchDocument=(async()=>{
    try{
      const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      const userdetails=DecryptFunction()
      const memberID=userdetails.candidateDetail.memberId
      dispatch({type:'loginuserid',payload:memberID})
      console.log('this is accestoken & memberid',memberID)
      const data={
        "memberID": memberID
      }
      const response=await axios.post(`${baseUrl}/MemberDocument/GetMemberDocument`,data)
      if(response.status===200 && response.data.statusCode===200){
        console.log(response.data.data)
        dispatch({type:'fetchdocument',payload:response.data.data})
      }

    }
    catch(error){
      console.log('this is error',error)
    }
  })
  useEffect(()=>{
    
    fetchDocument()

  },[])

  //alert message
  const handlerAlert=(message,type)=>{

    dispatch({type:'alertmessage',payload:{message:message,type:type}})

    setTimeout(()=>{
      dispatch({type:'alertmessage',payload:{message:'',type:''}})
    },3000)

  }

  //delete document 
  const handlerDeleteDoc=(async(id)=>{
    if(id){
      try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
        const response=await axios.delete(`${baseUrl}/MemberDocument/DeleteMemberDocument/${id}`)
        console.log('this is delete response data',response)
        if(response.status===200){
          fetchDocument()
          handlerAlert('document delete sucussfully','success')
          

        }

      }
      catch(error){
        console.log('this is delete err',error)
      }
    }
  })
  
  return (
    <div className='container'>
    <div className='row'>
    <h3 className='mb-2'>My Documents{state.shoModal}</h3>
    {state.message.message!==''?<Alertmessage message={state.message} />:''}
    </div>
    <div className='row my-3'>
      <div className='documentSearchcontainer'>
        <input type='text' placeholder=' Search by document name'  />
        <span className='btn btn-primary' onClick={()=>handlerModal(null)}><i class="fa-solid fa-plus"></i> Upload document</span>
      </div>
      
    </div>
    <div className='row   px-2'>
      <div className='table-rsponsive shadow px-0'>
        <table className='table  rounded'>
            <thead className='table-light py-4'>
              <tr>
                <th>Uploaded File</th>
                <th>Title</th>
                
                <th >Type</th>
                
                <th >Edit</th>
                <th >Delete</th>
                
              </tr>
            </thead>
          
            <tbody>
              
              {state.documentdata.length>0?state.documentdata.map((item)=>
                

                    <tr key={item.id}>
                    <td>{item.documentName}</td>
                    
                    <td>{item.docuemntTitle}</td>
                    <td>{item.documetType}</td>
                    <td onClick={()=>handlerModal(item.id)}><i class="fa-solid fa-pencil text-primary"></i></td>
                    <td onClick={()=>handlerDeleteDoc(item.id)} ><i class="fa-solid fa-trash-can text-danger"></i></td>
                    </tr>

)
              :''}
            
            
              
                
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
    </div>
    
    {state.shoModal &&<DocumentModal loginuserid={state.loginuserid} showModal={state.shoModal} closeModal={()=>handlerModal(null)} id={state.editid} />}
    
    </div>
  )
}
