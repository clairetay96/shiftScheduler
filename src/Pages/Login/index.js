import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logInAPI } from '../../redux/action-creators'
import './index.css'


const LogInPage = ({ logInAPI }) => {
    let history = useHistory()
    let [message, setMessage] = useState("")


    const onLoginHandler = (event) => {
        event.preventDefault()

        let requestBody = {
            username: event.target.Username.value,
            password: event.target.Password.value
        }

        logInAPI(requestBody)
            .then(res => {
                if(res){
                 history.push("/")
                } else {
                    setMessage("Invalid login credentials.")
                }
            })


    }
    return <div className="login-page">
                <div className="login-card">
                <h3>Login</h3>
                <div>
                    Don't have an account yet? <Link to="/signup">Sign up</Link>.
                </div>
                <div>
                    <form onSubmit={onLoginHandler} className="login-form">
                        <input type="text" name="Username" placeholder="Username"/>
                        <input type="password" name="Password" placeholder="Password" />
                        <input type="submit" />
                    </form>
                    <div>
                    {message}
                    </div>
                </div>
                </div>

            </div>

}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn
})

export default connect(mapStateToProps, { logInAPI })(LogInPage)