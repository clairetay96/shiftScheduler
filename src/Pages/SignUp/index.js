import React from 'react'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { signUpAPI } from '../../redux/action-creators'
import './index.css'


const SignUpPage = ({ loggedIn, signUpAPI }) => {
    let history = useHistory()

    function onSubmitHandler(event){
        event.preventDefault()
        let requestBody = {
                email: event.target.Email.value,
                username: event.target.Username.value,
                password1: event.target.Password1.value,
                password2: event.target.Password2.value
            }

        signUpAPI(requestBody)
            .then(res => {
                history.push("/")
            })

    }


    return <div>
                <h3>Sign up</h3>
                <div>Already have an account? <Link to="/login">Log in</Link>.</div>
                <div>
                    <form onSubmit={onSubmitHandler} className="signup-form">
                        <input type="text" name="Email" placeholder="Email"/>
                        <input type="text" name="Username" placeholder="Username"/>
                        <input type="password" name="Password1" placeholder="Password"/>
                        <input type="password" name="Password2" placeholder="Confirm password"/>
                        <input type="submit" />
                    </form>
                </div>
            </div>

}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn
})

export default connect(mapStateToProps, {signUpAPI})(SignUpPage)