import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { logInAPI } from '../../redux/action-creators'


const LogInPage = ({ logInAPI }) => {
    let history = useHistory()

    const onLoginHandler = (event) => {
        event.preventDefault()

        let requestBody = {
            username: event.target.Username.value,
            password: event.target.Password.value
        }

        logInAPI(requestBody)
            .then(res => {
                 history.push("/")
            })


    }
    return <div>
                Login
                <div>
                    <form onSubmit={onLoginHandler}>
                        Username:
                        <input type="text" name="Username"/>
                        Password:
                        <input type="text" name="Password"/>
                        <input type="submit" />
                    </form>
                </div>
            </div>

}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn
})

export default connect(mapStateToProps, { logInAPI })(LogInPage)