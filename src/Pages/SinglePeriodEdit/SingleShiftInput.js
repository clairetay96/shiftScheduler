import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

function isNotEmptyObject(obj) {
    return Object.keys(obj).length > 0
}

function SingleShiftInput({ shiftOnChangeHandler, index, shiftInfo, deleteShiftHandler, groupMembers, setPeriod }){
    let [groupMembersState, setGroupMembersState] = useState({})
    let [shiftInfoState, setShiftInfoState] = useState({})

    useEffect(()=>{
        setGroupMembersState(groupMembers)
        setShiftInfoState(shiftInfo)
    }, [groupMembers, shiftInfo])


    let onChangeHandler = (event)=>{

        if(event.target!==undefined){
            let newVal = event.target.value
            let fieldChanged = event.target.name
            shiftOnChangeHandler(index, fieldChanged, newVal)
        } else {
            shiftOnChangeHandler(index, "workers", event)
        }
    }
    console.log(shiftInfoState)

    if(isNotEmptyObject(groupMembersState) && shiftInfoState.users!==undefined){
        console.log(shiftInfoState)
            return (
                <tbody>
                <tr>
                <td>
                <input type="datetime-local" onChange={onChangeHandler} name="shift_start" value={shiftInfoState.shift_start}/>
                </td>
                <td>
                <input type="datetime-local" onChange={onChangeHandler} name="shift_end" value={shiftInfoState.shift_end}/>
                </td>
                <td>
                <input type="text" onChange={onChangeHandler} name="workers_required" value={shiftInfoState.workers_required}/>
                </td>
                <td>
                <Typeahead id="basic-typeahead-multiple" multiple options={Object.values(groupMembersState)} onChange={onChangeHandler} placeholder="Select Members..." selected={shiftInfoState.users.map((item)=> groupMembersState[item])} />
                </td>
                <td>
                    <button onClick={()=>{deleteShiftHandler(index)}}>Delete shift</button>
                </td>
                </tr>
                </tbody>

            )
    } else {
        return "Loading..."
    }




}

export default SingleShiftInput