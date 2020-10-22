import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Calendar, Views } from 'react-big-calendar'
import localizer from 'react-big-calendar/lib/localizers/moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';


import moment from 'moment'

const someLocalizer = localizer(moment)

const Homepage = ({ loggedIn, userShifts })=>{
    let [events, setEvents] = useState([])

    useEffect(()=>{

        if(userShifts.length > 0){
            setEvents(userShifts.map((item)=>{
                return {
                    id: item.id,
                    title: `${item.group_name}  ${moment(item.shift_start).format("HH:mm")}-${moment(item.shift_end).format("HH:mm")}`,
                    start: new Date(item.shift_start),
                    end: new Date(item.shift_end)

                }
            }))
        }

    }, [userShifts])

    if(loggedIn){

            return (<div>
                    <h2>Your Shifts</h2>

                    <div style={{height: 700, width: '80%'}}>
                    <Calendar
                        localizer={someLocalizer}
                        events={events}
                    />
                    </div>

                  </div>)


    } else {
        return (<div>
                This is the homepage.
            </div>)
    }


}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn,
    userShifts: state.appActions.userShifts
})


export default connect(mapStateToProps)(Homepage)