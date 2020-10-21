import React, { useState } from 'react'

import MemberInput from '../AddGroup/MemberInput'

import { Modal } from 'react-bootstrap'
import Cookies from 'js-cookie'

import { connect } from 'react-redux'

import { updateGroup } from '../../redux/action-creators'


function AddMember ({ show, hideAddMember, updateGroup, groupID, memberUsernames }) {

    let [memberList, setMemberList] = useState([])

    function addMemberID(listOfIDs) {
        setMemberList(listOfIDs)
    }

    function addNewMemberToGroup(event){
        event.preventDefault()

        let requestBody = {
            newMembers: memberList,
            updateType: "add_new_member",
            groupID: groupID
        }

        let token = Cookies.get('csrftoken')
        updateGroup(token, requestBody)

        return
    }

    return (<div>
            <Modal size="lg" show={show} onHide={hideAddMember}>
                <Modal.Header closeButton>
                    <Modal.Title> Add Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={addNewMemberToGroup}>

                            Members: (type in their username)

                            <MemberInput addMemberID={addMemberID} existingMembers={memberUsernames}/>

                            <input type="submit" />

                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            </div>)

}

export default connect(null, { updateGroup })(AddMember)