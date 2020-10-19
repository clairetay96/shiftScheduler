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