const appActions = (
    state = {
        userGroups: [],
        userShifts: [],
        userNotifs: []
    }, action
    ) => {
    switch(action.type){
        case "GET_GROUPS":
            return {...state, userGroups: action.groups}

        case "GET_SHIFTS":
            return state

        case "GET_NOTIFS":
            return state

        default:
            return state


    }
}

export default appActions