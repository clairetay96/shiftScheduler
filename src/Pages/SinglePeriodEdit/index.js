import React, { useState, useEffect } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { deletePeriod, updatePeriod } from '../../redux/action-creators'
import assignShifts from './utility.js'


import SingleShiftInput from './SingleShiftInput'
import ShiftPreferenceModal from './ShiftPreferenceModal'
import AddShiftModal from './AddShiftModal'
import { BiPlus } from 'react-icons/bi'

import './index.css'

import Cookies from 'js-cookie'
import moment from 'moment'


function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor() === Object
}

//Edit form for admins, populated with period info and with option to edit/assignshifts>publish/delete.
function SinglePeriodEdit({ userGroups, deletePeriod, updatePeriod, ...props }){
    let group_id = props.match.params.group_id
    let period_id = props.match.params.period_id
    let history = useHistory()
    let token = Cookies.get('csrftoken')

    let [userGroup, setUserGroup] = useState({})

    let [period, setPeriod] = useState({ period_start: "", period_end: "", shift_set: []})
    let [deletedShifts, setDeletedShifts] = useState([])
    let [groupMembers, setGroupMembers] = useState({})
    let [groupMembersByUsername, setGroupMembersByUsername] = useState({})

    let [showAddShift, setShowAddShift] = useState(false)
    let [showShiftPreference, setShowShiftPreference] = useState(false)

    //removes time zone from django datestring so it can be read by html input field
    let removeTimeZone = (dateString) => {
        return dateString.slice(0, dateString.length - 6)
    }

    //only set user group and period state when userGroups state in store is populated
    useEffect(() => {
        //set user group
        setUserGroup({...userGroups[group_id]})


    }, [userGroups, props.match.params.group_id])

    useEffect(()=>{
        if(userGroup&&userGroup.id==group_id){

            //set period. must trim period and shift times. sort user preferences by submitted at time.
            for(let i=0;i < userGroups[group_id].periods.length; i ++ ){

                //loop through list of periods and set period for this page
                if(userGroups[group_id].periods[i].id==period_id){

                    let tempPeriod = {...userGroups[group_id].periods[i]}

                    //trim period
                    tempPeriod.period_start = removeTimeZone(tempPeriod.period_start)
                    tempPeriod.period_end = removeTimeZone(tempPeriod.period_end)

                    let tempShiftSet = []

                    //trim shifts
                    tempPeriod.shift_set.forEach((item)=>{
                        let tempShiftStart = removeTimeZone(item.shift_start)
                        let tempShiftEnd = removeTimeZone(item.shift_end)

                        item.users = item.users.map((item)=>item.id ? item.id : item)

                        tempShiftSet.push({...item, shift_start: tempShiftStart, shift_end: tempShiftEnd})
                    })

                    //sort shifts
                    tempShiftSet.sort((a,b)=>{
                        if (moment(a.shift_start).isBefore(b.shift_start)) return -1
                        if (moment(b.shift_start).isBefore(a.shift_start)) return 1
                        return 0

                    })

                    tempPeriod.shift_set = tempShiftSet

                    setPeriod(tempPeriod)
                    break
                }
            }


            //set group members object {user_id: username} so they're more easily accessible
            //same for username obj {username: user_id}
            let tempGroupMembers = {}
            let tempGroupMembersUsername = {}
            for(let i = 0; i < userGroups[group_id].members.length ; i ++) {
                tempGroupMembers[userGroups[group_id].members[i].id] = userGroups[group_id].members[i].username

                tempGroupMembersUsername[userGroups[group_id].members[i].username] = userGroups[group_id].members[i].id


            }

            setGroupMembers(tempGroupMembers)
            setGroupMembersByUsername(tempGroupMembersUsername)
        }

    }, [userGroup])


    function addShiftClickHandler(newVals){

        newVals['period'] = parseInt(period_id)

        setPeriod((prevState)=>{
            let newTempState = {...prevState}

            newTempState.shift_set.push(newVals)
            newTempState.shift_set.sort((a,b)=>{
                        if (moment(a.shift_start).isBefore(b.shift_start)) return -1
                        if (moment(b.shift_start).isBefore(a.shift_start)) return 1
                        return 0

                    })

            return newTempState
        })

    }

    function deletePeriodClickHandler(){

        deletePeriod(token, period_id, group_id)
        history.push(`/groups/${group_id}/`)

    }

    //alter "published" value depending on whether it's a save, save&publish or save&republish
    function savePeriodClickHandler(publishAction){

        let periodUpdateReqBody = {
            id: parseInt(period_id),
            period_start: period.period_start,
            period_end: period.period_end
        }

        let shiftsToUpdate = []
        let shiftsToAdd = []

        period.shift_set.forEach((item)=>{
            if(item.id!==undefined){
                shiftsToUpdate.push(item)
            } else {
                shiftsToAdd.push(item)
            }
        })

        let shiftsToDelete = deletedShifts.map((item)=>item.id)

        if(publishAction){
            periodUpdateReqBody['published'] = true
        } else {
            periodUpdateReqBody['published'] = period.published
        }

        //redux thunk
        updatePeriod(token, periodUpdateReqBody, shiftsToUpdate, shiftsToDelete, shiftsToAdd)

        history.push(`/groups/${group_id}`)




    }

    //on change handler for period start
    function onPeriodStartChangeHandler(e){
        let newPeriodStart = e.target.value
        setPeriod((prevState)=>({...prevState, period_start: newPeriodStart}))
    }

    //on change handler for period end
    function onPeriodEndChangeHandler(e){
        let newPeriodEnd = e.target.value
        setPeriod((prevState)=>({...prevState, period_end: newPeriodEnd}))
    }

    //on change handler for all shifts shift_start, shift_end and workers_required fields.
    function shiftChangeHandler(index, fieldChanged, newValue){

        if(fieldChanged!=="workers"){

            setPeriod((prevState)=>{
                let newTempState={...prevState}
                newTempState.shift_set[index][fieldChanged] = newValue
                return newTempState
            })
        } else {
            setPeriod((prevState)=>{
                let newTempState={...prevState}
                newTempState.shift_set[index]['users'] = newValue.map((item)=>groupMembersByUsername[item])

                return newTempState
            })
        }
    }


    function shiftDeleteHandler(index){
        let shiftToDelete = period.shift_set[index]


        if(shiftToDelete.id!==undefined){

            setDeletedShifts(prevState => [...prevState, shiftToDelete])
        }



        setPeriod((prevState)=>{
            let newState = { ...prevState }
            newState.shift_set.splice(index, 1)
            return newState
        })

    }

    function automaticShiftAssign(){

        let newShiftSet = assignShifts(groupMembers, period.userpreference_set, period.shift_set)

        setPeriod((prevState)=>({...prevState, shift_set:newShiftSet}))
    }



    if (Object.keys(userGroup).length > 0){

        if(userGroup.is_admin){

            return (<div className="edit-period-page">
                    <ShiftPreferenceModal show={showShiftPreference} onHideFunction={()=>{setShowShiftPreference(false)}} memberPreference={period.userpreference_set} groupMembers={groupMembers} />

                    <AddShiftModal show={showAddShift} onHideFunction={()=>{setShowAddShift(false)}} addShiftFunction={addShiftClickHandler} period_id={period.id} groupMembers={groupMembers} groupMembersByUsername={groupMembersByUsername}/>


                        <h2>Edit Period for {userGroups[group_id].name}</h2>

                        <div>

                        <table style={{width: '40%', minWidth: '400px'}}>
                            <tbody>
                            <tr>
                                <td>Start Date:</td>

                                <td><input type="datetime-local" onChange={onPeriodStartChangeHandler} value={period.period_start}/></td>
                            </tr>
                            <tr>
                                <td>End Date:</td>

                                <td><input type="datetime-local" onChange={onPeriodEndChangeHandler} value={period.period_end} /></td>
                            </tr>

                            </tbody>
                        </table>

                        </div>

                        <div className="edit-shift-header">
                        <div className="edit-shift-header-left">
                        <h4>Edit Shifts </h4>
                        <div onClick={()=>{setShowAddShift(true)}} className="add-shift-button"><BiPlus size={23}/></div>
                        </div>

                        <div className="auto-assign-div">
                        <button onClick={automaticShiftAssign}>Automatically assign shifts</button>
                        </div>

                        </div>


                        <div>


                            {/*Open Modal*/}
                            <div onClick={()=>{setShowShiftPreference(true)}} className="view-preference">View member's shift preferences</div>


                            <div>

                            <table className="shift-table">
                                <thead>
                                    <tr>
                                    <th>Shift start</th>
                                    <th>Shift end</th>
                                    <th>Workers Required</th>
                                    <th>Workers</th>
                                    </tr>
                                </thead>
                            {period.shift_set.map((item, index)=>{
                                return <SingleShiftInput shiftInfo={item} groupMembers={groupMembers} shiftOnChangeHandler={shiftChangeHandler} deleteShiftHandler={shiftDeleteHandler} index={index} key={index} setPeriod={setPeriod}/>
                            })}
                            </table>

                            </div>

                        </div>

                        <div className="publish-save-div">
                            {period.published ? <button type="button" onClick={()=>{savePeriodClickHandler(false)}}>Save & Republish</button> :
                                <div><button type="button" onClick={()=>{savePeriodClickHandler(false)}}>Save</button><button type="button" onClick={()=>{savePeriodClickHandler(true)}}>Save & Publish</button></div>}
                        </div>

                        <div className="delete-period-div">
                            <h4>Delete Period</h4>

                            {/*To add - open modal to confirm*/}
                            <button onClick={deletePeriodClickHandler}>Delete</button>

                        </div>

                </div>)

        } else {
            return "Only an admin can make edits."
        }
    } else {
        return "Loading..."
    }



}

const mapStateToProps = (state) => {
    return {
        userGroups: state.appActions.userGroups
    }

}

export default withRouter(connect(mapStateToProps, { deletePeriod, updatePeriod })(SinglePeriodEdit))