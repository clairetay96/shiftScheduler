import React from 'react'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './index.css'


function SingleShiftModal ({show, modalData, hideModal}) {

    if(modalData.users){
        modalData.users.sort((a,b)=>{
            return a.username.toUpperCase()<b.username.toUpperCase? 1 : -1
        })
    }

    return (<Modal show={show} onHide={hideModal}>
                <Modal.Header closeButton>
                    <h3>Shift for <Link to={`/groups/${modalData.group_id}`}>{modalData.group_name}</Link></h3>
                </Modal.Header>
                <Modal.Body>
                    <div className="shift-time">
                        <div>
                            Starts at:
                        </div>
                        <div>
                            {moment(modalData.start).format("DD/MM/YY h.mm a")}
                        </div>
                    </div>
                    <div className="shift-time">
                        <div>
                            Ends at:
                        </div>
                        <div>
                        {moment(modalData.end).format("DD/MM/YY h.mm a")}
                        </div>
                    </div>
                    <div>
                        <div>
                            Shift workers:
                        </div>
                        <div>
                            {modalData.users&&modalData.users.map(item=>item.username).join(", ")}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="close-modal-button-div">
                        <button onClick={hideModal}>Close</button>
                    </div>
                </Modal.Footer>
            </Modal>)

}

export default SingleShiftModal