import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'


function ShiftInput({ shift_info, onChangeHandler, customKey, removeShiftHandler }){
    let [show, setShow] = useState(false)

    let hideModal = ()=>setShow(false)
    let showModal = ()=>setShow(true)

    function onRepeatModalSubmit(event){
        event.preventDefault()
    }

    let RepeatModal = (<Modal size="md" show={show} onHide={hideModal}>
                            <Modal.Header closeButton>
                            <Modal.Title>Repeat Shift {shift_info.shift_start} to {shift_info.shift_end}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Repeat...
                                <form onSubmit={onRepeatModalSubmit}>
                                   <input type="checkbox" id="monday" name="monday" value="1" />
                                    <label>Every Monday</label><br />

                                    <input type="checkbox" id="tuesday" name="tuesday" value="2" />
                                    <label>Every Tuesday</label><br />

                                    <input type="checkbox" id="wednesday" name="wednesday" value="3" />
                                    <label>Every Wednesday</label><br />

                                    <input type="checkbox" id="thursday" name="thursday" value="4" />
                                    <label>Every Thursday</label><br />

                                    <input type="checkbox" id="friday" name="friday" value="5" />
                                    <label>Every Friday</label><br />

                                    <input type="checkbox" id="saturday" name="saturday" value="6" />
                                    <label>Every Saturday</label><br />

                                    <input type="checkbox" id="sunday" name="sunday" value="0" />
                                    <label>Every Sunday</label><br />

                                    <input type="submit" />

                                </form>

                            </Modal.Body>

                        </Modal>)

    return <div>

            {RepeatModal}

            Shift Start:
            <input type="datetime-local" name="shift_start" onChange={(event)=>{
                onChangeHandler(event.target.value, "shift_start", customKey)
            }} value={shift_info.shift_start}/>

            Shift End:
            <input type="datetime-local" name="shift_end" onChange={(event)=>{
                onChangeHandler(event.target.value, "shift_end", customKey)
            }} value={shift_info.shift_end}/>

            Workers required:
            <input type="text" name="workers_required" value={shift_info.workers_required} onChange={(event)=>{
                onChangeHandler(event.target.value, "workers_required", customKey)
            }} />

            <button type="button" onClick={showModal}>Repeat Shift...</button>
            <button type="button" onClick={()=>{removeShiftHandler(customKey)}}>Remove shift</button>

            </div>

}

export default ShiftInput