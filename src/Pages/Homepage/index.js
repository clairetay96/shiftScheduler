import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { Calendar, Views } from 'react-big-calendar'
import localizer from 'react-big-calendar/lib/localizers/moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css'

import SingleShiftModal from '../../Components/SingleShiftModal'


import moment from 'moment'

const someLocalizer = localizer(moment)

const Homepage = ({ loggedIn, userShifts })=>{
    let [events, setEvents] = useState([])
    let [modalShow, setModalShow] = useState(false)
    let [modalData, setModalData] = useState({})

    useEffect(()=>{

        if(userShifts.length > 0){
            setEvents(userShifts.map((item)=>{
                return {
                    id: item.id,
                    title: `${item.group_name}  ${moment(item.shift_start).format("h.mm a")}-${moment(item.shift_end).format("h.mm a")}: : ${Object.values(item.users.map((item)=>item.username)).join(", ")}`,
                    start: new Date(item.shift_start),
                    end: new Date(item.shift_end),
                    users: item.users,
                    group_id: item.group_id,
                    group_name: item.group_name

                }
            }))
        }

    }, [userShifts])

    const onEventSelected = (event)=> {

        setModalData({
            start: event.start,
            end: event.end,
            users: event.users,
            group_id: event.group_id,
            group_name: event.group_name
        })

        setModalShow(true)


    }

    if(loggedIn){

            return (<div className="logged-in-homepage">

                <SingleShiftModal show={modalShow} hideModal={()=>{setModalShow(false)}} modalData={modalData} />


                    <h2>Your Shifts</h2>

                    <div style={{height: 550, width: '80%', margin: '15px 0', minWidth: '550px'}}>
                    <Calendar
                        localizer={someLocalizer}
                        events={events}
                        onSelectEvent={onEventSelected}
                    />
                    </div>

                  </div>)


    } else {
        return (<div className="non-loggedin-homepage">
                <div className="logo-message">
                    <div className="logo-font">DELEGO</div>
                    <div className="message-font">Hassle-free, automated shift assignment.</div>
                    <div className="logo-message-buttons"><Link to="/login"><button>Log In</button></Link> <Link to="/signup"><button>Sign Up</button></Link></div>
                </div>
            </div>)
    }


}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn,
    userShifts: state.appActions.userShifts
})


export default connect(mapStateToProps)(Homepage)