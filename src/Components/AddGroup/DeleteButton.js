import React from 'react'

function DeleteButton({ deleteMember, customKey }) {
    return <button type="button" onClick={()=>{deleteMember(customKey)}}>Delete</button>

}

export default DeleteButton