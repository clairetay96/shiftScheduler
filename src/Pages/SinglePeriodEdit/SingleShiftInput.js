import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'


function SingleShiftInput({ shiftOnChangeHandler, index, shiftInfo, deleteShiftHandler, groupMembers, setPeriod }){

    let onChangeHandler = (event)=>{

        if(event.target!==undefined){
            let newVal = event.target.value
            let fieldChanged = event.target.name
            shiftOnChangeHandler(index, fieldChanged, newVal)
        } else {
            shiftOnChangeHandler(index, "workers", event)
        }
    }



    return (
                <tbody>
                <tr>
                <td>
                <input type="datetime-local" onChange={onChangeHandler} name="shift_start" value={shiftInfo.shift_start}/>
                </td>

                <td>
                <input type="datetime-local" onChange={onChangeHandler} name="shift_end" value={shiftInfo.shift_end}/>
                </td>

                <td>
                <input type="text" onChange={onChangeHandler} name="workers_required" value={shiftInfo.workers_required}/>
                </td>

                <td>

                <Typeahead id="basic-typeahead-multiple" multiple options={Object.values(groupMembers)} onChange={onChangeHandler} placeholder="Select Members..." selected={shiftInfo.users.map((item)=> groupMembers[item])} />
                </td>

                <td>
                    <button onClick={()=>{deleteShiftHandler(index)}}>Delete shift</button>
                </td>
                </tr>
                </tbody>

            )

}

export default SingleShiftInput