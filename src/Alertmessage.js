import React from 'react'

export default function Alertmessage(props) {
  return (
    <div class={`alert alert-${props.message.type} alert-dismissible`}>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
             {props.message.message}
    </div>
  )
}
