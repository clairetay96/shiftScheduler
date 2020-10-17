import { logIn, logOut, getGroups } from '../actions'
import Cookies from 'js-cookie'

export const logInAPI = (requestBody) => {

    return async (dispatch)=>{
        try {

            let logInURL = "/api/rest-auth/login/"
            //log in
            let logInReq = await fetch(logInURL, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                })

                if(logInReq.status===200){
                    //set jwt
                    dispatch(logIn())
                    console.log("logged in")
                } else {
                    console.log(logInReq.statusText, logInReq.status, logInReq)
                }

        } catch (err) {
            console.log(err, "error in logInAPI")
        }


    }


}

export const logOutAPI = () => {
    return async(dispatch)=>{
        try {
            let logoutURL = "/api/test/logout/"
            fetch(logoutURL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            })
                .then(res=>{
                    dispatch(logOut())
                    console.log("Logged out")

                })
                .catch(err=>{
                    console.log("logout error.")
                })

        } catch (err) {
            console.log(err, "Error in logoutAPI")
        }
    }

}

export const getUserGroups = () => {
    return async (dispatch) => {
        try {

            let groupsURL = "/api/groups/"
            let userGroupReq = await fetch(groupsURL)
                                .then(res => {
                                    return res.json()
                                })
            dispatch(getGroups(userGroupReq))



        } catch (err) {
            console.log(err, "Error in getting user groups")
        }
    }
}


export const openAppValidate = () => {
    return async (dispatch) => {
        let validateURL = "/api/on-app-open-validate"
        let validity = await fetch(validateURL)
            .then(res => res.text())

        if(validity==="true"){
            dispatch(logIn())
            getUserGroups()(dispatch)
        } else {
            return
        }
    }
}