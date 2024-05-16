import React from 'react'

export default function CardPendProfModal({showModal,closeModal,data}) {
  return (
    <>
    <div className={`modal backdropmodal ${showModal?'show':''}`} id='modaleducation' style={{display:showModal?'block':'none'}}>
        <div className='modal-dialog modal-dialog-centered modal-lg'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h4 className='modal-title'>Profile Pending</h4>
                    <button className='btn btn-close' data-bs-dismiss='modal' onClick={closeModal} type='button'></button>
                </div>
                <div className='modal-body'>
                    {data && data.map((item)=>
                        <p className='pendingprofile'>{item.event}</p>
                    )}
                    
                
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
