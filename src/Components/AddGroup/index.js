import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import useHistory from 'react-router-dom'
import Cookies from 'js-cookie'

import { createNewGroup } from '../../redux/action-creators'
import MemberInput from './MemberInput'
import DeleteButton from './DeleteButton'


const AddGroup = ({ show, hideAddGroup, createNewGroup }) => {
    let [memberList, setMemberList] = useState([{user_id: null, username: ""}])
    let [groupName, setGroupName] = useState("")

    //make a new group
    function makeNewGroup(event) {
        event.preventDefault()

        let memberIDList = memberList.map((item)=>item.user_id)

        let requestBody = {
            name: groupName,
            members_id: memberIDList
        }
        let token = Cookies.get('csrftoken')

        createNewGroup(token, requestBody)
    }

    function createMemberInputUI(){
        return memberList.map((item, index)=>{
            return <div key={index}><MemberInput selectedUsername={item.username} addMemberID={addMemberID} customKey={index}/><DeleteButton deleteMember={deleteMember} customKey={index} /></div>
        })
    }

    function addMember({ groupInfo }){
        setMemberList((prevState)=>[...prevState, {user_id: null, username: ""}])
    }


    function deleteMember(customKey){

        setMemberList((prevState)=>{
            let newState = [...prevState]
            newState.splice(customKey, 1)
            return newState
        })

    }


    function addMemberID(key, newID, newUsername) {
        setMemberList((prevState)=>{
            let someNewState = [...prevState]
            someNewState[key]={user_id: newID, username: newUsername};

            return someNewState
        })
    }

    function onChangeGroupName(event){
        setGroupName(event.target.value)

    }

    return (<Modal size="lg" show={show} onHide={hideAddGroup}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={makeNewGroup}>

                            <input type="text" value={groupName} onChange={onChangeGroupName} placeholder="Group Name"/>

                            <div>

                            Members: (type in their username)

                            {createMemberInputUI()}

                            <button onClick={addMember} type="button">Add another member.</button>
                            </div>

                            <input type="submit" />

                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>)

}

export default connect(null, {createNewGroup})(AddGroup)