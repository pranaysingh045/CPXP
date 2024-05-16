import React, { useMemo } from 'react'
import candidateimg from '../images/Logo_164.jpg'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function CandidateList() {

  const {id}=useParams()
  
  return (
    <>
          <table className='table shadow rounded'>
            <thead className='table-light py-4'>
              <tr>
                <th>Candidate Name</th>
                <th>Stage</th>
                <th>Applied role</th>
                <th>Applied date</th>
                <th>View details</th>
                <th>Edit</th>
                <th>Delete</th>
                
              </tr>
            </thead>
            <tbody>
            <tr>
                
                <td><img className='rounded-circle candidateimg' src={candidateimg} /> Pranay Singh</td>
                <td className='text-info'>Screening</td>
                <td>Software Developer</td>
                <td>12-03-2024</td>
                <td data-bs-toggle='offcanvas' data-bs-target='#candidate'><i class="fa-regular fa-eye text-primary"></i></td>
                <td><i class="fa-solid fa-pen text-success"></i></td>
                <td><i class="fa-regular fa-trash-can text-danger"></i></td>
                
                
              </tr>
              <tr>
                
                <td><img className='rounded-circle candidateimg' src={candidateimg} /> Pranay Singh</td>
                <td className='text-success'>Selected</td>
                <td>Software Developer</td>
                <td>12-03-2024</td>
                <td data-bs-toggle='modal' data-bs-target='#requestionmodal'><i class="fa-regular fa-eye text-primary"></i></td>
                <td><i class="fa-solid fa-pen text-success"></i></td>
                <td><i class="fa-regular fa-trash-can text-danger"></i></td>
                
                
              </tr>
              <tr>
                
                <td><img className='rounded-circle candidateimg' src={candidateimg} /> Pranay Singh</td>
                <td className='text-danger'>Rejected</td>
                <td>Software Developer</td>
                <td>12-03-2024</td>
                <td data-bs-toggle='modal' data-bs-target='#requestionmodal'><i class="fa-regular fa-eye text-primary"></i></td>
                <td><i class="fa-solid fa-pen text-success"></i></td>
                <td><i class="fa-regular fa-trash-can text-danger"></i></td>
                
                
              </tr>
              
            </tbody>

          </table>
    
    </>
  )
}
