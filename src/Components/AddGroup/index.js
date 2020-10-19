import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import useHistory from 'react-router-dom'
import Cookies from 'js-cookie'

import { createNewGroup } from '../../redux/action-creators'
import MemberInput from './MemberInput'
import DeleteButton from './DeleteButton'


const AddGroup = ({ show, hideAddGroup, createNewGroup }) => {
    let [memberList, setMemberList] = useState({0: (<div><MemberInput customKey={0} addMemberID={addMemberID}/><DeleteButton customKey={0} deleteMember={deleteMember}/></div>)})
    let [counter, setCounter] = useState(1)
    let [memberIDObj, setMemberIDObj] = useState({})


    //make a new group
    function makeNewGroup(event) {
        event.preventDefault()

        let memberIDList = Object.values(memberIDObj)

        let requestBody = {
            name: event.target.groupName.value,
            members_id: memberIDList
        }
        let token = Cookies.get('csrftoken')

        createNewGroup(token, requestBody)
    }

    function addMember({ groupInfo }){
        setMemberList((prevState)=>{prevState[counter] = (<div><MemberInput customKey={counter} addMemberID={addMemberID}/><DeleteButton customKey={counter} deleteMember={deleteMember}/></div>); return prevState})

        setCounter((prevState)=>prevState+1)
    }

    //remove the member from both the setMemberList(HTML rendered on dom) and setMemberIDObj (IDs sent to server)
    function deleteMember(key){
        setMemberList((prevState)=>{
            let newState = {...prevState}
            delete newState[key];
            return newState
        })

        setMemberIDObj((prevState)=>{
            let newState = {...prevState}
            delete newState[key];
            return newState
        })

    }

    //adds member to memberIDObj (list sent to server when new group request is posted)
    function addMemberID(key, newID) {
        setMemberIDObj((prevState)=>{prevState[key]=newID; return prevState})
    }

    return (<Modal size="lg" show={show} onHide={hideAddGroup}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={makeNewGroup}>

                            Name: <input type="text" name="groupName" />

                            Members: (type in their username)

                            {Object.values(memberList).map((item, index)=>{
                                return <div key={index}>{item}</div>
                            })}

                            <button onClick={addMember} type="button">Add another member.</button>

                            <input type="submit" />

                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>)

}

export default connect(null, {createNewGroup})(AddGroup)