import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'


const SignUpPage = ({ loggedIn }) => {
    let history = useHistory()

    function onSubmitHandler(event){
        event.preventDefault()
        let signUpURL = "/api/rest-auth/registration/"

        fetch(signUpURL, {
            method:"POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: event.target.Email.value,
                first_name: event.target.FirstName.value,
                last_name: event.target.LastName.value,
                username: event.target.Username.value,
                password1: event.target.Password1.value,
                password2: event.target.Password2.value
            })

        })
            .then(res => {
                if(res.status!==200){
                    return res
                } else {
                    console.log("All good")
                    return null
                }
            })
            .then(res => {
                if(res!==null){
                    console.log(res.statusText, res)
                }
            })
            .catch(err => console.log(err.message))

    }


    return <div>
                Sign up
                <div>
                    <form onSubmit={onSubmitHandler}>
                        Email:
                        <input type="text" name="Email"/>
                        First Name:
                        <input type="text" name="FirstName"/>
                        Last Name:
                        <input type="text" name="LastName"/>
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

export default connect(mapStateToProps)(SignUpPage)