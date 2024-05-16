import React, { useEffect, useReducer, useRef, useState } from 'react'
import ReqDetailsModal from './ReqDetailsModal'
import EncryptDecry from '../AuthFolder/EncryptDecry';
import axios from 'axios';
import SpinnerLod from '../LayoutPage/SpinnerLod';
import { handlerSortinfFun } from '../Common/Sorting';
import { handlerPagination, handlerPaginationData } from '../Common/Pegination';


const Initreq={
    myjobdata:[],
    jobId:false,
    spinner:false,
    filterDatas:[],
    pageitem:[],
    pagefilterdata:[]
}
const Myreqreducer=(state,action)=>{
    switch(action.type){
        case 'myjobdatalist':
            return {...state,myjobdata:action.payload};
        case 'setjobid':
            return {...state,jobId:action.payload};
        case 'sespinner':
            return {...state,spinner:action.payload};
        case 'afterfilterdata':
            return {...state,filterDatas:action.payload}
        case 'pageitem':
            return {...state,pageitem:action.payload}
        case 'paginationdata':
            return {...state,pagefilterdata:action.payload}
        default:
            return state
    }

}

export default function MyRequestionList() {
    const [state,dispatch]=useReducer(Myreqreducer,Initreq)
    
    useEffect(()=>{
        const fetchMyJobdetails=(async()=>{
            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL;
                const details=sessionStorage.getItem('userdetails')
                // call common fun for key check and exp details later
                const userdetails=JSON.parse(EncryptDecry(details))
                console.log('this is myreq de',userdetails.companyDetail)
                const token=userdetails.refreshToken;
                if(userdetails.companyDetail.companyID && userdetails.companyDetail.memberId){
                    //const data={'loginUserID':userdetails.companyDetail.memberId,'companyID':userdetails.companyDetail.companyID}
                    const data={'id':userdetails.companyDetail.memberId}
                    dispatch({type:'setspinner',payload:true})
                    const response=await axios.post(`${baseUrl}/JobPosting/MyJobPosting`,data)
                    console.log('this is req details',response)
                    if(response.status===200 && response.data.statusCode ===200){
                        console.log('this is myreq data',response.data.data)
                        dispatch({type:'myjobdatalist',payload:response.data.data})
                        console.log(state.myjobdata)

                    }

                }
                else{
                    //not loged in
                }
    
    
            }
            catch(error){
                console.log('this is myre erro',error)
    
            }
            dispatch({type:'setspinner',payload:false})
        })
        fetchMyJobdetails()

    },[])
    const modalele=useRef('modalel')
    const [showModal,setShowModal]=useState(false)
    const handlerModal=((id)=>{
        dispatch({type:'setjobid',payload:id})
        //setJobId(id)
        if(id){
            setShowModal(true)
        }


    })
    const closeModal=()=>{
        setShowModal(false)
    }
    const handlerSorting=(keyname)=>{
        const filterdata=handlerSortinfFun(state.myjobdata,'desc',keyname)
        if(filterdata && filterdata.length>0){
            dispatch({type:'afterfilterdata',payload:filterdata})
        }
    }
   const [currentpage,setCurrentPage]=useState(1)
    useEffect(()=>{
        let data=state.myjobdata
        // if(state.filterjobdata.length>0){
        //     data=state.filterjobdata

        // }
        const pagindationitem=handlerPagination({data,currentpage,setCurrentPage});
        dispatch({type:'pageitem',payload:pagindationitem})
        console.log('this is pagination  n',pagindationitem)
        const paginationdata=handlerPaginationData(data,currentpage)
        dispatch({type:'paginationdata',payload:paginationdata})
        console.log('this is data',paginationdata)
    },[state.myjobdata,currentpage])
  return (
    <>
    <div className='row mt-5  px-2'>
        <h4 className='pb-3'>My Requisition Details</h4>
        {state.spinner ? (<SpinnerLod/>):
    
        (<div className='table-rsponsive shadow px-0'>
        <table className='table  rounded'>
            <thead className='table-light py-4'>
              <tr>
                <th>Job title</th>
                <th onClick={()=>handlerSorting('jobPostingCode')}>Job ID</th>
                <th>Status</th>
                <th>No of Opening(s)</th>
                <th>Job post date</th>
                <th>Applied candidate(s)</th>
                <th>Created by</th>
                <th>View details</th>
                {/* <th>Edit</th> */}
                {/* <th>Delete</th> */}
                
              </tr>
            </thead>
            <tbody>
                { state.pagefilterdata.length>0?state.pagefilterdata.map((item)=> 
                <tr key={item.id}>
                <td>{item.jobTitle}</td>
                <td>{item.jobPostingCode} </td>
                <td className='text-success'>{item.jobStatusName}</td>
                
                <td>{item.noOfOpenings}</td>
                <td>{item.postedDate}</td>
                <td>{!item.totalCandidate ? 0:item.totalCandidate}</td>
                <td>Ravi</td>
                <td onClick={()=>handlerModal(item.id)}  ><i class="fa-regular fa-eye text-primary"></i></td>
                {/* <td><i class="fa-solid fa-pen text-success"></i></td> */}
                {/* <td><i class="fa-regular fa-trash-can text-danger"></i></td> */}
                
                
              </tr>)
                
                
:''}
            </tbody>

    </table>
    <div className='row pl-4'>
         <div className='pagination-container'>
         <ul className='pagination pl-3'>
          <li className={`page-item ${currentpage<=1?'disabled':''}`} onClick={()=>setCurrentPage(currentpage-1)}><a className='page-link' href='#'>Previous</a></li>
          {state.pageitem.pagenationItem && state.pageitem.pagenationItem }
          
          <li className={`page-item ${currentpage===state.pageitem.totalpage?'disabled':''}`} onClick={()=>setCurrentPage(currentpage+1)}><a className='page-link'>Next</a></li>
        </ul>
        <span className='ml-5 pagenumspan'>Page {currentpage && currentpage} of {state.pageitem.totalpage &&state.pageitem.totalpage}</span>

         </div>
       </div>

        </div>)}
    </div>
    

    {/* popup modal */}
  {showModal && <ReqDetailsModal showModal={showModal} closeModal={closeModal} reqId={state.jobId}/>}

    </>
  )
}
