const appActions = (
    state = {
        userGroups: {},
        userShifts: [],
        userNotifs: []
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

        case "GET_SHIFTS":
            return state

        case "GET_NOTIFS":
            return state

        case "LOG_OUT":
            return {
                userGroups: {},
                userShifts: [],
                userNotifs: []
            }

        default:
            return state


    }
}

export default appActions