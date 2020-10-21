import React from 'react'
import { Modal } from 'react-bootstrap'
import moment from 'moment'

function ShiftPreferenceModal({show, onHideFunction, memberPreference, groupMembers}) {

    function membersNotSubmitted(){
        if(memberPreference){
            //IDs of members who have submitted
            let submittedIDs = memberPreference.map((item)=>item.user)

            let notSubmittedUsers = []

            //loop through all group members
            Object.keys(groupMembers).forEach((item)=>{
                //if the member has not submitted, add their username to notSubmittedUsers
                if(!submittedIDs.includes(parseInt(item))){
                    notSubmittedUsers.push(groupMembers[item])
                }
            })

            //only display the message if there are users who have yet to submit.
            if(notSubmittedUsers.length > 0) {
                return (<div>
                        The following users have not submitted their preference:
                        <div>{notSubmittedUsers.join(", ")}</div>
                    </div>)
            }

            return


        }

    }

    return (<Modal size="lg" show={show} onHide={onHideFunction}>
                <Modal.Header closeButton>
                    <h3>Member Shift Preferences</h3>
                </Modal.Header>

                <Modal.Body>
                    <table>
                        <thead>
                            <tr>
                                <th>Member</th>
                                <th>Preferred Shifts</th>
                                <th>Blocked out shifts</th>
                            </tr>
                        </thead>

                        <tbody>

                    {memberPreference&&memberPreference.map((item, index)=>{
                        return (<tr key={index}>

                                    <td>{groupMembers[item.user]}</td>
                                    <td>{item.preferred_shifts.map((item1, index1)=>{
                                        return (<div key={index1}>{moment(item1.shift_start).format("DD/MM/YY ddd HH:mm")} to {moment(item1.shift_end).format("HH:mm")}</div>)

                                        })}</td>
                                    <td>{item.blocked_out_shifts.map((item1, index1)=>{
                                        return (<div key={index1}>{moment(item1.shift_start).format("DD/MM/YY ddd HH:mm")} to {moment(item1.shift_end).format("HH:mm")}</div>)
                                    })}</td>
                                </tr>)
                    })}
                        </tbody>
                    </table>

                    {membersNotSubmitted()}

                </Modal.Body>
            </Modal>)
}

export default ShiftPreferenceModal