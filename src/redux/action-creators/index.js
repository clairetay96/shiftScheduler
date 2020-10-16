import { logIn, logOut } from '../actions'

export const logInAPI = (requestBody) => {

    return async (dispatch)=>{
        try {

            let logInURL = "/api/rest-auth/login/"

            let logInReq = await fetch(logInURL, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                })

                if(logInReq.status==200){
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
            let logoutURL = "/api/rest-auth/logout/"
            fetch(logoutURL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
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