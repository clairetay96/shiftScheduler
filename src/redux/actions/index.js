import { LOG_IN, LOG_OUT, GET_GROUPS, GET_SHIFTS, GET_NOTIFS } from '../constants/ActionTypes'

export const logIn = () => {
    return {type: LOG_IN}
}

export const logOut = () => {
    return {type: LOG_OUT}
}

export const getGroups = (allGroups) => {
    return {type: GET_GROUPS, groups: allGroups}
}