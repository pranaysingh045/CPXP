import React, { useEffect, useState } from "react";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import Alertmessage from "../../Alertmessage";

export default function CandidateProfile() {
  const [profiledata,setProfiledata]=useState([])
  const [message,setMessage]=useState({message:'',type:''})
  const [fileuperror,setfileuperror]=useState('')
  const [profileUpdate,setProfileDetails]=useState({
    memberID: 3032,
    fullName: "",
    gender: null,
    cellPhone: "",
    birthDate: "",
    countryId: null,
    permanentCity: "",
    totalWorkExpYear: "",
    totalWorkExpMonth: null,
    currentCTC: null,
    currentHourlyCurrencyLookupId: null,
    currentSalaryPayCycle: null,
    expectedCTC: null,
    expectedHourlyCurrencyLookupId: null,
    expectedSalaryPayCycle: null,
    currentPosition: "",
    preferredLocation: "",
    noticePeriod: "",
    industryID: null,
    aboutMe: "null",
    photoSource: "",
    photoFileName: "",
    passportNumber:"",
    permanentAddressLine1:"",
    primaryEmail:"", 
    permanentAddressLine2:"",
    loginUserID: 3032
  })
  useEffect(()=>{

    const fetchProfiledetails=(async()=>{
      try{
        const baseUrl=process.env.REACT_APP_API_URL_LOCAL
      const data={"memberID":3030}
      const response=await axios.post(`${baseUrl}/Candidate/CandidateProfile`,data)
      console.log('this is fetch dat profioile',response)
      if(response.status===200 && response.data.statusCode===200){
        console.log('this is peofile data',response.data.data)
        setProfiledata(response.data.data.memberProfile[0])
        const data=response.data.data.memberProfile[0]
        console.log('this is ppp xxy dats',data)
        setProfileDetails(prevState=>({...prevState,
          primaryEmail:data.primaryEmail,
          fullName: data.fullName,
          gender: data.gender,
          cellPhone: data.cellPhone,
          birthDate: String(data.dateOfBirth).split(" ")[0],
          countryId: data.countryId,
          permanentCity: data.permanentCity,
          totalWorkExpYear: data.totalWorkExpYear,
          totalWorkExpMonth: data.totalWorkExpMonth, //totalexperience required
          currentCTC: data.currentYearlyRate,
          currentHourlyCurrencyLookupId: data.currentHourlyCurrencyLookupId,
          currentSalaryPayCycle: data.currentSalaryPayCycle,
          expectedCTC: data.expectedYearlyRate,
          expectedHourlyCurrencyLookupId: data.expectedHourlyCurrencyLookupId,
          expectedSalaryPayCycle: data.expectedSalaryPayCycle,
          currentPosition: data.currentPosition,
          preferredLocation: data.preferredLocation,
          noticePeriod: data.noticePeriod,
          industryID: data.industryID,
          aboutMe: data.aboutMe,
          photoSource: data.photoSource,
          photoFileName: data.photoFileName,
          passportNumber:data.passportNumber,
          permanentAddressLine1:data.permanentAddressLine1,
          permanentAddressLine2:data.permanentAddressLine1,
          loginUserID: 3032
        }));

        console.log('this is profile update data after',profileUpdate)
        
      }
      }
      catch(error){
        console.log('this is error profile d',error)
      }

    });
    fetchProfiledetails()

  },[])

const handlerInput=((e)=>{
  const {name,value,type,files}=e.target
  //console.log('this is profile input handler',name,value)
  if(type==='file'){
            
    if(files && files.length>0){
        const uploadfile=files[0]
        if(uploadfile.type==='image/jpg' || uploadfile.type==='image/png' || uploadfile.type==='image/jpeg'){
            if(uploadfile.size<=1024* 1024){
                const reader=new FileReader()
                reader.onloadend=()=>{
                    const base64string=reader.result.split(',')[1];
                    console.log('this is base file conv',base64string)
                    setProfileDetails({...profileUpdate,[name]:base64string,photoFileName:uploadfile.name});
                }
                reader.readAsDataURL(uploadfile)
                
                console.log('this is name fil',uploadfile.name)
                console.log('this is reader',reader)
                setfileuperror('')
            }
            else{
              setfileuperror('file size should be less than 1 MB')
                console.log('file size should be 1mb')
            }
        }
        else{
            console.log('file formate should pdf')
            setfileuperror('file formate should be Jpg,Png,Jpeg')
        }
    }

}
else{
  setProfileDetails({...profileUpdate,[name]:value})
}
  
  // setProfileDetails({...profileUpdate,[name]:value})
  
})
// profile update
const handlerProfileUpdate=(async(e)=>{
  e.preventDefault()
  
  try{
    const baseUrl=process.env.REACT_APP_API_URL_LOCAL
    setProfiledata({...profiledata,loginUserID:3030})
    console.log('this is from data update details',profileUpdate)
    const response=await axios.post(`${baseUrl}/Candidate/UpdateCandidate`,profileUpdate)
    console.log('this is update respo',response)
    if(response.status===200 && response.data.statusCode===200){
      handlerAlertmessage(response.data.message,'success')
    }

  }
  catch(error){
    console.log('this is update profile error',error)
    if(error.response.status===400){
      handlerAlertmessage('required field error','warning')
    }
    else{
    console.log('this is update profile error',error)
    handlerAlertmessage('Internal error','warning')
  }
  }

})

// alert message

const handlerAlertmessage=(message,type)=>{
  setMessage({message:message,type:type})
  setTimeout(()=>{
    setMessage({message:'',type:''})
  },3000)
}
  
  return (
    <div className="container bg-ligh">
 <div className="shadow rounded p-2">
  {message.message!=''?<Alertmessage message={message}/>:''}
<ul class="nav nav-tabs " role="tablist">
    <li class="nav-item">
      <a class="nav-link active" data-bs-toggle="tab" href="#profile">Profile</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="tab" href="#education">Education</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="tab" href="#exprience">Exprience</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-bs-toggle="tab" href="#skill">Skills</a>
    </li>
  </ul>
      
  <div class="tab-content">
 
    <div id="profile" class="container tab-pane active"><br/>
    <form onSubmit={handlerProfileUpdate}>
    <div className="row shado rounde">
        
        <div className="col-md-2">
          {/* <h4 className="profilePageheader">Profile Details</h4> */}
          <div className="d-flex  align-items-center text-center ">
            <img
              className="rounded-circle candidatimage"
              width="150px"
              
              // src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
              src={profiledata.candidatePhoto}
              alt="profile"
            />
            {/* <span className="font-weight-bold">Anuraag Nalam</span>
          <span className="text-black-50">anuraag@mail.com.my</span>
          <span> </span> */}
          </div>
        </div>

        <div className="col-md-10 ">
          {/* <div className="bg-light rounded py-2">
            <h5 className="text-center">{profiledata.firstName}</h5>
            <p className="candidatebasicdetails"><span><i class="fa-regular fa-envelope"></i> {profiledata.primaryEmail}</span><span><i class="fa-solid fa-mobile-screen-button"></i> {profiledata.primaryEmail}</span></p>
            <p className="candidatebasicdetails"><span><i class="fa-solid fa-location-dot"></i> {profiledata.permanentCity} </span><span><i class="fa-solid fa-briefcase"></i> {profiledata.currentPosition}</span></p>
            
            <p><i class="fa-solid fa-indian-rupee-sign"></i> {profiledata.currentYearlyRate} <span><i class="fa-solid fa-indian-rupee-sign"></i> {profiledata.expectedYearlyRate}</span></p>
            <p>Exprience : {profiledata.totalExperienceYears}</p>

          </div> */}
          <div className="row profilepagefirstrow">
            {/* <div className="col-md-4">
              <div className="form-group">
                <label>User name</label>
                <input type="text" name="userName"  value={profileUpdate.userName} className="form-control" placeholder="User name"/>
              </div>
            </div> */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Primary Email</label>
                <input name="primaryEmail" disabled value={profileUpdate.primaryEmail} type="text" className="form-control" placeholder="Enter email"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label for='fullname'>Full name</label>
                <input type="text" name="firstName" onChange={handlerInput} value={profileUpdate.fullName} id='fullname' className="form-control" placeholder="full name"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Phone</label>
                <input name="cellPhone" onChange={handlerInput} value={profileUpdate.cellPhone} type="text" className="form-control" placeholder="Enter phone number"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>DOB</label>
                <input type="date" name="dateOfBirth" onChange={handlerInput} value={profileUpdate.dateOfBirth} className="form-control" placeholder="full name"/>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>Current position</label>
                <input name="currentPosition" onChange={handlerInput} value={profileUpdate.currentPosition} type="text" className="form-control" placeholder="Current position"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Total Exprience</label>
                <input name="totalWorkExpYear" onChange={handlerInput} value={profileUpdate.totalWorkExpYear} type="text" className="form-control" placeholder="Toal exprience"/>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>Current Salary</label>
                <input name="currentCTC" onChange={handlerInput} value={profileUpdate.currentCTC} type="text" className="form-control" placeholder="Enter Current salary"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Expected salary</label>
                <input name="expectedCTC" onChange={handlerInput} value={profileUpdate.expectedCTC} type="text" className="form-control" placeholder="Expected salary"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Job Type</label>
                <select type="text" name="jobTypeLookupId" onChange={handlerInput} value={profileUpdate.jobTypeLookupId} className="form-control" >
                  <option>Permanent</option>
                  <option>Contract</option>
                  </select>
              </div>
            </div>

            


            
            {/* <div className="col-md-4">
              <div className="form-group">
                <label>Country</label>
                <input  name="permanentCountryId"  value={profileUpdate.permanentCountryId} type="text" className="form-control" placeholder="Enter country"/>
              </div>
            </div> */}
            
           

            
          </div>



        </div>
        
    
    </div>
    <hr></hr>
    <div className="row profilepagefirstrow">
    <div className="col-md-4">
              <div className="form-group">
                <label>Permanent Address1</label>
                <input name="permanentAddressLine1" onChange={handlerInput} value={profileUpdate.permanentAddressLine1} type="text" className="form-control" placeholder="Enter address"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Permanent Address2</label>
                <input name="permanentAddressLine2" onChange={handlerInput} value={profileUpdate.permanentAddressLine2} type="text" className="form-control" placeholder="Enter address"/>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label>City</label>
                <input name="permanentCity" onChange={handlerInput}  value={profileUpdate.permanentCity} type="text" className="form-control" placeholder="Enter City"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Pin/Zip code</label>
                <input name="permanentZip" onChange={handlerInput} value={profileUpdate.permanentZip} type="text" className="form-control" placeholder="Enter zip/pin code"/>
              </div>
            </div>
    
            
           
            
            <div className="col-md-4">
              <div className="form-group">
                <label>Available From</label>
                <input type="text" name="availableDate" onChange={handlerInput} value={profileUpdate.availableDate} className="form-control" placeholder="Available from"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Passport</label>
                <select name="passportNumber" onChange={handlerInput} value={profileUpdate.passportNumber} type="text" className="form-control" >
                  <option>Yes</option>
                  <option>No</option>
                  </select>
              </div>
            </div>
           {/* it should not update by candidate keep near photo */}
            {/* <div className="col-md-4">
              <div className="form-group">
                <label>Remarks</label>
                <input type="text" name="remarks" onChange={handlerInput} value={profileUpdate.remarks} className="form-control" placeholder="Remarks"/>
              </div>
            </div> */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Pasport number</label>
                <input name="passportNumber" onChange={handlerInput} value={profileUpdate.passportNumber} type="text" className="form-control" placeholder="Pasport number"/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Id card</label>
                <input type="text" name="idCardLookUpId" onChange={handlerInput} value={profileUpdate.idCardLookUpId} className="form-control" placeholder="Id card"/>
              </div>
            </div>
            {/* current roal and current position there two i think it is same */}
            {/* <div className="col-md-4">
              <div className="form-group">
                <label>Current role</label>
                <input name="currentrole" value={profileUpdate.currentrole} onChange={handlerInput} type="text" className="form-control" placeholder="Current role"/>
              </div>
            </div> */}
            <div className="col-md-4">
              <div className="form-group">
                <label>Photo</label>
                <input type="file" name="photoSource" onChange={handlerInput}  className="form-control" />
                {fileuperror && <span className="text-danger">{fileuperror}</span>}
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label>About me</label>
                <textarea rows={6} type="text" name="aboutMe" onChange={handlerInput} value={profileUpdate.aboutMe} className="form-control" placeholder="About me"/>
              </div>
            </div>

            <button className="btn btn-primary" type="submit">Update</button>


    </div>  
    </form>

    </div>
    
    <div id="education" class="container tab-pane fade"><br/>

    <div className="row my-3">
            <Education  />
          </div>



      
    </div>
    <div id="exprience" class="container tab-pane fade"><br/>
    <div className="row my-3">
            <Experience />
          </div>
    </div>
    <div id="skill" class="container tab-pane fade"><br/>
    <div className="row my-3">
            <Skills />
          </div>
    </div>
    </div>
  </div>
     
      
      {/* skill details */}
      
          
         
          
       
    </div>
  );
}
