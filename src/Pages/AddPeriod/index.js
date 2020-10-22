import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'
import { addPeriodDispatch } from '../../redux/action-creators'
import ShiftInput from './ShiftInput'
import moment from 'moment'

import './index.css'

function AddPeriod ({ addPeriodDispatch,...props }) {
    let history = useHistory()
    let [shiftInfo, setShiftInfo] = useState([{shift_start: "", shift_end: "",workers_required: ""}])

    let [periodStart, setPeriodStart] = useState("")
    let [periodEnd, setPeriodEnd] = useState("")

    //update shiftInfo based on checked days in repeat shifts modal.
    function repeatShift(repeatDays, shiftStartTime, shiftEndTime, workersRequired){

        //check that periodStart and periodEnd are defined.
        let momentShiftStart = moment(shiftStartTime)
        let momentShiftStartTime = moment(shiftStartTime).format('HH:mm')


        let momentShiftEnd = moment(shiftEndTime)
        let shiftDuration = moment.duration(momentShiftEnd.diff(momentShiftStart))
        let shiftDurationAsMinutes = shiftDuration.asMinutes()

        repeatDays.forEach((item)=>{
            let dayValue = parseInt(item)
            let start = moment(periodStart)
            let end = moment(periodEnd)


            //set start day to first xday (eg monday, tuesday.. ) in period
            while(start < end && start.day() !== dayValue ){
                start.add(1, 'days')
            }

            while (start < end ){
                let shiftStartFormatted = start.format("YYYY-MM-DD")+"T"+momentShiftStartTime

                let shiftEndFormatted = moment(start.format("YYYY-MM-DD")+"T"+momentShiftStartTime).add(shiftDurationAsMinutes, 'minutes').format()

                shiftEndFormatted = shiftEndFormatted.slice(0, shiftEndFormatted.length - 6)

                if(shiftStartTime!==shiftStartFormatted && shiftEndFormatted!==shiftEndTime){
                    let newShiftInfo = {
                        shift_start: shiftStartFormatted,
                        shift_end: shiftEndFormatted,
                        workers_required: workersRequired
                    }

                    setShiftInfo((prevState)=>[...prevState, newShiftInfo])

                }

                start.add(7, 'days')
            }

            setShiftInfo((prevState)=>{
                let tempNewState = [...prevState]
                tempNewState.sort((a,b)=>{
                    if(moment(a.shift_start).isBefore(b.shift_start)){
                        return -1

                    } else if (moment(b.shift_start).isBefore(a.shift_start)) {
                        return 1
                    }
                    return 0

                })

                return tempNewState
            })



        })

    }




    //create shift UI

    function createShiftUI(){
        return shiftInfo.map((item, index)=>{
            return <div key={index}><ShiftInput shift_info={item} onChangeHandler={onChangeShiftInput} customKey={index} removeShiftHandler={deleteShiftInput} repeatShift={repeatShift}/></div>
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
        //TO ADD: check that > period start
        //TO ADD: make sure that all shifts are within the period
        setPeriodEnd(event.target.value)

    }
    function onChangePeriodStart(event){
        //TO ADD: check that < period end
        //TO ADD: make sure that all shifts are within the period.
        setPeriodStart(event.target.value)
    }

    return (<div className="add-period-page">

                <h1>Add Period</h1>
                <form onSubmit={addPeriodForm}>
                    <div className="period-dates">
                    <table>
                    <tbody>
                    <tr>
                    <td>Period Start:</td>
                    <td>
                    <input type="datetime-local" value={periodStart} onChange={onChangePeriodStart} name="startDate"/>
                    </td>
                    </tr>
                    <tr>
                    <td>Period End:</td>
                    <td><input type="datetime-local" value={periodEnd} onChange={onChangePeriodEnd} name="endDate"/></td>
                    </tr>
                    </tbody>
                    </table>
                    </div>

                    <div>
                        <div>
                        <h3>Shifts</h3>
                        </div>

                        {createShiftUI()}

                        <div className="add-shift">
                        <button type="button" className="add-shift-button" onClick={addShiftInput}>Add another shift</button>
                        </div>
                    </div>



                    <input type="submit" />


                </form>

            {/* include some kind of display here */}

        </div>)

}

export default withRouter(connect(null, {addPeriodDispatch})(AddPeriod))