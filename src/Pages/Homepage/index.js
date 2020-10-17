import React from 'react'
import { connect } from 'react-redux'
import { logInAPI, logOutAPI } from '../../redux/action-creators'


const Homepage = ({ loggedIn })=>{


    return (<div>
                This is the homepage.
            </div>)
}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn
})


export default connect(mapStateToProps, { logInAPI, logOutAPI })(Homepage)