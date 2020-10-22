import React, { useState, useEffect } from 'react'
import { withRouter, Link, useHistory } from "react-router-dom";
import { connect } from 'react-redux'
import AddMember from '../../Components/AddMember'
import SingleMember from '../../Components/SingleMember'
import SinglePeriodRow from '../../Components/SinglePeriodRow'
import { deleteGroup } from '../../redux/action-creators'

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
    let [events, setEvents] = useState([])

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
                            title: `${moment(item1.shift_start).format("HH:mm")}-${moment(item1.shift_end).format("HH:mm")}`,
                            start: new Date(item1.shift_start),
                            end: new Date(item1.shift_end)
                        })
                    })
                }

            })
            console.log(eventsList)

            setEvents(eventsList)
        }

    }, [userGroups])



    if(userGroups[props.match.params.id]){
        return <div>
                <h1>{userGroups[props.match.params.id].name}</h1>
                {userGroups[props.match.params.id].is_admin ?
                    <div>
                        <button onClick={deleteGroupOnClick}>Delete Group</button>
                    </div> : null
                }
                <div>

                    {userGroups[props.match.params.id].is_admin ?
                        <div>
                        <div onClick={showAddMember}>Add member</div>
                    <AddMember show={show} hideAddMember={hideAddMember} groupID={props.match.params.id} memberUsernames={userGroups[props.match.params.id].members.map((item)=>item.username)}/>

                    </div>:
                    null}
                </div>

                {userGroups[props.match.params.id].is_admin ?
                    <div>
                        <Link to={`/groups/${props.match.params.id}/periods/new`}> Add Period </Link>
                    </div> :

                    null }

                <div>
                <h3>Periods</h3>
                {userGroups[props.match.params.id].periods.map((item, index)=>{
                    if(item){
                         return <div key={index}><SinglePeriodRow period_info={item} is_admin={userGroups[props.match.params.id].is_admin}/></div>
                     }
                 })}

                </div>


                <div>

                <h3>Members</h3>
                {userGroups[props.match.params.id].members.map((item, index)=>{
                    if(item){
                         return <div key={index}><SingleMember username={item.username} userID={item.id} userIsAdmin={userGroups[props.match.params.id].admins.filter(adminItem=>adminItem.id===item.id)} isAdmin={userGroups[props.match.params.id].is_admin} groupID={props.match.params.id} /></div>

                    }



                })}
                </div>

                <div style={{height: 700, width: '80%'}}>
                    <Calendar
                        localizer={someLocalizer}
                        events={events}
                    />
                </div>

        </div>

    } else {
        return "Loading..."
    }

}

const mapStateToProps = (state)=>({
    userGroups: state.appActions.userGroups
})

export default withRouter(connect(mapStateToProps, { deleteGroup })(SingleGroup))