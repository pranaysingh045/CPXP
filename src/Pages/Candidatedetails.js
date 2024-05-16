import React from 'react'
import candidateimg from '../images/Logo_164.jpg'
import CandidateExprence from './CandidateExprence'

export default function Candidatedetails({candidateid,showslide,closeslide}) {
    console.log('this is details candidate gg canv')
    const handleclose=()=>{
        closeslide()
    }
  return (
    <>
    <div className={`offcanvas offcanvas-end bg-dark ${showslide?'show':''}`} style={{display:candidateid?'block':'none'}} id='candidate'>
        <div className='offcanvas-header'>
          <h5 className='text-white'>Candidate Details {candidateid}</h5>
          <button className='btn btn-close' type='button' onClick={handleclose} data-bs-dismiss='offcanvas'></button>
        </div>
        <div className='offcanvas-body'>
          <div className='row  borde py-3 bg-secondary rounded'>
            <div className='col-md-3'>
              <img className='rounded-circle candidateprofileimage' src={candidateimg} />

            </div>
            <div className='col-md-9'>
                <h6 className='text-white'>Pranay singh</h6>
                <p className=' text-white'>Software Developer</p>
                <span className='text-white'><i class="fa-regular fa-envelope"></i> pranay@talentrackr.in</span>
                <span className='text-white'><i class="fa-solid fa-phone"></i> 9937765432</span>


            </div>

          
          
          </div>

          <div className='row mt-3'>
          <ul class="nav nav-pills" role="tablist">
                <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="pill" href="#expreience">Experience </a>
                </li>
                <li class="nav-item">
                <a class="nav-link" data-bs-toggle="pill" href="#appliedjob">Education</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" data-bs-toggle="pill" href="#document">Documents</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" data-bs-toggle="pill" href="#skills">Skills</a>
                </li>
            </ul>
            <div class="tab-content bg-secondary">
                <div id="expreience" class="container tab-pane active">
                    <div className='row  mt-3 bg-secondary py-4 rounded'>
                        <CandidateExprence cid={candidateid} />
                        
                    </div>
                </div>
                <div id="appliedjob" class="container tab-pane ">
                    <div className='row  mt-3 bg-secondary py-4 rounded'>
                        <h5 className='text-white'>Appliedjob</h5>
                        
                    </div>
                </div>
                <div id="document" class="container tab-pane ">
                    <div className='row  mt-3 bg-secondary py-4 rounded'>
                        <h5 className='text-white'>Documents</h5>
                        
                    </div>
                </div>
                <div id="skills" class="container tab-pane">
                    <div className='row  mt-3 bg-secondary py-4 rounded'>
                        <h5 className='text-white'>Skills</h5>
                        
                    </div>
                </div>
            </div>

          </div>
          
          

        </div>
        
      </div>
      
      </>
  )
}
