import axios from "axios";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import encryptDecry from "../AuthFolder/EncryptDecry";
import Alertmessage from "../Alertmessage";
import SpinnerLod from "../LayoutPage/SpinnerLod";


const initialState={
  EmployeerDetails:[],
  message:{message:'',type:''},
  loader:false,
  fileuploaderror:'',
}

const reducer=(state,action)=>{
  switch(action.type){
    case 'employeerdetails':
      return {...state,EmployeerDetails:action.payload}
    case 'alertmessage':
      return {...state,message:{message:action.payload.message,type:action.payload.type}}
    case 'loader':
      return {...state,loader:action.payload}
    case 'fileupError':
      return {...state,fileuploaderror:action.payload}
    default:
      return state
  }
}
export default function Profile() {
  const [state,dispatch]=useReducer(reducer,initialState);
  const [Employeerupdate,SetEmployeerdetails]=useState({
    CompanyName: "",
    BusinessEmailId: "",
    FullName: "",
    MobileNo: "",
    CountryId: null,
    stateID: null,
    City: "",
    IndustryID: 0,
    Address1: "",
    Address2: "",
    ZipCode: "",
    noOfEmployee: "",
    TermConditionID: "",
    LogoUrl: ""

  });
  const handlerErrormessage=((message)=>{
    dispatch({type:'fileupError',payload:message})

    setTimeout(()=>{
      dispatch({type:'fileupError',payload:''})

    },3000)
  })

  const handlerInput=((e)=>{
    const {name,value,type,files}=e.target
    if(type==='number'&& name==='ZipCode' && value.length>8){
      return

  }
  if(type==='file'){
      
      if(files && files.length>0){
          const uploadfile=files[0]
          if(uploadfile.type==='image/jpeg'||uploadfile.type==='image/jpg'|| uploadfile.type==='image/png'){
              if(uploadfile.size <=1024 * 1024){
                  const reader=new FileReader()
                  console.log('this is reader',reader)
                  reader.onloadend=()=>{
                      const base64string=reader.result.split(',')[1];
                      console.log('this is base file conv',base64string)
                      
                      SetEmployeerdetails({...Employeerupdate,[name]:base64string});

                  }
                  reader.readAsDataURL(uploadfile)
                  console.log('this is reader',reader)
                  
              }
              else{
                  //console.log('file size should be 1mb')
                  
                  handlerErrormessage('file size should be 1mb')

              }
              //console.log('file size should be jpeg png')
          }
          else{
              handlerErrormessage('file format should be jpg, jpeg, png, svg')
              
          }
      }
  }

  else{
      SetEmployeerdetails({...Employeerupdate,[name]:value});

  }
    // console.log('thisis update',name,value)
    // SetEmployeerdetails({...Employeerupdate,[name]:value})
  })

  //alert message 
  const handlerAlertmessage=((message,type)=>{
    dispatch({type:'alertmessage',payload:{message:message,type:type}})

    setTimeout(()=>{
      dispatch({type:'alertmessage',payload:{message:'',type:''}})

    },3000)
  })
  const fetchCompanyAlldetails=useCallback(async()=>{
    
    try{
      console.log('hey pranya ')
      const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      const details=sessionStorage.getItem('userdetails')
      const decryObjectdetails=encryptDecry(details)
      const data=JSON.parse(decryObjectdetails)
      if(data.companyDetail.memberId){
        dispatch({type:'loader',payload:true})
        const response=await axios.post(`${baseUrl}/Register/getEmployer`,{'loginUserID':data.companyDetail.memberId,'companyID':data.companyDetail.companyID})
        dispatch({type:'loader',payload:false})
        console.log('this is fetch user',response)
        if(response.status===200){
          if(response.data.statusCode===200 && response.data.data){
            console.log('thjjisi is em paylo',response.data.data)
            dispatch({type:'employeerdetails',payload:response.data.data})
            const employerDetails=response.data.data;
            SetEmployeerdetails({
              CompanyName: employerDetails.companyName,
              BusinessEmailId: employerDetails.businessEmailId,
              FullName: employerDetails.firstName,
              MobileNo: employerDetails.mobileNo,
              CountryId: 2,
              stateID: 0,
              City: employerDetails.city,
              IndustryID: employerDetails.categoryId,
              Address1: employerDetails.address1,
              Address2: employerDetails.address2,
              ZipCode: employerDetails.zipCode,
              noOfEmployee: employerDetails.noOfEmployee,
              TermConditionID: employerDetails.termConditionID,
              LogoUrl: ""
              
            });

          }
        }


      }
      else{
        return ('not valid')
      }

      

    }
    catch(error){
      console.log('this is errror fetch user details profiel',error)

    }
  })

  useEffect(()=>{
    
    fetchCompanyAlldetails();
  },[]);
  const handlerFormSubmit=(async(e)=>{
    e.preventDefault();
    console.log('this is form update',Employeerupdate)

    try{
      const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      dispatch({type:'loader',payload:true})
      const response=await axios.post(`${baseUrl}/Register/UpdateEmployerRegisterDetails`,Employeerupdate)
      console.log('this is res up',response)
      dispatch({type:'loader',payload:false})
      if(response.status===200 && response.data.statusCode===200){
        fetchCompanyAlldetails()
        console.log('update sucess')
        handlerAlertmessage('Update sucussfully','success')
      }
      else if(response.data.statusCode===500){

        handlerAlertmessage(response.data.message,'warning')
      }
    }
    catch(error){
      handlerAlertmessage('something wrong','danger')
      console.log('this is er res s',error)
    }
  })


  return (
    <div className="container rounded bg-white shadow profilecontainermain">
      {state.message.message!==''?<Alertmessage message={state.message}/>:''}
      
      {state.loader?<SpinnerLod/>:
      <>{state.EmployeerDetails && !state.EmployeerDetails.isApproved?<div className="row"><h4 className="text-danger text-center">Account verification still in process  </h4></div>:''}
      <form onSubmit={handlerFormSubmit}  >
      <div className="row">
        <h4 className="profilePageheader">Profile Details</h4>
        <div className="col-md-3 border-right">
          <div className="d-flex  align-items-center text-center ">
            <img
              className="rounded-circle "
              width="150px"
              src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              alt="profile"
            />
            {/* <span className="font-weight-bold">Anuraag Nalam</span>
            <span className="text-black-50">anuraag@mail.com.my</span>
            <span> </span> */}
          </div>
        </div>
        <div className="col-md-9">
          
            <div className="row">
              <div className="col-md-6 my-2">
                <label className="" htmlFor="bemail">
                  Business email
                </label>
                <div
                  className="verifyinputbox"
                  style={{ position: "relative" }}
                >
                  <input
                    className="form-control "
                    name="BusinessEmailId"
                    disabled
                    value={state.EmployeerDetails && state.EmployeerDetails.businessEmailId && state.EmployeerDetails.businessEmailId}
                    type="text"
                    placeholder="Enter email"
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <i className="fa-regular fa-circle-check veryfyicon"></i>
                  </span>
                </div>
              </div>
              <div className="col-md-6 my-2">
                <label className="" htmlFor="name">
                  Full name
                </label>
                <input
                  className="form-control"
                  required
                  name="FullName"
                  value={Employeerupdate.FullName}
                  type="text"
                  placeholder="Enter name"
                  onChange={handlerInput}
                />
              </div>
              <div className="col-md-6 my-2">
                <label className="" htmlFor="mobile">
                  Mobile
                </label>
                <PhoneInput
                  className="number"
                  name="MobileNo"
                  value={Employeerupdate.MobileNo}
                  country={"in"}
                  onChange={(phone)=>SetEmployeerdetails({...Employeerupdate,MobileNo:phone})}
                />
              </div>
            </div>
          
        </div>
      </div>
      <hr></hr>
      <div className="row my-3">
        <h4 className="profilePageheader">Company Details</h4>
      </div>

      <div className="row">
        <div className="col-md-6 my-2">
          <label className="" htmlFor="company">
            Company name
          </label>
          <input
            className="form-control"
            required
            maxLength={40}
            name="CompanyName"
            value={Employeerupdate.CompanyName}
            onChange={handlerInput}
            type="text"
            placeholder="Enter company name"
          />
        </div>

        <div className="col-md-6 my-2">
          <label className="" htmlFor="address 1">
            Address 1
          </label>
          <input
            className="form-control"
            required
            maxLength={60}
            name="Address1"
            value={Employeerupdate.Address1}
            onChange={handlerInput}
            type="text"
            placeholder="Enter address 1"
          />
        </div>
        <div className="col-md-6 my-2">
          <label className="" htmlFor="address 2">
            Address 2
          </label>
          <input
            className="form-control"
            maxLength={60}
            name="Address2"
            value={Employeerupdate.Address2}
            onChange={handlerInput}
            type="text"
            placeholder="Enter address 2"
          />
        </div>

        <div className="col-md-6 my-2">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            placeholder="search city"
            className="form-control"
            name="City"
            value={Employeerupdate.City}
            onChange={handlerInput}
          />
          {/* {showCityDropdown && searchCityText!==''?<ul className='citylistitem shadow'>
                { citylist && citylist.map((suggestion) => (
                  <li key={suggestion.id} value={suggestion.name} onClick={()=>{setEmployeerDetails({...EmployeerDetails,'City':suggestion.name});setSearchCityText(suggestion.name);setShowCityDropdown(false)}} >
                    {suggestion.name} , {suggestion.countryName}
                  </li>
                ))}
              </ul>:''} */}
        </div>

        <div className="col-md-6 my-2">
          <label className="" htmlFor="email">
            Pin/Zip code
          </label>
          <input
            className="form-control"
            maxLength={8}
            required
            value={Employeerupdate.ZipCode}
            onChange={handlerInput}

            type="number"
            name="ZipCode"
            placeholder="Enter pin code"
          />
        </div>
        <div className="col-md-6 my-2">
          <label htmlFor="Industry" className="form-labe">
            Industry
          </label>
          <select className="form-select" required 
          value={Employeerupdate.IndustryID}
          onChange={handlerInput}

          name="IndustryID">
            <option>Select Industry</option>
            {/* {state.Industrydata? state.Industrydata.map((item)=>(
                <option key={item.id} value={item.id}>{item.name}</option>

            )):'Industry not found'} */}
          </select>
        </div>
        <div className="col-md-6 my-2">
          <label htmlFor="Industry" className="form-label">
            Number of employees in your company
          </label>
          <select className="form-select" onChange={handlerInput} value={Employeerupdate.noOfEmployee} name="noOfEmployee" required>
            <option>Select Number of employees</option>
            <option value="10">5-10</option>
            <option value="20">10-20</option>
          </select>
        </div>

        <div className="col-md-6 my-2">
          <label className="" htmlFor="email">
            Upload Logo
          </label>
          <input
            className="form-control"
            type="file"
            name="LogoUrl"
            placeholder="Enter Email"
            onChange={handlerInput}
          />
          {state.fileuploaderror!==''?<p className='text-danger'>{state.fileuploaderror}</p>:<p className='text-secondary'>please upload jpg, jpeg, png or svg ;file size less than 1 MB</p>} 
          
          {/* {errorMessage?<p className='text-danger'>{errorMessage}</p>:<p className='text-secondary'>please upload jpg, jpeg, png or svg ;file size less than 1 MB</p>}  */}
        </div>
        <div className="col-md-12 my-2">
        <img alt="componelogo" className="profilepageLogo" src={state.EmployeerDetails && state.EmployeerDetails.logoUrl} />
          {/* <div className="form-check term_condText">
    <label className="form-check-label ">
      <input className="form-check-input"  value={state.Term_Condition && state.Term_Condition.map((item)=>item.id)} onChange={(e)=>setEmployeerDetails({...EmployeerDetails,TermConditionID:e.target.checked?e.target.value:''})}  required type="checkbox"  name="TermConditionID" /> 
      I agree to allow CareerpageXP to use the above-provided details for my Employer profile and accept the <a href='#' data-bs-toggle='modal' data-bs-target='#termcondition'>Terms & Conditions</a>
    </label>
    </div> */}
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn loginbtn">
            update
          </button>
        </div>
      </div>
      </form></>}

    </div>
  );
}
