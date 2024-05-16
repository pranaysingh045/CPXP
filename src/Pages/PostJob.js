import React, { useMemo, useRef } from 'react'
// import './JobPost.css';
import '../CSS/postnewjob.css'
import Select from 'react-select';
import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import encryptDecry from '../AuthFolder/EncryptDecry'
import Alertmessage from '../Alertmessage';
 
// const jdTemplate = [
//     { value: 'Select Country', label: 'Select Country' },
//     { value: 'Java Dev', label: 'Java Dev' },
//     { value: 'Tester', label: 'Tester' },
//     { value: 'Recruitment Specialist', label: 'Recruitment Specialist' },
//     { value: 'Software developer .net', label: 'Software developer .net' }
// ];
// const jobTypeValues = [
//     { value: 'Please Select', label: 'Please Select' },
//     { value: 'Full Time', label: 'Full Time' },
//     { value: 'Part Time', label: 'Part Time' },
//     { value: 'Freelancer', label: 'Freelancer' },
//     { value: 'Other', label: 'Other' },
// ];
const initialState = {
    countryCity: [],
    industry: [],
    selectedCountry: null,
    selectedIndustry: null,
    jdTemplateValue: '',
    jobValue: null,
    skills: [],
    input: '',
    dropdownSelectedValue: '',
    clicked: false,
    skilldata: [],
    selectedByKeyboard: -1,
    jdTemplate:[],
    jobTypeValues:[],
    setfilterCitydata:[],
    searchcitytextvalue:'',
    searchcitydropdown:true,
    selectedskillid:[],
    aisearchText:'',
    
    
    
};
 
function reducer(state, action) {
    switch (action.type) {
        case 'SET_COUNTRY_CITY':
            return { ...state, countryCity: action.payload }
        case 'searchtextforcity':
          return {...state,setfilterCitydata:action.payload.data,searchcitytextvalue:action.payload.searchtext}
        case 'SET_INDUSTRY':
            let industries = [];
            industries = action.payload && action.payload.map(opt => ({ label: opt.name, value: opt.id }));
            return { ...state, industry: industries }
        case 'SET_SELECTED_COUNTRY':
            return { ...state, selectedCountry: action.payload };
        case 'SET_SELECTED_INDUSTRY':
            return { ...state, selectedIndustry: action.payload };
        case 'SET_JD_TEMPLATE_VALUE':
            return { ...state, jdTemplateValue: action.payload };
        case 'SET_JOB_VALUE':
            return { ...state, jobValue: action.payload };
        case 'ADD_INPUT':
            return { ...state, input: action.payload, clicked: false };
        case 'ADD_SKILL':
            const result_Value = state.clicked ? state.dropdownSelectedValue : state.input;
            return {
                ...state,
                skills: (!state.skills.includes(result_Value) && result_Value.trim() !== '') ? [...state.skills, result_Value] : state.skills,
                input: state.skills.includes(result_Value) ? result_Value : ''
            }
        case 'REMOVE_SKILL':
            const filtered = state.skills.filter((skill) => (
                skill !== action.payload
            ))
            return { ...state, skills: [...filtered] }
        case 'SET_RESULTS':
            return { ...state, skilldata: action.payload }
 
        case 'DROPDOWN_CLICKED':
          let updatedskillid=[...state.selectedskillid,action.payload.selectedid]
          updatedskillid=[...new Set(updatedskillid)];
          console.log('this is swit cas skil',state.selectedskillid)  
            return { ...state, dropdownSelectedValue: action.payload.selectedv,selectedskillid:updatedskillid ,clicked: true }//store id skill in array here
 
        case 'HANDLE_KEYBOARD':
            return { ...state, selectedByKeyboard: action.payload }
        case 'JDNAME':
          return {...state,jdTemplate:action.payload}
        case 'JOBTYPE':
          return {...state,jobTypeValues:action.payload}
        case 'aisearchtext':
          return {...state,aisearchText:action.payload}
        
        
        default:
            return state;
    }
}
export default function PostJob() {
  const editor=useRef(null)
  const [jdd,setJD]=useState('')
    const [JobDetails, setJobDetails] = useState({
        city: '',
        stateID:4967,
        countryId:'',
        jobTitle: '',
        noOfOpenings:'',
        skillLookupId:'',
        minExpRequired: '',
        maxExpRequired: '',
        clientContactID:'',
        minSalary: '',
        maxSalary: '',
        clientId:'',
        loginUserID:'',
       
        jobType: '',
        jobCategoryLookupId:'',
        rawDescription: '',
        // predefinedJD: '',
        
        jobDescription:''
    })
    const handlerFormInput = ((e) => {
      console.log('this is input detial',e)
        const { name, value } = e.target
        setJobDetails({ ...JobDetails, [name]: value });
 
    })
    const [message,setMessage]=useState('')
    const handlerAlertmessage=(message,type)=>{
      setMessage({message:message,type:type})

      setTimeout(()=>{
        setMessage('')
      },3000)
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const baseUrl = 'https://rdts.talentrackr.com/cpxpapi/api/Industry/getIndustries';
                const response = await axios.get(baseUrl);
                if (response.status === 200) {
                    dispatch({ type: 'SET_INDUSTRY', payload: response.data.data });
                }
            } catch (err) {
                console.log('Error fetching industries:', err);
            }
        };
        fetchIndustries();
    }, []);

    // fetch job discription by id
    useEffect(()=>{

      const fetchJDDiscription=(async()=>{

        if(state.jdTemplateValue.value){
          try{
            // const encryp_userdetails=sessionStorage.getItem('userdetails')
            // const decrypt_userDetailsstring=encryptDecry(encryp_userdetails)
            // const userdetails=JSON.parse(decrypt_userDetailsstring)
            // console.log('this is dash token',userdetails)
            const baseUrl = process.env.REACT_APP_API_URL_LOCAL;
            const response=await axios.post(`${baseUrl}/Master/GetJobDescriptionByID`,{id:state.jdTemplateValue.value})
            if(response.status===200){
              response.data && response.data.forEach((item)=>{
              //console.log()
              console.log('jd discription',item.description);
              setJD(item.description)
  
            })
              // console.log('jd discription',response.data.description)
              //setJD(response.data.description)
              // dispatch({type:'JDDISCRIPTION',payload: response.data.description})
  
            }
  
          }
          catch(error){
            console.log('this is error of jdd name',error)
          }
        }

      });
      fetchJDDiscription()

    },[state.jdTemplateValue.value ])

    //fetch job discription
    useEffect(()=>{

      // const encryp_userdetails=sessionStorage.getItem('userdetails')
          // const decrypt_userDetailsstring=encryptDecry(encryp_userdetails)
          // const userdetails=JSON.parse(decrypt_userDetailsstring)
          // console.log('this is dash token',userdetails)
      let baseUrl = process.env.REACT_APP_API_URL_LOCAL;

      const fetchJDname=(async()=>{

        try{
          
          const response=await axios.get(`${baseUrl}/Master/GetJobDescription`)
          if(response.status===200){
            console.log('jd name',response.data)
            const newdataarray=[]
            response.data && response.data.map((item)=>
              newdataarray.push({value:item.id,label:item.name})

            )
            console.log('this is new',newdataarray)
            dispatch({type:'JDNAME',payload:newdataarray && newdataarray})

          }

        }
        catch(error){
          console.log('this is error of jdd name',error)
        }

      });

      const fetchJobType=(async()=>{
        try{
          const response=await axios.get(`${baseUrl}/Master/GetJobType`)
          if(response.status===200){
            console.log('this is job type p',response)
            
            const Jobtypedata=response.data && response.data.map((item)=>(
              {value:item.id,label:item.name}
              ))
            dispatch({type:'JOBTYPE',payload:Jobtypedata});
          }
        }
        catch(error){
          console.log('this is job type error',error)
          //alert handler call
        }
      });

      const fetchSkills=(async()=>{
        try{
          const response=await axios(`${baseUrl}/Master/GetSkills`)
          console.log('this is skill data ll',response)
          if(response.status===200){
            dispatch({ type: 'SET_RESULTS', payload: response.data })

          }
        }
        catch(error){
          console.log('this is skill data error fetch ',error)
          //aler handler

        }
        // finally{

        // }
      });
console.log('sss',state.selectedskillid)
      // const fetchCityCountry=(async()=>{
      //   try{
      //     const response=await axios.get(`${baseUrl}/City/GetCities`)
      //     console.log('this is city country data ll',response)
      //     if(response.status===200){
      //       dispatch({ type: 'SET_COUNTRY_CITY', payload: response.data.data })

      //     }
      //   }
      //   catch(error){
      //     console.log('this is skill data error fetch ',error)
      //     //aler handler

      //   }
      //   // finally{

      //   // }SET_COUNTRY_CITY
      // })



      
      fetchJDname();
      fetchJobType();
      fetchSkills();
      //fetchCityCountry();

    },[])
 
    const handleChangeIndustry = (selectedOption) => {
        setJobDetails({ ...JobDetails, 'jobCategoryLookupId':String( selectedOption.value) });
        dispatch({ type: 'SET_SELECTED_INDUSTRY', payload: selectedOption });
    };
    
    
    
 // this is jd type select 
    const extractJdTemplate = (selectedOption) => {
      console.log('this is jd select type',selectedOption)
        //setJobDetails({ ...JobDetails, 'predefinedJD': selectedOption });
        dispatch({ type: 'SET_JD_TEMPLATE_VALUE', payload: selectedOption });
        console.log('this is jd select type val',state.jdTemplateValue)
        
    };
 
    const handleJobType = (selectedOption) => {
        setJobDetails({ ...JobDetails, 'jobType': String(selectedOption.value) });
        dispatch({ type: 'SET_JOB_VALUE', payload: selectedOption });
    };
    const fetchData = (value) => {
        // fetch('https://jsonplaceholder.typicode.com/users').then((response) => response.json().then(json => {
        //     const results = json.filter((user) => {
        //         return value && user && user.name && user.name.toLowerCase().includes(value);
        //     })
 
        //     dispatch({ type: 'SET_RESULTS', payload: results })
        // }))
        //filter for skill on the basis of value
    }
    const handleDropDownClick = (item) => {
       // setJobDetails({...JobDetails,'skillLookupId':selectedid})
       console.log('this is selecte skill dro',item)
        dispatch({ type: 'DROPDOWN_CLICKED', payload: {selectedv:item.name,selectedid:item} });
    }
    const handleChangeInput = (event) => {
        dispatch({ type: 'ADD_INPUT', payload: event.target.value });
        // functionality to search by using some default skills before we get API
        // fetchData(event.target.value);
        if (event.target.value.trim() !== '') {
            fetchData(event.target.value);
        }
    };
    const handleButtonSkill = () => {
        dispatch({ type: 'ADD_SKILL', payload: state.input });
    };
    const removeSkill = (skillRemoved) => {
        dispatch({ type: 'REMOVE_SKILL', payload: skillRemoved });
    }
    const limitNumericInput = (event, item) => {
        let placeholder = event.target.value
        if (placeholder !== '' && placeholder.length > item) {
            placeholder = placeholder.slice(0, item);
        }
    }

    // Form Submits
    const handlerFormSubmit = async(event) => {
        event.preventDefault();
        const encryp_userdetails=sessionStorage.getItem('userdetails')
          const decrypt_userDetailsstring=encryptDecry(encryp_userdetails)
          const userdetails=JSON.parse(decrypt_userDetailsstring)
          console.log('this is postjob token',userdetails)
          console.log('this is postjob company contact id',userdetails.companyDetail.companyContactID,'login ucserid',userdetails.companyDetail.memberId)
          //setJobDetails({...JobDetails,clientContactID:userdetails.companyDetail.companyContactID,loginUserID:userdetails.companyDetail.memberId,clientId:String(userdetails.companyDetail.companyID)});
         
        //JobDetails.RequiredSkills = state.skills;
        JobDetails.jobDescription=jdd;
        JobDetails.loginUserID=userdetails.companyDetail.memberId;
        JobDetails.clientId=String(userdetails.companyDetail.companyID)
        JobDetails.clientContactID=userdetails.companyDetail.companyContactID;
        const ids=state.selectedskillid && state.selectedskillid.map(item=>item.id).join('!');
        JobDetails.skillLookupId=ids
        // console.log('this is yy is idd xp',state.selectedskillid)
        setJobDetails({ ...JobDetails });
        // console.log('form det',JobDetails)
        // console.log('this is skill is idd xp',ids)
        console.log('this is submit job detail',JobDetails)
        
        try{
          const baseUrl=process.env.REACT_APP_API_URL_LOCAL
          const encryp_userdetails=sessionStorage.getItem('userdetails')
          const decrypt_userDetailsstring=encryptDecry(encryp_userdetails)
          const userdetails=JSON.parse(decrypt_userDetailsstring)
          console.log('this is postjob token',userdetails)
          console.log('this is postjob company contact id',userdetails.companyDetail.companyContactID,'login ucserid',userdetails.companyDetail.memberId)
          setJobDetails({...JobDetails,clientContactID:userdetails.companyDetail.companyContactID,loginUserID:userdetails.companyDetail.memberId,clientId:String(userdetails.companyDetail.companyID)});
          console.log('form det',JobDetails)
          const response=await axios.post(`${baseUrl}/JobPosting/AddJobPosting`,JobDetails)
          console.log('this is resp after post',response)
          if(response.status===200){
            handlerAlertmessage('Job created sucussfully','warning')
            setJobDetails({jobCategoryLookupId:''})
          }
          
          



        }
        catch(error){
          //response.data.title 400 field required
          if(error.response.data.title){
            handlerAlertmessage(error.response.data.title,'warning')
          }
          else{
            handlerAlertmessage('Job Not created','warning')

          }
          
          console.log('this is form error',error)
        }
    }


    const handleKeyDown = (e) => {
        if (state.selectedByKeyboard < state.skilldata.length) {
            if (e.key === "ArrowUp" && state.selectedByKeyboard > 0) {
                const finalValue = state.input ? state.selectedByKeyboard - 1 : 0;
                dispatch({ type: "HANDLE_KEYBOARD", payload: finalValue })
            }
            else if (e.key === "ArrowDown" && state.selectedByKeyboard < state.skilldata.length - 1) {
                const finalValue = state.input ? state.selectedByKeyboard + 1 : 0;
                dispatch({ type: "HANDLE_KEYBOARD", payload: finalValue })
            }
            else if (e.key === 'Enter' && state.selectedByKeyboard >= 0) {
                e.preventDefault()
                dispatch({ type: 'DROPDOWN_CLICKED', payload: state.skilldata[state.selectedByKeyboard].name });
            }
        }
        else {
            dispatch({ type: "HANDLE_KEYBOARD", payload: -1 })
        }
 
    }
    (function () {
        // 'use strict';
        var forms = document.querySelectorAll('.needs-validation');
        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    })();
    const [sctext,setSctext]=useState('');
    const handlerSearchCity=useMemo(()=>{

      const fetchCityCountry=(async()=>{
        if(sctext!==''){
          try{
            let baseUrl = process.env.REACT_APP_API_URL_LOCAL;
            const data={  
              "name": sctext,
              "countryId": 0
            }
            const response=await axios.post(`${baseUrl}/City/GetFilterCities/`,data)
            console.log('this is city country data ll',response)
            if(response.status===200){
              dispatch({ type: 'SET_COUNTRY_CITY', payload: response.data.data })
  
            }
          }
          catch(error){
            console.log('this is skill data error fetch ',error)
            //aler handler
  
          }
        }
        // finally{

        // }SET_COUNTRY_CITY
      })
      
      fetchCityCountry();

    },[sctext])

    // const handlerSearchCity=useMemo(()=>{
    //   //console.log('this is search teext',searchtextvalue)
      
    //   if(sctext!==''){
    //     const filter_searchcitylist= state.countryCity && state.countryCity.filter((item)=>{
    //       //const cityname=item.name.toLowerCase();
    //       //console.log('this is inside if ser text',searchtextvalue)
    //       // const searctxt=searchtextvalue.toLowerCase();
    //       // const matchcity=cityname.startsWith(searctxt);
    //       // return matchcity
    //       //return state.countryCity.filter(item => item.name.toLowerCase().startsWith(sctext.toLowerCase()));
    //   });
    //   console.log('this is filter city post',filter_searchcitylist)
    //   dispatch({type:'searchtextforcity',payload:{data:filter_searchcitylist,searchtext:sctext}})

    //   }
    //   else{
    //     return state.countryCity;
    //   }
      
    // },[sctext,state.countryCity])
    const Aisearch=(e)=>{
      console.log('this is ai search',e)
      dispatch({type:'aisearchtext',payload:e.target.value})

    }
    const handlerSearchByAI=()=>{
      if(state.aisearchText.length>0){

        const fetchJDdata=(async(searchText)=>{
          try{
            const URL=process.env.REACT_APP_AI_URL
            const token=process.env.REACT_APP_AI_token
            console.log('this is ai url',URL)
            const data={
              "model":"gpt-3.5-turbo",
             "messages":[
               
               {"role": "user", "content": `${searchText}`}
               
             ]
           }
            //Bearer
            console.log('this is search data before ai',data)
            const response=await axios.post(`${URL}`,data,{headers:{'Authorization':`Bearer ${token}`}})
            console.log('this is jd',response.data.choices[0])
            if(response.status===200){
              setJD(response.data.choices[0].message.content)

            }
  
          }
          catch(error){
            console.log('this  is AI error',error)
  
          }
        });
        fetchJDdata(state.aisearchText)

      }
    }
    return (
        <>
            <div className="container_form">
              {message && <Alertmessage message={message} />}
                <h2 className="top">Basic Information</h2>
                
                <form onSubmit={handlerFormSubmit} className='needs-validation' noValidate>
                    <div className='row emailFlex'>
                        <div className="City form-group col-md-6">
                            <label htmlFor="inputEmail4">City<span className='asterisk'>*</span></label>
                            <input name='city' value={sctext}  onChange={(e)=>setSctext(e.target.value)} required className="control_width form-control" />
                            {/* city and country data state.showCityDropdown && state.searchcitytextvalue!==''?*/}
                            {<ul className='citylistitem shadow'>
                              { state.countryCity && state.countryCity.map((suggestion) => (
                                <li key={suggestion.id} value={suggestion.name} onClick={()=>{setJobDetails({...JobDetails,'city':suggestion.name,'countryId':suggestion.countryId});setSctext(suggestion.name + ',  ' +suggestion.countryName);}} >
                                  {suggestion.name} , {suggestion.countryName}
                                </li>
                              ))}
                            </ul>}
                        </div>
                        <div className="jobTitle form-group col-md-6">
                            <label htmlFor="inputPassword4">Job Title<span className='asterisk'>*</span></label>
                            <input name='jobTitle' onChange={handlerFormInput} required className="control_width form-control" />
                        </div>
                    </div>
                    <div className='row emailFlex'>
                        <div className="Openings form-group col-md-6">
                            <label htmlFor="inputEmail4">No. of Openings<span className='asterisk'>*</span></label>
                            <input name='noOfOpenings' type='text' onChange={handlerFormInput} required className="control_width form-control" />
                        </div>
                        <div className='form-group dropdownClass Category col-md-6 dropdown'>
                            <label>Category<span className='asterisk'>*</span></label>
                            <Select required className='control_width' options={state.industry} onChange={handleChangeIndustry} value={state.selectedIndustry && state.selectedIndustry} />
                        </div>
                    </div>
                    <div className='row emailFlex'>
                        <div className="inputFields form-group col-md-6">
                            <label htmlFor="inputEmail4">Required Experience(yrs):</label>
                            <div className='two_inputs'>
                                <input name='minExpRequired' onChange={handlerFormInput} type='number' className="control_width form-control" placeholder='Minimum' />
                                <input name='maxExpRequired' onChange={handlerFormInput} type='number' className="control_width1 form-control" placeholder='Maximum' />
                            </div>
                        </div>
                        <div className="inputFields salaryRange form-group col-md-6">
                            <label htmlFor="inputPassword4">Annual Salary Range</label>
                            <div className='two_inputs'>
                                <input name='minSalary' onChange={handlerFormInput} onInput={(event) => limitNumericInput(event, 5)} type='number' className="control_width form-control" placeholder='Minimum' />
                                <input onChange={handlerFormInput} name='maxSalary' type='number' className="control_width1 form-control" placeholder='Maximum' />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                    <div className="skills form-group">
                        <label htmlFor="inputAddress">Required Skills</label>
                        <div className='button_flex'>
                            <input
                                value={state.clicked ? state.dropdownSelectedValue : state.input}
                                required={state.skills.length === 0}
                                type="text"
                                className="RequiredSkills form-control"
                                id="inputAddress"
                                onChange={(event) => handleChangeInput(event)}
                                onKeyDown={handleKeyDown}
                                name='RequiredSkills'
                            />
                            <button onClick={handleButtonSkill} type="button" className="hoverChange info_button btn btn-info">Add Skills</button>
                        </div>
                        {!state.clicked && <div className='result_list'>
                            {state.input && state.skilldata.map((result, id) => (
                                <div className={`${state.selectedByKeyboard === id ? 'active_dropdown' : ""} dropdown_element`} onClick={() => handleDropDownClick(result)} key={id}>
                                    {result.name}
                                </div>
                            ))}
                        </div>}
                        <div className='addSkills'>
                            {state.skills.map((element, index) => (
                                <div className='addSkillsInside' key={index}>
                                    <span className='skillElement'>{element}</span>
                                    <button type='button' className='closeButton' onClick={() => removeSkill(element)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                    <div className='JobType'>
                        <label>Job Type<span className='asterisk'>*</span></label>
                        <Select required className='jobType' options={state.jobTypeValues} onChange={handleJobType} value={state.jobValue} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Job Highlights (300 characters are allowed) <span className='asterisk'>*</span></label>
                        <textarea name='rawDescription' onChange={handlerFormInput} required className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                    <h4>Job Description</h4>
                    
                    <div className='JobType '>
                        <label style={{ marginBottom: '0.3rem' }}>Predefined Job Description<span className='asterisk'>*</span></label>
                        <Select  className='jobType' options={state.jdTemplate} onChange={extractJdTemplate} value={state.jdTemplateValue} />
                    </div>
                    <div className='row'>
                    <div class="input-group mt-3">
                      
                      <input type="text" id='ai' value={state.aisearchText} onChange={Aisearch} class="form-control" placeholder="Search Your Job discription By AI" />
                      <button class="btn btn-outline-primary" onClick={handlerSearchByAI} type="button">Search Using AI</button>
                      
                    </div>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Detail Job Description<span className='asterisk'>*</span></label>
                        <JoditEditor ref={editor} value={jdd} onChange={newContent=>setJD(newContent)}>

                        </JoditEditor>
                        
                    </div>
                    <button type="submit" className="hoverChange occupyWidth btn btn-info">Publish</button>
                </form >
            </div >
        </>
    );
}
 


 
