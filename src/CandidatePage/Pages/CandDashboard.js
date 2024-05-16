import React, { useEffect } from 'react'
import RecommendedJob from './RecommendedJob'
import AppliedJob from './AppliedJob'
import axios from 'axios'
import CandidatedashCard from './CandidatedashCard'

export default function CandDashboard() {

 

  return (
    <div className='container'>
      <CandidatedashCard />
      {/* <div className='row mt-4 mb-3'>
        <h3>Recommended Jobs</h3>
      </div>
      <RecommendedJob/> */}

      <div className='row mt-4 mb-3'>
        <h3>Recommended Jobs</h3>
      </div>
      <AppliedJob/>
  </div>
  )
}
