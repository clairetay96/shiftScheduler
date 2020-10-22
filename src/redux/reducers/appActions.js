const appActions = (
    state = {
        userGroups: {},
        userShifts: [],
        userPreferences: [],
        userNotifs: [],
    }, action
    ) => {

    switch(action.type){
        case "GET_GROUPS":
            return {...state, userGroups: action.groups}

        case "CREATE_GROUP":
            let newUserGroups = {...state.userGroups}
            newUserGroups[action.newGroup.id] = action.newGroup
            return {...state, userGroups: newUserGroups}

        case "UPDATE_GROUP":

            let updateGroups = {...state.userGroups}
            updateGroups[action.updateData.id] = action.updateData
            return {...state, userGroups: updateGroups}

        case "DELETE_GROUP":
            let updateGroups0 = {...state.userGroups}
            delete updateGroups0[action.group_id]
            return {...state, userGroups: updateGroups0}

        case "ADD_PERIOD":
            let updateGroups1 = { ...state.userGroups}
            updateGroups1[action.newPeriod.work_group].periods.push(action.newPeriod)
            return {...state, userGroups: updateGroups1}

        case "UPDATE_PERIOD":
            let updateGroups4 = {...state.userGroups}

            let groupPeriod = updateGroups4[action.updatedPeriod.work_group].periods

            for(let i=0;i<groupPeriod.length; i++){
                if(groupPeriod[i].id==action.updatedPeriod.id){
                    updateGroups4[action.updatedPeriod.work_group].periods[i] = {...updateGroups4[action.updatedPeriod.work_group].periods[i],...action.updatedPeriod}

                }
            }

            return {...state, userGroups: updateGroups4}

        case "DELETE_PERIOD":

            let updateGroups3 = {...state.userGroups}
            let required_periods1 = updateGroups3[action.periodData.group_id].periods
            let spliceIndex;

            for(let i=0; i < required_periods1.length ; i ++) {
                if (required_periods1[i].id == action.periodData.period_id){
                    spliceIndex = i
                    break
                }
            }

            if(spliceIndex!==undefined){
                updateGroups3[action.periodData.group_id].periods.splice(spliceIndex, 1)
            }
            return {...state, userGroups: updateGroups3}

        case "GET_PREFERENCES":
            return state

        case "UPDATE_PREFERENCE":

            let updateGroups2 = {...state.userGroups}
            let required_periods = updateGroups2[action.periodData.group_id].periods

            for(let i=0; i < required_periods.length ; i ++) {
                if (required_periods[i].id == action.periodData.period_id){
                    updateGroups2[action.periodData.group_id].periods[i].preference_submitted = true


                    if(action.periodData.pref_id){
                        //loop through user preferences to find match
                        for(let j=0;j<updateGroups2[action.periodData.group_id].periods[i].userpreference_set.length;j++){
                            if(updateGroups2[action.periodData.group_id].periods[i].userpreference_set[j].id==action.periodData.pref_id){
                                updateGroups2[action.periodData.group_id].periods[i].userpreference_set[j] = action.periodData.new_preference
                            }
                        }


                    } else {
                        //push new preference in
                        updateGroups2[action.periodData.group_id].periods[i].userpreference_set.push(action.periodData.new_preference)
                    }
                    break
                }
            }

            return {...state, userGroups: updateGroups2}

        case "GET_SHIFTS":
            return {...state, userShifts: action.allShifts }

        case "GET_NOTIFS":
            return state

        case "LOG_OUT":
            return {
                userGroups: {},
                userShifts: [],
                userNotifs: [],
                userPreferences: []
            }

        default:
            return state


    }
}

export default appActions