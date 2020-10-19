import React, { useState } from 'react'
import MemberInput from '../AddGroup/MemberInput'
import DeleteButton from '../AddGroup/DeleteButton'
import { Modal } from 'react-bootstrap'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'


import { updateGroup } from '../../redux/action-creators'


function AddMember ({ show, hideAddMember, updateGroup, groupID }) {

    let [memberList, setMemberList] = useState({0: (<div><MemberInput customKey={0} addMemberID={addMemberID}/><DeleteButton customKey={0} deleteMember={deleteMember}/></div>)})

    let [counter, setCounter] = useState(1)

    let [memberIDObj, setMemberIDObj] = useState({})

    //adds member input component to DOM
    function addMember(){
        setMemberList((prevState)=>{prevState[counter] = (<div><MemberInput customKey={counter} addMemberID={addMemberID}/><DeleteButton customKey={counter} deleteMember={deleteMember}/></div>); return prevState})

        setCounter((prevState)=>prevState+1)
    }

    function addNewMemberToGroup(event){
        event.preventDefault()

        //clean data

        let requestBody = {
            newMembers: Object.values(memberIDObj),
            updateType: "add_new_member",
            groupID: groupID

        }

        let token = Cookies.get('csrftoken')

        //call redux thunk

        updateGroup(token, requestBody)


        return
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



    return (<div>
            <Modal size="lg" show={show} onHide={hideAddMember}>
                <Modal.Header closeButton>
                    <Modal.Title> Add Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={addNewMemberToGroup}>

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
            </Modal>

            </div>)

}

export default connect(null, { updateGroup })(AddMember)