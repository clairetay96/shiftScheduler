import React, { useState, useEffect }from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { addPreference } from '../../redux/action-creators'
import Cookies from 'js-cookie'
import moment from 'moment'
import './index.css'

//page for group members to submit shift preferences
function SinglePeriod({userGroups, userShifts, addPreference, userID, ...props}) {
    let group_id = props.match.params.group_id
    let period_id = props.match.params.period_id
    let history = useHistory()

    let [periodData, setPeriodData] = useState(null)
    let [blockedOut, setBlockedOut] = useState([])
    let [preferenceID, setPreferenceID] = useState(null)
    let [preferred, setPreferred] = useState([])

    //set blockedOut and preferred if they exist.
    useEffect(()=>{
        //check if user exists in userpreference_set

        if(userGroups[group_id]){
            let chosenPeriod;
            for(let i=0;i < userGroups[group_id]['periods'].length; i++){
                if(userGroups[group_id]['periods'][i].id==period_id){
                    chosenPeriod = userGroups[group_id]['periods'][i]
                    chosenPeriod.shift_set.sort((a, b)=>{
                        if(moment(a).isBefore(b)){
                            return -1
                        } else {
                            return 1
                        }
                    })

                    setPeriodData(chosenPeriod)
                    break
                }
            }

            for(let j=0;j<chosenPeriod['userpreference_set'].length;j++){
                if(chosenPeriod['userpreference_set'][j].user==userID){
                    setPreferenceID(chosenPeriod['userpreference_set'][j].id)

                    setPreferred(chosenPeriod['userpreference_set'][j].preferred_shifts.map(item=>item.id))

                    setBlockedOut(chosenPeriod['userpreference_set'][j].blocked_out_shifts.map(item=>item.id))
                    break

                }
            }
        }



    }, [userGroups, props.match.params.id])

    function submitShiftPreferenceHandler(event) {
        event.preventDefault()

        let requestBody = {
            preferred_ids: preferred,
            blocked_ids: blockedOut,
            period: period_id
        }

        let token = Cookies.get('csrftoken')

        addPreference(token, requestBody, group_id, preferenceID)

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

        if(periodData&&!periodData.published){

            let shifts_for_preferred = periodData.shift_set.map((item, index)=>{
                return <div key={index}> <input type="checkbox" value={item.id} onChange={(event)=>{checkPreferred(event, item.id)}} defaultChecked={preferred.includes(item.id)} /> {moment(item.shift_start).format("DD/MM/YY ddd h.mm a")} to {moment(item.shift_end).format("DD/MM/YY ddd h.mm a")}</div>
            })

            let shifts_for_blocked_out = periodData.shift_set.map((item, index)=>{
                return <div key={index}> <input type="checkbox" value={item.id} onChange={(event)=>{checkBlockedOut(event, item.id)}} defaultChecked={blockedOut.includes(item.id)}/> {moment(item.shift_start).format("DD/MM/YY ddd h.mm a")} to {moment(item.shift_end).format("DD/MM/YY ddd h.mm a")}</div>
            })

            return <div>
                <h2>{userGroups[group_id].name}</h2>

                <h3>Shifts from {moment(periodData.period_start).format("DD/MM/YY ddd")} to {moment(periodData.period_end).format("DD/MM/YY ddd")}</h3>

                <div>
                    <form onSubmit={submitShiftPreferenceHandler}>
                        <h4>Preferred Shifts:</h4>
                        {shifts_for_preferred}


                        <h4>Blocked out shifts:</h4>
                        {shifts_for_blocked_out}

                        <input type="submit" style={{marginTop: "10px"}} />
                    </form>
                </div>




               </div>

        } else {

            return <div>You cannot submit preferences once a period has been published.</div>

        }



    } else {
        return "Loading..."

    }



}


const mapStateToProps = (state) => {
    return {
        userGroups: state.appActions.userGroups,
        userShifts: state.appActions.userShifts,
        userID: state.authActions.userID
    }
}

export default withRouter(connect(mapStateToProps, {addPreference})(SinglePeriod))