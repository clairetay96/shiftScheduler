import { combineReducers } from 'redux'
import authActions from "./authActions"
import appActions from "./appActions"


export default combineReducers({
    authActions,
    appActions
})