import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

import './index.css'


function ShiftInput({ shift_info, onChangeHandler, customKey, removeShiftHandler, repeatShift }){
    let [show, setShow] = useState(false)
    let [checkedValues, setCheckedValues] = useState([])

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    function onCheckToggle(event) {

        if(checkedValues.includes(event.target.value)){
            setCheckedValues((prevState)=>{
                let tempState = [...prevState]
                let indexSplice = tempState.indexOf(event.target.value)
                tempState.splice(indexSplice, 1)
                return tempState
            })

        } else {
            setCheckedValues((prevState)=>[...prevState, event.target.value])
        }



        event.persist()
    }

    function createDayOptions(){
        return days.map((item, index)=>{

            return (<div key={index}>
                    <input type="checkbox" onChange={onCheckToggle}  value={index} className="day-checkbox"/>
                    <label className="day-label">Every {item}</label>

                    </div>)
        })

    }

    let hideModal = ()=>setShow(false)
    let showModal = ()=>setShow(true)



    function onRepeatModalSubmit(){

        repeatShift(checkedValues, shift_info.shift_start, shift_info.shift_end, shift_info.workers_required)

    }

    let RepeatModal = (<Modal size="md" show={show} onHide={hideModal}>
                            <Modal.Header closeButton>
                            <Modal.Title>Repeat Shift {shift_info.shift_start} to {shift_info.shift_end}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Repeat...
                                <div className="day-options">

                                   {createDayOptions()}

                                </div>

                                <div className="repeat-submit-div">
                                <button onClick={onRepeatModalSubmit} className="submit-repeat-shifts" type="button">Submit</button>
                                </div>

                            </Modal.Body>

                        </Modal>)

    return <div className="shift-input-card">

            {RepeatModal}

            <div>
                <div>
                    <div>
                    Shift start:
                    </div>
                    <input type="datetime-local" name="shift_start" onChange={(event)=>{
                        onChangeHandler(event.target.value, "shift_start", customKey)
                    }} value={shift_info.shift_start}/>
                </div>

                <div>
                <div>
                Shift end:
                </div>
                <input type="datetime-local" name="shift_end" onChange={(event)=>{
                    onChangeHandler(event.target.value, "shift_end", customKey)
                }} value={shift_info.shift_end}/>
                </div>
            </div>

            <div>
                <div>
                    <div>
                    Workers required:
                    </div>
                    <input type="text" name="workers_required" value={shift_info.workers_required} onChange={(event)=>{
                    onChangeHandler(event.target.value, "workers_required", customKey)
                }} />
                </div>

                <div className="shift-input-options">

                    <button type="button" onClick={showModal}>Repeat Shift...</button>
                    <button type="button" className="delete-shift-button" onClick={()=>{removeShiftHandler(customKey)}}>Remove shift</button>
                </div>
            </div>

            </div>

}

export default ShiftInput