import axios from 'axios'
import React, { useState,useEffect, useReducer, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Alertmessage from '../Alertmessage';

const initialState={
    Industrydata:[],
    CountryData:[],
    Term_Condition:[],
    CityData:[],
    searchtextvalue:'',
    setfilterCitydata:[],
}

const reducer=(state,action)=>{

    switch(action.type){
        case 'setindustrydata':
            return {...state,Industrydata:action.payload};
        case 'set_Country_Data':
            return {...state,CountryData:action.payload};
        case 'setTermCondition':
            return {...state,Term_Condition:action.payload}
        case 'set_cityData':
            return {...state,CityData:action.payload}
        case 'searchcitytext':
            return {...state,searchtextvalue:action.payload}
        case 'filtercitydata':
            return {...state,setfilterCitydata:action.payload}
        default:
            return state
    }
}


export default function EmployerDetails(props) {
    const [state,dispatch]=useReducer(reducer,initialState)

    // const [citylist,setCityList]=useState([])
    const [phonnum,setPhone]=useState('')
    const [EmployeerDetails,setEmployeerDetails]=useState({
        BusinessEmailId:props.verifyemail,
        CompanyName:'',
        FullName:'',
        MobileNo:phonnum,
        CountryId:'',
        City:'',
        IndustryID:'',
        Address1:'',
        Address2:'',
        ZipCode:'',
        noOfEmployee: "",
        TermConditionID: "",
        LogoUrl: ""
            
    })
    const navigate=useNavigate()

    const [errorMessage,setErrormessage]=useState('')
    const handlerErrormessage=useCallback((message)=>{
        setErrormessage(message)

        setTimeout(()=>{
            setErrormessage('')
        },5000)
    },[])


    // fetch city
    // useEffect(() => {
    //     const fetchCity=(async()=>{
    //         try{
                
    //             const baseUrl=process.env.REACT_APP_API_URL_LOCAL
    //             if(EmployeerDetails.CountryId){
    //                 const response=await axios.post(`${baseUrl}/City/getCities`)
    //                 console.log('this is city',response)
    //                 if(response.status===200){
    //                     setCityList(response.data.data)
    //                 }
    //             }
    
    //         }
    //         catch(err){
    //             console.log('this is err city',err)
    //         }
    //     })
      
        
    //     fetchCity()
      
    // }, [])

    //useEffect for country termcondition and industry
    useEffect(()=>{
        var baseUrl = process.env.REACT_APP_API_URL_LOCAL;

        // const fetchCountry=(async()=>{
        //     try{
                
        //         const baseUrl = process.env.REACT_APP_API_URL_LOCAL;
        //         const response=await axios.get(`${baseUrl}/country/getCountries`)
        //         console.log('this is coun',response)
        //         if(response.status===200){
                    
        //             dispatch({type:'set_Country_Data',payload:response.data.data})
        //         }
        //     }
        //     catch(err){
        //         // explain all error message here accourding to status code
        //         if(err.response.status===500){
        //             //server error
        //         }
        //         console.log('this is contry error message',err)
        //     }
    
        // })
    
        const fetchIndustry=(async()=>{
            try{
                
                
                const response=await axios.get(`${baseUrl}/Industry/getIndustries`)
                console.log(response.data,'this is industry')
                if(response.status===200){
                    dispatch({type:'setindustrydata',payload:response.data.data})
                    
    
                }
    
    
            }
            catch(err){
                console.log('this is industry err',err)
    
            }
        })

        const TermCondition=(async()=>{
            try{
                const response=await axios.get(`${baseUrl}/TermsConditions/GetTermsConditionsActive`);
                console.log('this is term and condition1',response.data,response.status)
                
                    if(response.data.statusCode===200){
                        console.log('this is term and condition',response.data.data)
                        dispatch({type:'setTermCondition',payload:response.data.data})
                        console.log('this is teem',initialState.Term_Condition)

                    }
                

            }
            catch(error){
                console.log('this is error term and cond',error)


            }
        })



        // fetchCountry()
        fetchIndustry()
        TermCondition()

    },[])

    const [message,setmessage]=useState(false)//alert message
    const handlerAlertmessage=useCallback((message,type)=>{
        setmessage({message:message,type:type})

        setTimeout(()=>{
            setmessage(false)
        },3000)
    })

    const handlerFormInput=((e)=>{
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
                            setEmployeerDetails({...EmployeerDetails,[name]:base64string});

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
            setEmployeerDetails({...EmployeerDetails,[name]:value});

        }
        
        
    })

    const handlerEmployerDetailsFormSubmit=(async(e)=>{
        e.preventDefault();
        try{
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            
            EmployeerDetails.MobileNo=phonnum
            console.log('phone num ',phonnum)
            console.log('this is employeer detailsw',EmployeerDetails)
            
            const response=await axios.post(`${baseUrl}/Register/EmployerRegisterDetails`,EmployeerDetails)
            // stop loader
            console.log('this is regg resp',response)
            if(response.data.statusCode===200){
                //show message
                navigate('/Dashboard')
            }
            else if(response.data.statusCode===401){
                
                //employer not found
                handlerAlertmessage(response.data.message,'danger')

            }

            console.log('this is employer details',EmployeerDetails)

        }
        catch(error){
            // alert message for error
            if(error.response.status===500){
                //internal server error
                handlerAlertmessage('Internal server error','danger')
            }
            else if(error.response.status===400){
                //
                console.log('this is 400 erro',error)
                handlerAlertmessage(error.response.data.errors.employerregistration,'danger')
            }
            else if(error.response.status===401){
                //unauther 
                handlerAlertmessage(error.response.data.message,'danger')

            }
            else{
                console.log('this is error message',error)
                handlerAlertmessage('something is wrong','danger')
            }
            

        }
    })
    const [searchCityText,setSearchCityText]=useState('')
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    useEffect(()=>{
        const fetchCitylist=(async()=>{
            
            try{
                    const baseUrl=process.env.REACT_APP_API_URL_LOCAL
                    
                    const response=await axios.post(`${baseUrl}/City/GetCities`,{})
                    console.log('this is new city',response)
                    if(response.data.statusCode===200){
                        console.log('this is filter new city',response.data.data)
                        // setCityList(response.data.data)
                        dispatch({type:'set_cityData',payload:response.data.data})
                    }
    
                
                
    
            }
            catch(error){
                console.log('this is city filter error',error)
    
            }
        });
        fetchCitylist()
    },[])
    
    const handlerSearchCity=((searchtext)=>{


        if(searchtext){
            dispatch({type:'searchcitytext',payload:searchtext})
            console.log('this is city whic fff',state.CityData)
            const filterCitydata=state.CityData && state.CityData.filter((item)=>{
                const itemName = item.name.toLowerCase();
                const searchLowerCase = searchtext.toLowerCase();
                const startsWithMatch = itemName.startsWith(searchLowerCase);
                
                return startsWithMatch;
                //return item.name.toLowerCase().startsWith(searchtext.toLowerCase())
            })
            console.log('this is after fil chutiya',filterCitydata)
            dispatch({type:'filtercitydata',payload:filterCitydata})
        }
        else{
            dispatch({type:'searchcitytext',payload:''})

        }
        // setSearchCityText(valu);
        
        

    });

    
  return (
    <>
    {message && <Alertmessage message={message} />}
    <form onSubmit={handlerEmployerDetailsFormSubmit}>
    <div className='row'>
        <h2 className=''>Employer Details</h2>
    <div className='col-md-6 my-2'>
    <label className='' htmlFor='bemail'>Business email </label>
        <div className='verifyinputbox' style={{position: 'relative'}}>
            <input className='form-control ' name='BusinessEmailId' disabled value={props.verifyemail} type='text' placeholder='Enter name' />
            <span style={{position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                 <i className="fa-regular fa-circle-check veryfyicon"></i> 
            </span>
        </div>
    </div>
    <div className='col-md-6 my-2'>
        <label className='' htmlFor='name'>Full name</label>
        <input className='form-control' required name='FullName' value={EmployeerDetails.FullName} onChange={handlerFormInput} type='text' placeholder='Enter name' />
    </div>
    <div className='col-md-6 my-2'>
        <label className='' htmlFor='mobile'>Mobile</label>
        <PhoneInput className="number" name='MobileNo' value={phonnum} country={"in"} onChange={(value)=>setPhone(value)} />

        
    </div>
    <div className='col-md-6 my-2'>
        <label className='' htmlFor='company'>Company name</label>
        <input className='form-control' required maxLength={40} name='CompanyName' value={EmployeerDetails.CompanyName} onChange={handlerFormInput} type='text' placeholder='Enter company name' />
    </div>
    
    <div className='col-md-6 my-2'>
        <label className='' htmlFor='address 1'>Address 1</label>
        <input className='form-control' required maxLength={60} name='Address1' value={EmployeerDetails.Address1} onChange={handlerFormInput} type='text' placeholder='Enter address 1' />
    </div>
    <div className='col-md-6 my-2'>
        <label className='' htmlFor='address 2'>Address 2</label>
        <input className='form-control' maxLength={60} name='Address2' value={EmployeerDetails.Address2} onChange={handlerFormInput} type='text' placeholder='Enter address 2' />
    </div>
    {/* <div className='col-md-6 my-2'>
       <label htmlFor='country' className='form-label'>Country</label>
        <select className="form-select" required value={EmployeerDetails.CountryId} name='CountryId' onChange={handlerFormInput} >
            <option value={0}>Select country</option>
            {state.CountryData && state.CountryData.map((item)=>(
                <option key={item.id} value={item.id}>{item.name}</option>

            ))}
            
            
            
        </select>
         
    </div> */}
    <div className='col-md-6 my-2'>
        
        <label htmlFor="city" className="form-label">City</label>
        <input type='text' placeholder='search city' className='form-control' value={state.searchtextvalue} onChange={(e)=>{handlerSearchCity(e.target.value);setShowCityDropdown(true)}} />
        {showCityDropdown && state.searchtextvalue!==''?<ul className='citylistitem shadow'>
                { state.setfilterCitydata && state.setfilterCitydata.map((suggestion) => (
                  <li key={suggestion.id} value={suggestion.name} onClick={()=>{setEmployeerDetails({...EmployeerDetails,'City':suggestion.name,'CountryId':suggestion.countryId});handlerSearchCity(suggestion.name + ',  ' +suggestion.countryName);setShowCityDropdown(false)}} >
                    {suggestion.name} , {suggestion.countryName}
                  </li>
                ))}
              </ul>:''}
        {/* <select className="form-select" required value={EmployeerDetails.City} name='City' onChange={handlerFormInput} >
            <option>Select city</option>
            {citylist && citylist.map((item)=>(
                <option key={item.id} value={item.name}>{item.name}</option>

            ))}
            
            
            
        </select> */}
    
   
    </div>
    
    <div className='col-md-6 my-2'>
        <label className='' htmlFor='email'>Pin/Zip code</label>
        <input className='form-control' maxLength={8}    required value={EmployeerDetails.ZipCode} type='number' name='ZipCode' onChange={handlerFormInput} placeholder='Enter pin code' />
    </div>
    <div className='col-md-6 my-2'>
        <label htmlFor='Industry' className='form-label'>Industry</label>
        <select className="form-select" required value={EmployeerDetails.IndustryID} name='IndustryID' onChange={handlerFormInput}>
            <option>Select Industry</option>
            {state.Industrydata? state.Industrydata.map((item)=>(
                <option key={item.id} value={item.id}>{item.name}</option>

            )):'Industry not found'}
            
            
            
        </select>
        
    </div>
    <div className='col-md-6 my-2'>
        <label htmlFor='Industry' className='form-label'>Number of employees in your company</label>
        <select className="form-select" name='noOfEmployee' required onChange={handlerFormInput}>
            <option>Select Number of employees</option>
            <option value='10'>5-10</option>
            <option value='20'>10-20</option>
            
        </select>
        
    </div>

    <div className='col-md-6 my-2'>
        <label className='' htmlFor='email'>Upload Logo</label>
        <input className='form-control' type='file' name='LogoUrl' onChange={handlerFormInput} placeholder='Enter Email' />
       {errorMessage?<p className='text-danger'>{errorMessage}</p>:<p className='text-secondary'>please upload jpg, jpeg, png or svg ;file size less than 1 MB</p>} 
    </div>
    <div className='col-md-12 my-2'>
    <div className="form-check term_condText">
    <label className="form-check-label ">
      <input className="form-check-input"  value={state.Term_Condition && state.Term_Condition.map((item)=>item.id)} onChange={(e)=>setEmployeerDetails({...EmployeerDetails,TermConditionID:e.target.checked?e.target.value:''})}  required type="checkbox"  name="TermConditionID" /> 
      I agree to allow CareerpageXP to use the above-provided details for my Employer profile and accept the <a href='#' data-bs-toggle='modal' data-bs-target='#termcondition'>Terms & Conditions</a>
    </label>
    </div>

    </div>
    <div className='col-md-12'>
        <button type='submit' className='btn loginbtn'>Submit</button>
    </div>
    </div>
    </form>

    {/* term & condition */}
<div className='modal' id='termcondition'>
    <div className='modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable '>
        <div className='modal-content'>
        {state.Term_Condition.length>0? state.Term_Condition.map((item)=>(<>
            <div className='modal-header'>
                <h4 className='modal-title'>{item.title?item.title:'Term and condition title null'}</h4>
                <button className='btn-close' type='button' data-bs-dismiss='modal'></button>
            </div>
            <div className='modal-body termconditiontextmodal'>
                
                <p dangerouslySetInnerHTML={{__html:item.description}}></p>

            </div></>
)):<div className='modal-header'>
<h4 className='modal-title'>Term and condition is not available</h4>
<button className='btn-close' type='button' data-bs-dismiss='modal'></button>
</div>}
        </div>
    </div>
</div>
    </>
  )
}
