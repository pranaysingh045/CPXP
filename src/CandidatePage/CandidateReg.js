import React, { useReducer, useState } from 'react'
import logo from '../images/CareerLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { handlerSearchCity } from '../Common/CityFilter';
import axios from 'axios';
import Alertmessage from '../Alertmessage';
import SpinnerLod from '../LayoutPage/SpinnerLod';


const initialState={
    workstatustype:'',
    citysearchtexts:'',
    searchCityList:[],
    message:{message:'',type:''},
    loader:false,
}

const reducer=(state,action)=>{
    switch(action.type){
        case 'worktype':
            return {...state,workstatustype:action.payload};
        case 'citysearchtext':
            return {...state,citysearchtexts:action.payload};
        case 'SearchCityList':
            return {...state,searchCityList:action.payload};
        case 'message':
            return {...state,message:{message:action.payload.message,type:action.payload.type}};
        case 'loader':
            return {...state,loader:action.payload}
        default:
            return state
    }
}
export default function CandidateReg() {
    const [state,dispatch]=useReducer(reducer,initialState)
    const [phonnum,setPhone]=useState('');
   

    const [candidateDetails,setCandidatedetails]=useState({
        fullName:'',
        email:'',
        password:'',
        cellPhone:null,
        CountryId:null,
       
        City:'',
        resume:'',
        fileName:'',
        loginUserID:0,
        totalWorkExpYear:null,
        totalWorkExpMonth:null,



    });
    //input handler function

    const handlerInput=((e)=>{
        const {name,value,type,files}=e.target
        if(type==='number' && (name==='totalWorkExpYear' || name==='totalWorkExpMonth') && value.length >2){
            return


        }
        else if(type==='file'){
            
            if(files && files.length>0){
                const uploadfile=files[0]
                if(uploadfile.type==='application/pdf'||uploadfile.type==='application/msword' || uploadfile.type==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                    if(uploadfile.size<=1024* 1024){
                        const reader=new FileReader()
                        reader.onloadend=()=>{
                            const base64string=reader.result.split(',')[1];
                            console.log('this is base file conv',base64string)
                            setCandidatedetails({...candidateDetails,[name]:base64string,fileName:uploadfile.name});
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
            if (type === 'number' && (name === 'totalWorkExpYear' || name === 'totalWorkExpMonth')) {
                // Convert value to number
                setCandidatedetails({ ...candidateDetails, [name]: parseInt(value, 10) });
            }
            else{
                setCandidatedetails({...candidateDetails,[name]:value})

            }
            

        }

       
        console.log('this is input handler',name,value)
    })

    //alert message
    const handlerAlert=((message,type)=>{
        dispatch({type:'message',payload:{message:message,type:type}})

        setTimeout(()=>{
            dispatch({type:'message',payload:{message:'',type:''}})
            

        },3000)
    })

    // registration 
    const handlerFormSubmition=(async(e)=>{
        e.preventDefault()
        // setCandidatedetails({...candidateDetails,cellPhone:phonnum})
        candidateDetails.cellPhone=phonnum
        console.log('this is form submition',candidateDetails)
        try{
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            dispatch({type:'loader',payload:true})
            const response= await axios.post(`${baseUrl}/Candidate/RegisterCandidate`,candidateDetails)
            if(response.status===200 && response.data.statusCode){
                dispatch({type:'loader',payload:false})
                console.log('this is resp submit',response)
                setCandidatedetails({
                    fullName: '',
                    email: '',
                    password: '',
                    cellPhone: null,
                    CountryId: null,
                    
                    City: '',
                    resume: '',
                    fileName: '',
                    loginUserID: 0,
                    totalWorkExpYear: null,
                    totalWorkExpMonth: null,
                })
                setPhone('')
                handlerAlert('Registration sucussfully','success')
            }

        }
        catch(error){

            if(error.response.status===400){
                handlerAlert(error.response.data.title,'danger')

            }
            else{
                handlerAlert('opps ! Something is wrong','danger')

            }
            console.log('this is submit er',error)
            dispatch({type:'loader',payload:false})
           

        }
        
    })

    // select work status type fresher or exprence
    const handlerWorkStatus=((e)=>{
        dispatch({type:'worktype',payload:e.target.value})
        if(e.target.value==='F'){
            setCandidatedetails({...candidateDetails,totalWorkExpYear:0,totalWorkExpMonth:0})
        }
        else{
            setCandidatedetails({...candidateDetails,totalWorkExpYear:null,totalWorkExpMonth:null})

        }
        
    })
// fetch city from common function

    const handlerCity=((val)=>{
        console.log('this is city text')
        dispatch({type:'citysearchtext',payload:val})
        const filtercitydata=handlerSearchCity(val).then(data=>{
            console.log('this return is is',data)
            dispatch({type:'SearchCityList',payload:data})
        }).catch(error=>{
            console.log('this is return errror',error)
        })
        
        console.log('this is return data',filtercitydata)
    })

// fetch selected city and countryid
    const handlerSelectCity=(cityname,countryid,val)=>{

        setCandidatedetails({...candidateDetails,City:cityname,CountryId:countryid})
        console.log('name ci nd',val)
        console.log('this is selected country id',countryid)
        console.log('this is selected city',cityname)
    }
    //console.log('this',state.searchCityList)
  return (
    <>

<div className='conatiner Login_mainContainer'>
    
        <div className='row LoginContainerRow'>
            
            <div className='col-md-4 leftLoginbox' >
                <div className='leftParentcontener'>
                    <div className='row '>
                    <img src={logo} className='companyLogo img-fluid imglogo'  />

                    </div>
                <div className='leftBoxText'>
                Transform Your Hiring Process with CareerpageXP - Where Dreams Find Their Career!
                <span>👋</span>
                </div>

                </div>
                
            

            </div>
            
            <div className='col-md-6  m-auto'>
            { state.message.message  && <Alertmessage message={state.message} />}
            { state.loader ? <SpinnerLod/>:<>
            
                <div className='row'>
                    <h2 className='loginTextheader'>Candidate Registration</h2>
                    <p>Please enter your details to access your account</p>
                </div>
                
                <form onSubmit={handlerFormSubmition} >
                <div className='row bg-secondar'>

                        <div className='col-md-6'>
                            <div className='form-group  my-2'>
                                <label className='' id='email'>Full name</label>
                                <input className='form-control' value={candidateDetails.fullName} onChange={handlerInput} required maxLength={25} name='fullName' type='text'  placeholder='Enter first name' />
                            </div>

                        </div>
                   

                        <div className='col-md-6'>
                            <div className='form-group  my-2'>
                                <label className='' id='email'>Email</label>
                                <input className='form-control' value={candidateDetails.email} onChange={handlerInput} required maxLength={25} name='email' type='email'  placeholder='Enter Email' />
                            </div>

                        </div>
                        <div className='col-md-6'>
                            <div className='form-group  my-2'>
                                <label className='' id='password'>Password</label>
                                <input className='form-control' value={candidateDetails.password} onChange={handlerInput} required maxLength={25} name='password' type='password'  placeholder='Enter password' />
                            </div>

                        </div>
                        
                        
                        
                        <div className='col-md-6'>
                            <div className='form-group  my-2'>
                                <label className='' id='cellPhone'>Mobile</label>
                                <PhoneInput className="number" name='cellPhone' value={phonnum} country={"in"} onChange={(value)=>setPhone(value)} />
                            </div>

                        </div>
                        
                        <div className='col-md-6'>
                            <div className='form-group  my-2'>
                                <label className='' id=''>City</label>
                                <input className='form-control' value={state.citysearchtexts} onChange={(e)=>handlerCity(e.target.value)} required maxLength={25} name='City' type='text'  placeholder='Enter City' />
                                
                                {state.citysearchtexts!=='' && state.searchCityList.length>0 && (<ul className='shadow  rounded citydropdown'>
                                        
                                         {state.searchCityList.map((item,index)=>(<li onClick={()=>{handlerSelectCity(item.name,item.countryId);handlerCity(item.name+', '+item.countryName)}} key={item.id} value={item.name}>{item.name}, {item.countryName}</li>))}
                                        
                                    </ul>)}
                              
                            </div>

                        </div>
                        
                        
                        <div className='col-md-6'>
                        <div className='form-group  my-2'>
                            <label for='workstatus'>Work status</label>
                            <select id='workstatus' onChange={handlerWorkStatus} class="form-select">
                                <option value=''>select status</option>
                                <option value='F'>Fresher</option>
                                <option value='E'>Exprence</option>
                                
                            </select>
                        </div>

                        </div>
                        <div className='col-md-6'>
                            <div className='form-group  my-2'>
                                <label id='password'>Upload CV </label>
                                <input className='form-control'  type='file' onChange={handlerInput}   name='resume'  placeholder='upload cv' />
                                {/* <span className='text-mute passwordnotifi'>Password must be 8 characters</span> */}
                            </div>

                        </div>

                       {state.workstatustype && state.workstatustype==='E'?<> <div className='col-md-6'>
                            <div className='form-group  my-2'>
                                <label className='' id='email'>Total Work Experience</label>
                                <div className='input-group'>
                                <input className='form-control' value={candidateDetails.totalWorkExpYear}  onChange={handlerInput} required maxLength={2} name='totalWorkExpYear' type='number'  placeholder=' year' />
                                <input className='form-control' value={candidateDetails.totalWorkExpMonth} onChange={handlerInput} required maxLength={2} name='totalWorkExpMonth' type='number'  placeholder=' month' />

                                </div>
                                
                            </div>

                        </div>
                        

                        </>:''}

                        <div className='col-md-6'>
                            <div className='form-group'>
                                <button className='btn loginbtn mt-3 m-auto form-control' type='submit'>Sign up</button>

                                </div>

                        </div>

                    
                    <div className='col-md-8 login_forgetPasColumn mt-3'>
                        
                        <p><Link to='/candidate/login'>Login</Link></p>

                    </div>
                    
                    {/* <p className=''>By clicking sign in, you agree to the careerpageXP <a href='#'>Terms of Service & Privacy policy</a></p> */}
                    

                </div>
                </form>
                </>}  
        

            </div>
        </div>
        
      </div>
    
    
    
    </>
  )
}
