const authActions = (
    state = {
        loggedIn: false,
        username: "",
        userID: "",
    },
    action
    ) => {
    switch (action.type){
        case "LOG_IN":
            return {
                ...state,
                username: action.userCred.username,
                userID: action.userCred.id,
                loggedIn: true}
        case "LOG_OUT":
            return {
                username: "",
                userID: "",
                loggedIn: false}

        default:
            return state

    }

}




export default authActions