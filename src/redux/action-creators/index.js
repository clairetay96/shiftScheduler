import { logIn, logOut, getGroups, createGroup, updateGroupDispatch, deleteGroupDispatch, createPeriodDispatch,updatePeriodDispatch, deletePeriodDispatch, getShifts, updatePreferenceSubmitted } from '../actions'
import Cookies from 'js-cookie'



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
            let signUpRequest = await fetch(signUpURL, {
                method:"POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })
                .then(res => {
                    if(res.status!==201){
                        return null
                    } else {
                        return res.json()
                    }
                })
                .then(res => {
                    if(res){

                        dispatch(logIn(res.user))
                    }
                    return res
                })
                .catch(err => console.log(err.message))

            return signUpRequest

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

export const getUserShifts = () => {
    return async (dispatch) => {
        try {

            let getShiftsURL = "/api/shifts/"
            fetch(getShiftsURL)
                .then(res=> {
                    if(res.ok){
                        return res.json()
                    } else {
                        console.log(res)
                        return null
                    }
                })
                .then(res => {
                    dispatch(getShifts(res))

                })
                .catch(err => {
                    console.log(err, "---error in fetch req for getting shifts")
                })

        } catch (err){
            console.log(err, "---error in getting user shifts action-creators")
        }
    }
}


export const openAppValidate = () => {
    return async (dispatch) => {
        let validateURL = "/api/on-app-open-validate"
        let validity = await fetch(validateURL)
            .then(res => res.json())

        if(validity.loggedIn){
            dispatch(logIn(validity))
            getUserGroups()(dispatch)
            getUserShifts()(dispatch)
        } else {
            return
        }
    }
}

export const createNewGroup = (token, requestBody) => {
    return async (dispatch) => {

        try {
            let newGroupURL = "/api/groups/"

            let newGroup = await fetch(newGroupURL, {
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

                    dispatch(createGroup(res))
                    return res
                })
                .catch(err=>console.log(err, "help"))

            return newGroup


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

            let deleteGroupURL = "/api/groups/"+group_id+"/"
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

export const updatePeriod = (token, periodEdit, shiftEdit, shiftDel, shiftAdd) => {
    return async (dispatch) =>{
        try {

            let shiftUpdates = []
            //edit shifts
            shiftEdit.forEach((item)=>{

                let shiftReqOptions = {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'X-CSRFToken': token
                    },
                    body: JSON.stringify(item)
                }

                let requestURL = `/api/shifts/${item.id}/`


                let editShiftReq = fetch(requestURL, shiftReqOptions)
                shiftUpdates.push(editShiftReq)
            })

            //delete shifts
            shiftDel.forEach((item)=>{

                let shiftReqOptions = {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'X-CSRFToken': token
                    }
                }

                let requestURL = `/api/shifts/${item.id}/`

                let delShiftReq = fetch(requestURL, shiftReqOptions)
                shiftUpdates.push(delShiftReq)
            })

            //add shifts
            shiftAdd.forEach((item)=>{

                let shiftReqOptions = {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'X-CSRFToken': token
                    },
                    body: JSON.stringify(item)

                }

                let requestURL = `/api/shifts/`
                let addShiftReq = fetch(requestURL, shiftReqOptions)
                shiftUpdates.push(addShiftReq)
            })

            //then update period

            Promise.all(shiftUpdates)
                .then(res=> {
                    let updatePeriodURL = `/api/periods/${periodEdit.id}/`
                    let periodRequestOptions = {
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            'X-CSRFToken': token
                        },
                        body: JSON.stringify(periodEdit)
                    }

                    return fetch(updatePeriodURL, periodRequestOptions)

                })
                .then(res=>{
                    if(res.ok){
                        return res.json()
                    } else {
                        return null
                    }
                })
                .then(res=>{
                    if(res){
                        console.log(res, "inside update period action creator")
                        dispatch(updatePeriodDispatch(res))
                    }
                })
                .catch(err => {
                    console.log(err, "Error in updating period.")
                })


        } catch (err) {
            console.log(err, "Error in updating period in action creators.")
        }
    }
}

export const deletePeriod = (token, period_id, group_id) => {
    return async (dispatch) => {
        try {

            let deletePeriodURL = `/api/periods/${period_id}/`

            let requestOptions = {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    'X-CSRFToken': token
                }
            }

            let deleteRequest = await fetch(deletePeriodURL, requestOptions)
                    .catch(err=>{
                        console.log(err, "Error in delete fetch request")
                    })

            if(deleteRequest.ok){
                dispatch(deletePeriodDispatch({period_id, group_id}))
            } else {
                console.log(deleteRequest, "some error in delete request")
            }




        } catch (err) {
            console.log(err, "Error in delete period action-creators")
        }
    }
}

export const addPreference = (token, requestBody, group_id, pref_id) => {

    return async (dispatch) => {
        try {
            let addPrefURL;
            let requestOptions;

            if(pref_id){
                addPrefURL = `/api/userpreferences/${pref_id}/`
                requestOptions = {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'X-CSRFToken': token
                    },
                    body: JSON.stringify(requestBody)
                }

            } else {

                addPrefURL = `/api/groups/${group_id}/periods/${requestBody.period}/indiv-preferences/`
                requestOptions = {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'X-CSRFToken': token
                    },
                    body: JSON.stringify(requestBody)
                }

            }



            fetch(addPrefURL, requestOptions)
                .then(res=>{
                    if(res.ok){
                        return res.json()
                    } else {
                        console.log(res)
                        return null
                    }
                })
                .then(res=>{
                    if(res){
                        dispatch(updatePreferenceSubmitted({period_id: requestBody.period, group_id, pref_id, new_preference: res}))
                    }
                })
                .catch(err=>{
                    console.log(err, "error in adding user preference fetch req")
                })



        } catch (err) {
            console.log(err, "error in adding user preference async func")
        }
    }

}

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
                    let userCred = await logInReq.json()

                    dispatch(logIn(userCred.user))
                    getUserGroups()(dispatch)
                    getUserShifts()(dispatch)

                    return true

                } else {
                    console.log(logInReq.statusText, logInReq.status, logInReq)

                    return false
                }


        } catch (err) {
            console.log(err, "error in logInAPI")
        }
    }
}