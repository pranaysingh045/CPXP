import React from 'react'

export default function TableContainer({children,header}) {
  return (
    <>
    <div className='row mt-5  px-2'>
        <h4 className='pb-3'>{header}</h4>
        <div className='table-rsponsive '>{children}</div>
    </div>
    
    </>
  )
}
