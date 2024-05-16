import React from 'react'
import { Link } from 'react-router-dom'

export default function CaLeftMenu() {
  return (
    <div className='leftmenu_parentDiv shadow w-100'>

        <div>
           <ul>
                <li><span><i class="fa-solid fa-grip"></i></span><Link to='/candidate/dashboard'>Dashboard</Link></li>
                <li><span><i class="fa-solid fa-briefcase"></i></span><Link to='/candidate/MyJoblist'>Applied job</Link></li>
                <li><span><i class="fa-regular fa-file"></i></span><Link to='/candidate/documents'>Documents</Link></li>
                

                
            </ul>

        </div>



    </div>
  )
}
