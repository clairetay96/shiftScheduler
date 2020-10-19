import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { signUpAPI } from '../../redux/action-creators'


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
                Sign up
                <div>
                    <form onSubmit={onSubmitHandler}>
                        Email:
                        <input type="text" name="Email"/>
                        Username:
                        <input type="text" name="Username"/>
                        Password:
                        <input type="text" name="Password1"/>
                        Confirm Password:
                        <input type="text" name="Password2"/>
                        <input type="submit" />
                    </form>
                </div>
            </div>

}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn
})

export default connect(mapStateToProps, {signUpAPI})(SignUpPage)