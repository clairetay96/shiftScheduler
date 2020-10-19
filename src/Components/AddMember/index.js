import React, { useState } from 'react'
import MemberInput from '../AddGroup/MemberInput'
import DeleteButton from '../AddGroup/DeleteButton'
import { Modal } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'


import { updateGroup } from '../../redux/action-creators'


function AddMember ({ show, hideAddMember, updateGroup, groupID }) {

    let [memberList, setMemberList] = useState([{user_id: null, username: ""}])

    //adds member input component to DOM
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

    function addNewMemberToGroup(event){
        event.preventDefault()

        let newMembersID = []
        for(let i=0;i<memberList.length;i++){
            if(memberList[i].user_id){
                newMembersID.push(memberList[i].user_id)
            }
        }

        let requestBody = {
            newMembers: Object.values(newMembersID),
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

                            {createMemberInputUI()}

                            <button onClick={addMember} type="button">Add another member.</button>

                            <input type="submit" />

                    </form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            </div>)

}

export default connect(null, { updateGroup })(AddMember)