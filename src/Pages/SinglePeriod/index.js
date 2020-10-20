import React, { useState }from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { addPreference } from '../../redux/action-creators'
import Cookies from 'js-cookie'

function SinglePeriod({userGroups, userShifts, addPreference, ...props}) {
    let group_id = props.match.params.group_id
    let period_id = props.match.params.period_id
    let history = useHistory()

    let [blockedOut, setBlockedOut] = useState([])
    let [preferred, setPreferred] = useState([])

    function submitShiftPreferenceHandler(event) {
        event.preventDefault()

        let requestBody = {
            preferred_ids: preferred,
            blocked_ids: blockedOut,
            period: period_id
        }

        let token = Cookies.get('csrftoken')

        addPreference(token, requestBody, group_id)

        history.push(`/groups/${group_id}`)


    }

    function checkPreferred(event, shift_id){
        setPreferred((prevState)=>{
            let newState=[...prevState]

            if(newState.includes(shift_id)){
                let index = newState.indexOf(shift_id)
                newState.splice(index, 1)

            } else {
                newState.push(shift_id)
            }
            return newState
        })

        event.persist()

    }

    function checkBlockedOut(event, shift_id){
        setBlockedOut((prevState)=>{
            let newState=[...prevState]

            if(newState.includes(shift_id)){
                let index = newState.indexOf(shift_id)
                newState.splice(index, 1)

            } else {
                newState.push(shift_id)
            }
            return newState
        })

        event.persist()

    }


    if(userGroups[group_id]){
        let periodData;

        for(let i=0;i < userGroups[group_id]['periods'].length; i++){
            if(userGroups[group_id]['periods'][i].id==period_id){
                periodData = userGroups[group_id]['periods'][i]
                break
            }
        }

        if(!userGroups[group_id].published){

            let shifts_for_preferred = periodData.shift_set.map((item, index)=>{
                return <div key={index}> <input type="checkbox" value={item.id} onChange={(event)=>{checkPreferred(event, item.id)}}/> {item.shift_start} to {item.shift_end}</div>
            })

            let shifts_for_blocked_out = periodData.shift_set.map((item, index)=>{
                return <div key={index}> <input type="checkbox" value={item.id} onChange={(event)=>{checkBlockedOut(event, item.id)}} /> {item.shift_start} to {item.shift_end}</div>
            })

            return <div>
                <h2>{userGroups[group_id].name}</h2>

                <h4>Shifts from {periodData.period_start} to {periodData.period_end}</h4>

                <div>
                    <form onSubmit={submitShiftPreferenceHandler}>
                        Preferred Shifts:
                        {shifts_for_preferred}


                        Blocked out shifts:
                        {shifts_for_blocked_out}

                        <input type="submit" />
                    </form>
                </div>




               </div>

        } else {

            return <div>Show all shifts table.</div>

        }



    } else {
        return "Loading..."

    }



}


const mapStateToProps = (state) => {
    return {
        userGroups: state.appActions.userGroups,
        userShifts: state.appActions.userShifts
    }
}

export default withRouter(connect(mapStateToProps, {addPreference})(SinglePeriod))