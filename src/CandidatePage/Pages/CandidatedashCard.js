import React,{useState,useEffect} from 'react'
import axios from 'axios';
import CardPendProfModal from './CardPendProfModal';
import { Link } from 'react-router-dom';
import CardProfileView from './CardProfileView';

export default function CandidatedashCard() {
    const [carddata,setCardData]=useState([])
    const [profilepend,setProfilePendMod]=useState(false)
    const [profileViewer,setProfileviewer]=useState(false)
    const handlerProfileviewer=(()=>{
      setProfileviewer(!profileViewer)
      
    })
    const handlerPendingProfile=(()=>{
        setProfilePendMod(!profilepend)
        
    })


    useEffect(()=>{
    
        const fetchcarddata=(async()=>{
          
          try{
            const baseUrl=process.env.REACT_APP_API_URL_LOCAL
            const data={
              "memberID": 3030  //get memberid value from session
            }
            const response=await axios.post(`${baseUrl}/candidate/getCandidateDashboard`,data)
            console.log('this card candida',response)
            if(response.status===200 && response.data.statusCode){
                setCardData(response.data.data)
    
            }
          }
          catch(error){
            console.log('this is error',error)
    
          }
        });
        fetchcarddata()
      },[])
  return (
    <>
    
    <div className='row dashboardcard px-2'>
    <div className='col-md-3'>
      <div className='card shadow rounded Firstcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-briefcase"></i>
          </div>
          <div className='cardText' onClick={()=>handlerProfileviewer()}>
            <h2>{carddata && carddata.profileviews}</h2>
             <h3 className='card-title'>Profile views</h3>
          </div>
        </div>
      </div>
    </div>
    <div className='col-md-3'>
      <div className='card shadow rounded Secondcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-briefcase"></i>
          </div>
          <div className='cardText'>
            <h2>{carddata && carddata.appliedJobs}</h2>
             <Link className='card-title' to='/candidate/MyJoblist'>Applied Jobs</Link>
          </div>
        </div>
      </div>
    </div>
    <div className='col-md-3'>
      <div className='card shadow rounded Thirdcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-user"></i>
          </div>
          <div className='cardText'>
            <h2 className='text-center'>{carddata && carddata.interestedEmployer}</h2>
             <h3 className='card-title text-center'>Interested Employer(s)</h3>
          </div>
        </div>
      </div>
    </div>
    <div className='col-md-3'>
      <div className='card shadow rounded Fourthcardborder'>
        <div className='card-body '>
          <div className='cardicon'>
          <i class="fa-solid fa-user-tie"></i>
          </div>
          <div className='cardText'>
            <h2 className='text-primary' onClick={()=>handlerPendingProfile()}>{carddata && carddata.profileCompletion}%</h2>
             <h3 className='card-title'>Profile Completion </h3>
          </div>
        </div>
      </div>
    </div>

    
    
    
      </div>
      {profileViewer &&<CardProfileView  showModal={profileViewer} closeModal={handlerProfileviewer}  />}
      <CardPendProfModal showModal={profilepend} closeModal={handlerPendingProfile} data={carddata && carddata.profilePendingList}/>
    </>
  )
}
