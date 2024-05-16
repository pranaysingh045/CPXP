import React, { useEffect, useReducer, useState } from 'react'
import { handlerSearchCity } from '../../Common/CityFilter'
import axios from 'axios'
import Alertmessage from '../../Alertmessage'


const initialState={
    citysearchtext:'',
    cityfilterdata:[],
    message:{message:'',type:''},
    categoryData:[],
}

const reducer=(state,action)=>{
    switch(action.type){
        case 'filtercitytext':
            return {...state,citysearchtext:action.payload}
        case 'cityfilterList':
            return {...state,cityfilterdata:action.payload}
        case 'categorydata':
            return{...state,categoryData:action.payload}
        case 'alertmessage':
            return{...state,message:{message:action.payload.message,type:action.payload.type}}
        default:
            return state

    }
}
export default function ExperienceModal({showModal,closeModal,id}) {
    const [state,dispatch]=useReducer(reducer,initialState)
    const [exprencedetails,setExprienceDetails]=useState({
        companyName:'',
        positionName:'',
        countryID:'',
        city:'',
        dateFrom:'',
        dateTo:'',
        isTillDate:false,
        responsibilities:'',
        categoryId:'',
        memberId:3030,
        loginUserID:3030
    })
    //handler input 
    const handlerInpu=((e)=>{
        const {name,value}=e.target
        console.log('this is exp call',name,value)
        setExprienceDetails({...exprencedetails,[name]:value})

    })
    // get details by exp id

    useEffect(()=>{
        const fetchexpById=(async()=>{
            if(id){
                console.log('this is edit data',id)
                try{
                    const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                    const data={"id":3030}
                    const response=await axios.get(`${baseUrl}/MemberExperience/GetMemberExperience/${id}`,data)
                    console.log('this is exp details byid',response)
                    if(response.status===200 && response.data.statusCode===200){
                        const data=response.data.data[0]
                        setExprienceDetails({...exprencedetails,
                                companyName:data.companyName,
                                positionName:data.positionName,
                                //city id add 
                                city:data.city,
                                dateFrom:(data.dateFrom).split("T")[0],
                                dateTo:(data.dateTo).split("T")[0],
                                isTillDate:data.isTillDate,
                                responsibilities:data.responsibilities,
                                categoryId:data.categoryId
                            
                        })

                    }
    
                }
                catch(error){
                    console.log('this is error message',error)
                }
            }
        });
        fetchexpById()

    },[id])
    // category details get
    useEffect(()=>{
        const fetchCategory=(async()=>{
            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                //later check exprence details having not null vallue
                const response=await axios.get(`${baseUrl}/Industry/getIndustries`)
                console.log('this is category res',response)
                if(response.status===200 && response.data.statusCode===200){
                    dispatch({type:'categorydata',payload:response.data.data})
                }

                
            }
            catch(error){
                //alert handler later
                console.log('this fetch industry error',error)
                

            }
        });
        fetchCategory()

    },[])
    //city get details
    const handlersearchCity=((searchText)=>{
        dispatch({type:'filtercitytext',payload:searchText})
        if(searchText!==''){
            const filterCitydata=handlerSearchCity(searchText).then(data=>{
                console.log('this is ff city dd',data)
                dispatch({type:'cityfilterList',payload:data})
            }).catch(error=>{
                console.log('this is filter city error')
            })
            console.log('this is filter cc',filterCitydata)
        }
    });

    const handlerSelectCity=((cname,countryid)=>{
        //set country id and city here
        setExprienceDetails({...exprencedetails,city:cname,countryID:countryid})
        // exprencedetails.city=cname
        // exprencedetails.countryID=countryid
        console.log('this  is country and city name',cname,countryid)

    });
//form submition
    const handlerFormSubmit=(async(e)=>{
        e.preventDefault()
        console.log('this is form submit',exprencedetails)
        try{
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            if(id){
                console.log('this is update exprence req',id)
                const response=await axios.put(`${baseUrl}/MemberExperience/UpdateMemberExperience/${id}`,exprencedetails)
                console.log('this is response update exprence',response)
                if(response.status===200 && response.data.statusCode===200){
                    handlerAlertmessage(response.data.message,'success')
                }
            }
            else{
                console.log('this is add requ',id)
                const response=await axios.post(`${baseUrl}/MemberExperience/AddMemberExperience`,exprencedetails)
                console.log('this is response suv',response)
                if(response.status===200 && response.data.statusCode===200){
                    handlerAlertmessage(response.data.message,'success')
                }
            }
            
            

        }
        catch(error){
            console.log('this is error form sub',error)
            handlerAlertmessage('something wrong','warning')

        }
    });
//handler alert message
const handlerAlertmessage=((message,type)=>{
    dispatch({type:'alertmessage',payload:{message:message,type:type}})
    setTimeout(()=>{
        dispatch({type:'alertmessage',payload:{message:'',type:''}})

    },3000)
})
  return (
    <>
<div className={`modal backdropmodal ${showModal?'show':''}`} id='modaleducation' style={{display:showModal?'block':'none'}}>
        <div className='modal-dialog modal-dialog-centered modal-lg'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>{id && id?<span className='text-info'>Edit Exprience</span>:'Add Exprience'}</h4>
                    <button className='btn btn-close' data-bs-dismiss='modal' onClick={closeModal} type='button'></button>
                </div>
                <div className='modal-body'>
                    {state.message.message.length>0 && <Alertmessage message={state.message} />}
                    <form onSubmit={handlerFormSubmit}>
                    <div className='row my-3'>
                    <div className='col-md-6 mt-2'>
                        <div className='form-group'>
                            <label for='title'>Employer/Company Name</label>
                            <input type='text' value={exprencedetails.companyName} onChange={handlerInpu} id='title' name='companyName' className='form-control' placeholder='Document title'/>
                        </div>
                    </div>

                    <div className='col-md-6 mt-2'>
                        <div className='form-group'>
                            <label for='title'>Job Title </label>
                            <input type='text' value={exprencedetails.positionName} onChange={handlerInpu} id='title' name='positionName' className='form-control' placeholder='Document title'/>
                        </div>
                    </div>
                    <div className='col-md-6 mt-2'>
                        <div className='form-group '>
                                <label for='title'>Category</label>
                                <select type='text' value={exprencedetails.categoryId} id='title' onChange={handlerInpu} name='categoryId' className='form-control' placeholder='Document title'>
                                <option value=''>select category</option>
                                {state.categoryData && state.categoryData.map((item)=>
                                    <option key={item.id} value={item.id}>{item.name}</option>

                                )}
                                
                                
                                </select>
                        </div>

                    </div>
                    <div className='col-md-6 mt-2'>
                    <div className='form-group '>
                            <label for='title'>City </label>
                            <input type='text' id='title' value={state.citysearchtext} onChange={(e)=>handlersearchCity(e.target.value)} className='form-control' placeholder='Document title' />
                           {state.citysearchtext!=='' && state.cityfilterdata.length>0?<ul className='shadow  rounded citydropdown'>
                                {state.cityfilterdata.length>0?(state.cityfilterdata.map((item)=>
                                <li value={item.name} key={item.id} onClick={()=>{handlerSelectCity(item.name,item.countryId);handlersearchCity(item.name+', '+item.countryName)}}>{item.name}, {item.countryName}</li>
                                )):('not found city')}
                            </ul>:''}
                            
                    </div>

                    </div>
                    </div>
                    <div className='row'>
                    <div className='col-md-5'>
                    <div className='form-group'>
                            <label for='title'>From </label>
                            <input type='date' value={exprencedetails.dateFrom} onChange={handlerInpu} name='dateFrom' id='title' className='form-control' />
                        </div>
                    </div>
                    <div className='col-md-5'>
                    <div className='form-group'>
                            <label for='title'>To</label>
                            <input type='date' value={exprencedetails.dateTo} onChange={handlerInpu} name='dateTo' id='title' className='form-control' />
                        </div>
                    </div>


                    </div>
                    
                        

                    <div className='row my-3'>
                        
                    <div className='form-group '>
                            <label for='dis'>Project</label>
                            <textarea type='text' value={exprencedetails.responsibilities} onChange={handlerInpu} name='responsibilities' id='dis' className='form-control' placeholder='Description'/>
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
