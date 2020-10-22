import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

import './index.css'

function AddShiftModal({show, onHideFunction, addShiftFunction, period_id, groupMembers, groupMembersByUsername }) {
    let [shift_start, setShiftStart] = useState("")
    let [shift_end, setShiftEnd] = useState("")
    let [workers_required, setWorkersRequired] = useState("")
    let [workers, setWorkers] = useState([])


    let addShiftSubmit = () => {
        let newVals = {
            shift_start,
            shift_end,
            workers_required,
            users: workers.map((item)=>groupMembersByUsername[item])
        }

        console.log(newVals)

        addShiftFunction(newVals)

        setShiftStart("")
        setShiftEnd("")
        setWorkersRequired("")
        setWorkers([])

    }

    let onChangeHandler = (e) => {
        console.log(e)
        setWorkers(e)

    }

    if (groupMembers){
        return (<Modal show={show} onHide={onHideFunction}>
                <Modal.Header closeButton>
                    <h3>Add Shift</h3>
                </Modal.Header>

                <Modal.Body>

                    <div className="input-field-div">
                        <div>
                            Shift start:
                        </div>
                        <input type="datetime-local" value={shift_start} onChange={(e)=>setShiftStart(e.target.value)}/>
                    </div>
                    <div className="input-field-div">
                        <div>
                            Shift End:
                        </div>
                        <input type="datetime-local" value={shift_end} onChange={(e)=>setShiftEnd(e.target.value)}/>
                    </div>
                    <div className="input-field-div">
                        <div>
                            Workers required:
                        </div>
                        <input type="text" value={workers_required} onChange={(e)=>setWorkersRequired(e.target.value)}/>
                    </div>
                    <div className="input-field-div">
                        <div>
                            Workers:
                        </div>
                        <Typeahead id="basic-typeahead-multiple" multiple options={Object.values(groupMembers)} onChange={onChangeHandler} placeholder="Select Members..." selected={workers} />
                    </div>

                    <div className="add-shift-button-div">
                    <button onClick={addShiftSubmit}>Add Shift</button>
                    </div>

                </Modal.Body>
            </Modal>)
        } else {
            return "Loading..."
        }


}

export default AddShiftModal