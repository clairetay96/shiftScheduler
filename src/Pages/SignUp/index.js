import React, { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { signUpAPI } from '../../redux/action-creators'
import './index.css'


const SignUpPage = ({ loggedIn, signUpAPI }) => {
    let history = useHistory()
    let [message, setMessage] = useState("")

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
                if(res){
                    history.push("/")
                    console.log(res)
                    localStorage.setItem('userID', res.user.id)
                    localStorage.setItem('username', res.user.username)
                    localStorage.setItem('loggedIn', true)
                } else {
                    setMessage("Invalid input. Please try again.")
                }

            })

    }


    return <div className="signup-page">
                <div className="signup-card">
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
                    {message}
                </div>
                </div>
            </div>

}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn
})

export default connect(mapStateToProps, {signUpAPI})(SignUpPage)