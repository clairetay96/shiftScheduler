import { LOG_IN, LOG_OUT, GET_GROUPS, GET_SHIFTS, GET_NOTIFS, CREATE_GROUP, UPDATE_GROUP, DELETE_GROUP, ADD_PERIOD, UPDATE_PERIOD, DELETE_PERIOD, UPDATE_PREFERENCE } from '../constants/ActionTypes'

export const logIn = (userCred) => {
    return {type: LOG_IN, userCred}
}

export const logOut = () => {
    return {type: LOG_OUT}
}

export const getGroups = (allGroups) => {
    return {type: GET_GROUPS, groups: allGroups}
}

export const createGroup = (newGroup) => {
    return {type: CREATE_GROUP, newGroup }
}

export const updateGroupDispatch = (updateData) => {
    return {type: UPDATE_GROUP, updateData}
}

export const deleteGroupDispatch = (group_id) => {
    return { type: DELETE_GROUP, group_id }
}


export const createPeriodDispatch = (newPeriod) => {
    return {type: ADD_PERIOD, newPeriod}
}

export const updatePeriodDispatch = (updatedPeriod) => {
    return {type: UPDATE_PERIOD, updatedPeriod}
}

export const deletePeriodDispatch = (periodData) => {
    return { type: DELETE_PERIOD, periodData }
}


export const getShifts = (allShifts) => {
    return {type: GET_SHIFTS, allShifts}

}

export const updatePreferenceSubmitted = (periodData) =>{
    return { type: UPDATE_PREFERENCE, periodData}
}