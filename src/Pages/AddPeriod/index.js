import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import { addPeriodDispatch } from '../../redux/action-creators'
import ShiftInput from './ShiftInput'

function AddPeriod ({ addPeriodDispatch,...props }) {
    let history = useHistory()
    let [shiftInfo, setShiftInfo] = useState([{shift_start: "", shift_end: "",workers_required: ""}])

    let [periodStart, setPeriodStart] = useState("")
    let [periodEnd, setPeriodEnd] = useState("")


    //create shift UI

    function createShiftUI(){
        return shiftInfo.map((item, index)=>{
            return <div key={index}><ShiftInput shift_info={item} onChangeHandler={onChangeShiftInput} customKey={index} removeShiftHandler={deleteShiftInput}/></div>
        })
    }


    //function to add shifts. Create shift info, then based on that generate HTML Obj
    function addShiftInput(){

        setShiftInfo((prevState)=>{
            let newState2 = [...prevState,{
                shift_start: "",
                shift_end: "",
                workers_required: ""
            }]

            return newState2
        })
    }


    //function to delete shifts
    function deleteShiftInput(customKey){

        setShiftInfo((prevState)=>{
            let someNewState = [...prevState]
            someNewState.splice(customKey, 1)
            return someNewState
        })

    }


    //function for onChange of any of the fields in a shift - set the shift info. tie values to shiftInfo state

    function onChangeShiftInput(eventValue, eventName, customKey){


        setShiftInfo((prevState)=>{
            let newState1 = [...prevState]
            if(eventName==="shift_start"){
                newState1[customKey]['shift_start'] = eventValue

            } else if(eventName==="shift_end"){
                newState1[customKey]['shift_end'] = eventValue

            } else if(eventName==="workers_required"){
                newState1[customKey]['workers_required'] = eventValue
            }

            return newState1

        })

        return
    }


    //function to repeat shifts: 1.Calculate values required, store in array. 2. add to shift info. 3. generate HTML objs.


    //on submit
    function addPeriodForm(event){
        event.preventDefault()

        let requestBody = {
            period_start: periodStart,
            period_end: periodEnd,
            work_group: props.match.params.id,
            shift_set: shiftInfo
        }

        let token = Cookies.get('csrftoken')
        addPeriodDispatch(token, requestBody)
        history.push(`/groups/${props.match.params.id}`)

    }

    function onChangePeriodEnd(event){
        setPeriodEnd(event.target.value)
    }
    function onChangePeriodStart(event){
        setPeriodStart(event.target.value)
    }

    return (<div>

                <h1>Add Period</h1>
                <form onSubmit={addPeriodForm}>

                    Start Date: <input type="datetime-local" value={periodStart} onChange={onChangePeriodStart} name="startDate"/>
                    End Date: <input type="datetime-local" value={periodEnd} onChange={onChangePeriodEnd} name="endDate"/>

                    Shifts:

                    {createShiftUI()}

                    <button type="button" onClick={addShiftInput}>Add another shift</button>



                    <input type="submit" />


                </form>

            {/* include some kind of display here */}

        </div>)

}

export default withRouter(connect(null, {addPeriodDispatch})(AddPeriod))