import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie'

import { createNewGroup } from '../../redux/action-creators'
import MemberInput from './MemberInput'

import './index.css'


const AddGroup = ({ show, hideAddGroup, createNewGroup }) => {
    let [memberList, setMemberList] = useState([{user_id: null, username: ""}])
    let [groupName, setGroupName] = useState("")
    let history = useHistory()

    //make a new group
    function makeNewGroup(event) {
        event.preventDefault()

        let requestBody = {
            name: groupName,
            members_id: memberList
        }
        let token = Cookies.get('csrftoken')

        let newGroup = createNewGroup(token, requestBody)
                            .then(res=> {
                                hideAddGroup()
                                history.push("/groups/"+res.id)
                            })

    }

    function addMemberID(listOfIDs) {
        setMemberList(listOfIDs)
    }

    function onChangeGroupName(event){
        setGroupName(event.target.value)

    }

    return (<Modal size="lg" show={show} onHide={hideAddGroup}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={makeNewGroup} className="add-group-form">

                            <input type="text" value={groupName} onChange={onChangeGroupName} placeholder="Group Name" autoComplete="off" className="group-name-input"/>

                            <div className="member-input-div">

                            <div>Find users by username:</div>

                            <MemberInput addMemberID={addMemberID} existingMembers={[]} />

                            </div>

                            <input type="submit" />

                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>)

}

export default connect(null, {createNewGroup})(AddGroup)