import React from 'react'
import { connect } from 'react-redux'
import { logOutAPI } from '../../redux/action-creators'
import { Switch, Route, Link, withRouter, useHistory } from "react-router-dom";
import './index.css'

function NavBar({ loggedIn, logOutAPI }){
    let history = useHistory()

    const logout = () => {

        //clears cookies and should also blacklist jwt
        logOutAPI()
            .then(res => {
                history.push("/")
            })

    }

    if(loggedIn){
        return (<div className="nav-bar nav-logged-in">
                    <div>
                       <Link to="/"> Home</Link> | <Link to="/groups">Groups</Link>
                    </div>
                    <div>
                        <div className="logout" onClick={logout}>Logout</div>
                    </div>

                </div>)
    }
    return (<div className="nav-bar nav-logged-out">
                <div className="login-signup">
                <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
                </div>
            </div>)

}

const mapStateToProps = (state) => ({
    loggedIn: state.authActions.loggedIn
})

export default withRouter(connect(mapStateToProps, { logOutAPI })(NavBar))