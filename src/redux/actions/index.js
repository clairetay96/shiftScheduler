import { LOG_IN, LOG_OUT, GET_GROUPS, GET_SHIFTS, GET_NOTIFS, CREATE_GROUP, UPDATE_GROUP } from '../constants/ActionTypes'

export const logIn = () => {
    return {type: LOG_IN}
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