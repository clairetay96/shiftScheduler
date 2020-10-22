import React, { useState, useEffect } from 'react'
import { withRouter, Link, useHistory } from "react-router-dom";
import { connect } from 'react-redux'
import AddMember from '../../Components/AddMember'
import SingleMember from '../../Components/SingleMember'
import SinglePeriodRow from '../../Components/SinglePeriodRow'
import SingleShiftModal from '../../Components/SingleShiftModal'
import { deleteGroup } from '../../redux/action-creators'

import './index.css'
import { BiPlus } from 'react-icons/bi'

import { Calendar, Views } from 'react-big-calendar'
import localizer from 'react-big-calendar/lib/localizers/moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

import Cookies from 'js-cookie'
import moment from 'moment'

const someLocalizer = localizer(moment)

const SingleGroup = ({ userGroups, deleteGroup, ...props }) => {
    let history = useHistory()

    //modal functionality - show vs hide
    let [show, setShow] = useState(false)

    //calendar stuffs
    let [events, setEvents] = useState([])
    let [modalData, setModalData] = useState({})
    let [modalShow, setModalShow] = useState(false)

    const hideAddMember = () => {
        setShow(false)
    }

    const showAddMember = () => {
        setShow(true)
    }

    //deleteGroup functionality - redux thunk

    function deleteGroupOnClick(){
        deleteGroup(Cookies.get('csrftoken'), props.match.params.id)
        history.push("/groups/")

    }

    useEffect(()=>{
        if(Object.keys(userGroups).length > 0){
            let eventsList = []

            userGroups[props.match.params.id].periods.forEach((item)=>{
                if(item.published){


                    item.shift_set.forEach((item1)=>{
                        eventsList.push({
                            id: item1.id,
                            title: `${moment(item1.shift_start).format("h.mm a")}-${moment(item1.shift_end).format("h.mm a")}`,
                            start: new Date(item1.shift_start),
                            end: new Date(item1.shift_end),
                            group_id: props.match.params.id,
                            group_name:userGroups[props.match.params.id].name,
                            users: item1.users
                        })
                    })
                }

            })

            setEvents(eventsList)
        }

    }, [userGroups, props.match.params.id])

    const onEventSelected = (event)=>{
        setModalData({
            start: event.start,
            end: event.end,
            users: event.users,
            group_id: event.group_id,
            group_name: event.group_name
        })

        setModalShow(true)
    }



    if(userGroups[props.match.params.id]){
        return <div className="singlegroup-page">
                <h2>Shifts for {userGroups[props.match.params.id].name}</h2>
                <SingleShiftModal modalData={modalData} show={modalShow} hideModal={()=>{setModalShow(false)}}/>

                <div style={{height: 550, width: '80%',margin: '15px 0', minWidth: '550px'}}>
                    <Calendar
                        localizer={someLocalizer}
                        events={events}
                        onSelectEvent={onEventSelected}
                    />
                </div>

                <div className="group-details">
                <div>
                <div className="period-header">
                <h3>Periods</h3>

                {userGroups[props.match.params.id].is_admin ?
                    <div>
                        <Link to={`/groups/${props.match.params.id}/periods/new`}> Create new period </Link>
                    </div> :

                    null }
                </div>

                {userGroups[props.match.params.id].periods.map((item, index)=>{
                    if(item){
                         return <div key={index}><SinglePeriodRow period_info={item} is_admin={userGroups[props.match.params.id].is_admin}/></div>
                     }
                 })}

                </div>


                <div>
                    <div className="member-header">
                        <div>
                            <h3>Members</h3>
                        </div>

                        {userGroups[props.match.params.id].is_admin ?
                            <div>
                            <div onClick={showAddMember}><BiPlus size={25}/></div>
                        <AddMember show={show} hideAddMember={hideAddMember} groupID={props.match.params.id} memberUsernames={userGroups[props.match.params.id].members.map((item)=>item.username)}/>

                        </div>:
                        null}

                    </div>

                    {userGroups[props.match.params.id].members.map((item, index)=>{
                        if(item){
                             return <div key={index}><SingleMember username={item.username} userID={item.id} userIsAdmin={userGroups[props.match.params.id].admins.filter(adminItem=>adminItem.id===item.id)} isAdmin={userGroups[props.match.params.id].is_admin} groupID={props.match.params.id} /></div>

                        }



                    })}
                    </div>
                </div>

                {userGroups[props.match.params.id].is_admin ?
                    <div className="delete-group">
                        <h3>Delete Group</h3>
                        <button onClick={deleteGroupOnClick} className="delete-button">Delete Group</button>
                    </div> : null
                }

        </div>

    } else {
        return <div className="singlegroup-page">Loading...</div>
    }

}

const mapStateToProps = (state)=>({
    userGroups: state.appActions.userGroups
})

export default withRouter(connect(mapStateToProps, { deleteGroup })(SingleGroup))