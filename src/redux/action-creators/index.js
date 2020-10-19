import { logIn, logOut, getGroups, createGroup, updateGroupDispatch, createPeriodDispatch, deleteGroupDispatch } from '../actions'
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

export const signUpAPI = (requestBody) => {
    return async (dispatch) => {
        try {
            let signUpURL = "/api/rest-auth/registration/"
            fetch(signUpURL, {
                method:"POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })
                .then(res => {
                    if(res.status!==201){
                        return res
                    } else {
                        console.log("All good")
                        dispatch(logIn())
                        return null
                    }
                })
                .then(res => {
                    if(res!==null){
                        console.log(res.statusText, res)
                    }
                })
                .catch(err => console.log(err.message))

        } catch (err) {
            console.log(err, "Err in signUpAPI")
        }
    }
}

export const getUserGroups = () => {
    return async (dispatch) => {
        try {

            let groupsURL = "/api/groups/"
            let userGroupReq = await fetch(groupsURL)
                                .then(res => res.json())
                                .then(res => {

                                    let groupsListObj = {}

                                    //convert list of returned groups into an object where the key is the id
                                    for(let i=0;i < res.length; i++){
                                        groupsListObj[res[i].id] = res[i]
                                    }
                                    return groupsListObj
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

export const createNewGroup = (token, requestBody) => {
    return async (dispatch) => {

        try {
            let newGroupURL = "/api/groups/"

            fetch(newGroupURL, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'X-CSRFToken': token
                 },
                body: JSON.stringify(requestBody)
            })
                .then(res=>res.json())
                .then(res=>{
                    console.log(res)
                    dispatch(createGroup(res))
                })
                .catch(err=>console.log(err, "help"))


        } catch (err) {
            console.log(err, "--err in createNewGroup")

        }

    }

}

export const updateGroup = (token, requestBody) => {
    return async (dispatch) => {
        try {
            let updateGroupURL = "/api/groups/" + requestBody.groupID + "/"
            let requestOptions = {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'X-CSRFToken': token
                },
                body: JSON.stringify(requestBody)
            }

            fetch(updateGroupURL, requestOptions)
                .then(res => {
                    if(res.status==200){
                        return res.json()
                    } else {
                        console.log(res.status, res.statusText)
                        return null
                    }
                })
                .then(res=>{
                    if(res!==null){
                        //dispatch update
                        dispatch(updateGroupDispatch(res))
                    }
                })
                .catch(err => {
                    console.log(err, "---error in updating group")

                })



        } catch (err){
            console.log(err, "----error in updating group dispatch")

        }

    }

}


export const deleteGroup = (token, group_id) => {
    return async (dispatch) => {
        try {

            let deleteGroupURL = "/api/groups/"+group_id
            let requestOptions = {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'X-CSRFToken': token
                }
            }

            fetch(deleteGroupURL, requestOptions)
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    dispatch(deleteGroupDispatch(group_id))

                })


        } catch (err) {
            console.log(err, "---error in deleting group")
        }
    }
}


export const addPeriodDispatch = (token, requestBody) => {
    return async (dispatch) => {
        try {
            let addPeriodURL = `/api/groups/${requestBody.work_group}/periods/`

            let requestOptions = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'X-CSRFToken': token
                },
                body: JSON.stringify(requestBody)
            }

            fetch(addPeriodURL, requestOptions)
                .then(res => {
                    if(res.ok){
                        return res.json()
                    } else {
                        console.log(res)
                        return null
                    }
                })
                .then(res => {
                    if(res){
                        dispatch(createPeriodDispatch(res))
                    }
                })
                .catch(err => {
                    console.log(err, "Error in adding period dispatch")
                })

        } catch (err) {
            console.log(err, "Error in adding period dispatch")
        }

    }
}