const actions = (
    state = {
        loggedIn: false
    },
    action
    ) => {
    switch (action.type){
        case "LOG_IN":
            console.log("in log in action type")
            return {...state, loggedIn: true}
        case "LOG_OUT":
            return {...state, loggedIn: false}

        default:
            return state

    }

}




export default actions