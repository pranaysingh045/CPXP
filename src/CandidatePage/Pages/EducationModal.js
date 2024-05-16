import React, { useEffect, useReducer, useState } from "react";
import { handlerSearchCity } from "../../Common/CityFilter";
import axios from "axios";
import Alertmessage from "../../Alertmessage";

const initialState={
    cityfilterdata:[],
    citysearchtext:'',
    DegreeType:[],
    message:{message:'',type:''}
}

const reducer=(state,action)=>{
    switch(action.type){
        case 'cityfilerdata':
            return {...state,cityfilterdata:action.payload}
        case 'filtercitytext':
            return {...state,citysearchtext:action.payload}
        case 'degreetype':
            return {...state,DegreeType:action.payload}
        case 'alertmessage':
            return {...state,message:{message:action.payload.message,type:action.payload.type}}
        default:
            return state
    }

}
export default function EducationModal({ showModal, closeModal, id }) {

    const [state,dispatch]=useReducer(reducer,initialState)
    const [educationFormdetails,setEduFormdetails]=useState({
        memberId:3030,
        levelOfEducationLookupId:null,
        degreeTitle:'',
        fieldOfStudyLookupId:0,
        majorSubjects:'',
        gpa:'',
        gpaOutOf:'100',
        attendedFrom:'',
        attendedTo:'',
        degreeObtainedYear:'',
        instituteName:'',
        instituteCity:'',
        instituteCountryId:null,
        briefDescription:'',
        isHighestEducation:false,
        loginUserID:3030
    })

    const handlerInput=((e)=>{
        const {name,value}=e.target
        if(name=='isHighestEducation'){
          const highteducatio=e.target.value?true:false;
          setEduFormdetails({...educationFormdetails,isHighestEducation:highteducatio})
        }
        else{
          setEduFormdetails({...educationFormdetails,[name]:value})

        }
        
        console.log(name,value)
    })

    const handlerAlertMessage=(message,type)=>{
        dispatch({type:'alertmessage',payload:{message:message,type:type}})

        setTimeout(()=>{
            dispatch({type:'alertmessage',payload:{message:'',type:''}})

        },3000)
    }

    

    const handlerFormsubmit=(async(e)=>{
        e.preventDefault()

        try{
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            const response = await axios.post(`${baseUrl}/MemberEducation/AddMemberEducation`,educationFormdetails)
            if(response.status===200 && response.data.statusCode===200){
                handlerAlertMessage(response.data.message,'success')

            }
            
        }
        catch(error){
            console.log('this is education ero',error)
            handlerAlertMessage('Internal error','warning')

        }
        console.log('this  is form ed det',educationFormdetails)
    })


    const handlersearchCity=((searchText)=>{
        dispatch({type:'filtercitytext',payload:searchText})
        if(searchText!==''){
            const filterCitydata=handlerSearchCity(searchText).then(data=>{
                console.log('this is ff city dd',data)
                dispatch({type:'cityfilerdata',payload:data})
            }).catch(error=>{
                console.log('this is filter city error',error)
            })
            console.log('this is filter cc',filterCitydata)
        }
    });

    const handlerSelectCity=((cname,countryid)=>{
      console.log('this  is education country and city name',cname,countryid)
        //set country id and city here
        setEduFormdetails({...educationFormdetails,instituteCity:cname,instituteCountryId:countryid})
        // exprencedetails.city=cname
        // exprencedetails.countryID=countryid
        console.log('this  is education country and city name',cname,countryid)

    });

    useEffect(()=>{

        const fetchDegreeType=(async()=>{
            try{
                const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                //later check exprence details having not null vallue
                const data={
                    "lookupType": 5 
                  }
                const response=await axios.post(`${baseUrl}/Master/GetGenericLookupByType`,data)
                console.log('this is education type res',response)
                if(response.status===200){
                    dispatch({type:'degreetype',payload:response.data})
                }

                
            }
            catch(error){
                //alert handler later
                console.log('this fetch industry error',error)
                

            }
        });
        fetchDegreeType()

    },[]);
// get education details
    useEffect(()=>{
       const fetchEducationById=(async()=>{
        if(id){
          console.log('this is education by id',id)
          try{
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            const data={ "id":3030}
            console.log('this is education by id222',id)
            const response=await axios.get(`${baseUrl}/MemberEducation/GetMemberEducation/${id}`,data)
            console.log('this is response education',response)
            if(response.status===200 && response.data.statusCode===200){
              const data=response.data.data
              console.log('this is response data get by id',data)
              setEduFormdetails({...educationFormdetails,
                memberId:3030,
                levelOfEducationLookupId:null,
                degreeTitle:data[0].degreeTitle,
                fieldOfStudyLookupId:0,
                majorSubjects:data[0].majorSubjects,
                gpa:data[0].gpa,
                gpaOutOf:data.gpaOutOf,
                attendedFrom:(data[0].attendedFrom).split("T")[0],
                attendedTo:(data[0].attendedTo).split("T")[0],
                degreeObtainedYear:data[0].degreeObtainedYear,
                instituteName:data[0].instituteName,
                instituteCity:data[0].instituteCity,
                // instituteCountryId:data[0].instituteCity,
                briefDescription:data[0].briefDescription,
                isHighestEducation:data[0].isHighestEducation,
                loginUserID:3030
              })
            }
  
          }
          catch(error){
            console.log('this is error fetch by id ',error)
          }
         }
       });

       fetchEducationById()

    },[id])
  return (
    <>
      <div
        className={`modal backdropmodal ${showModal ? "show" : ""}`}
        id="modaleducation"
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                {id && id ? (
                  <span className="text-info">Edit Education</span>
                ) : (
                  "Add Education"
                )}
              </h4>
              <button
                className="btn btn-close"
                data-bs-dismiss="modal"
                onClick={closeModal}
                type="button"
              ></button>
            </div>
            <div className="modal-body">
                {state.message.message.length!=''?<Alertmessage message={state.message} />:''}
                <form onSubmit={handlerFormsubmit} >

              <div className="row my-3">
                <div className="col-md-6 mb-2">
                <div className="form-group ">
                  <label for="title">University/College/School Name</label>
                  <input
                    type="text"
                    id="title"
                    value={educationFormdetails.instituteName}
                    className="form-control"
                    placeholder="Document title"
                    name='instituteName'
                    onChange={handlerInput}
                  />
                </div>
                </div>
                <div className="col-md-6 mb-2">
                <div className="form-group ">
                  <label for="title">Upload Certificate</label>
                  <input
                    type="file"
                    id="title"
                    className="form-control"
                    placeholder="Document title"
                    onChange={handlerInput}
                  />
                </div>
                </div>
              
                <div className="col-md-6 mb-2">
                  <div className="form-group">
                    <label for="title">Level Of Education</label>
                    <select
                      type="text"
                      id="title"
                      value={educationFormdetails.levelOfEducationLookupId}
                      name="levelOfEducationLookupId"
                      className="form-control"
                      placeholder="Document title"
                      onChange={handlerInput}
                    >
                        <option>Select degree</option>
                        {state.DegreeType.length>0?(state.DegreeType.map((item)=>
                            <option key={item.id} value={item.id}>{item.name}</option>

                        )):''}
                    </select>
                    
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="form-group ">
                    <label for="dis">Degree/Exam Title</label>
                    <input type="text" value={educationFormdetails.degreeTitle} name="degreeTitle" id="dis" onChange={handlerInput} className="form-control" />
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="form-group ">
                    <label for="dis">Major</label>
                    <input type="text" name="majorSubjects" value={educationFormdetails.majorSubjects} id="dis" onChange={handlerInput} className="form-control" />
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="form-group ">
                    <label for="dis">Passing (%)</label>
                    <input type="text" name="gpa" value={educationFormdetails.gpa} onChange={handlerInput} id="dis" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="form-group ">
                    <label for="dis">Duration</label>
                    <div class="input-group mb-3">                        
                        <input type="date" name="attendedFrom" value={educationFormdetails.attendedFrom} onChange={handlerInput} class="form-control" placeholder="First Name" />
                        <input type="date" name="attendedTo" value={educationFormdetails.attendedTo} onChange={handlerInput} class="form-control" placeholder="Last Name" />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <div className="form-group ">
                    <label for="dis">City</label>
                    <input type="text" value={state.citysearchtext}  onChange={(e)=>handlersearchCity(e.target.value)} className="form-control" />
                    {state.citysearchtext!=='' && state.cityfilterdata.length>0?<ul className='shadow  rounded citydropdown'>
                                {state.cityfilterdata.length>0?(state.cityfilterdata.map((item)=>
                                <li value={item.name} key={item.id} onClick={()=>{handlerSelectCity(item.name,item.countryId);handlersearchCity(item.name+', '+item.countryName)}}>{item.name}, {item.countryName}</li>
                                )):('not found city')}
                            </ul>:''}
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="form-group ">
                  <label for="dis">About Degree</label>
                  <textarea
                    type="text"
                    id="dis"
                    className="form-control"
                    placeholder="Description"
                    name="briefDescription"
                    onChange={handlerInput}
                  />
                </div>
                {/* Is Highest Education? */}
                <div className="form-group mt-3">
                <div class="form-check mb-3">
                    <label class="form-check-label">
                    <input class="form-check-input"   onChange={handlerInput} type="checkbox" name="isHighestEducation" /> Is Highest Education?
                    </label>
                </div>
                </div>
              </div>

              <button className="btn btn-primary">Submit</button>
              </form>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
