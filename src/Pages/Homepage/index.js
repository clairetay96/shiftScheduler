import React from 'react'
import { connect } from 'react-redux'
import { logInAPI, logOutAPI } from '../../redux/action-creators'


const Homepage = ({ logInAPI, logOutAPI, loggedIn })=>{

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

    const onLoginHandler = (event) => {
        event.preventDefault()

        let requestBody = {
            email: event.target.Email.value,
            password: event.target.Password.value
        }

        logInAPI(requestBody)
        console.log(loggedIn)

    }

    const logout = () => {
        logOutAPI()
        console.log(loggedIn)
    }


    return (<div>
                This is the homepage.
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

                Login
                <div>
                    <form onSubmit={onLoginHandler}>
                        Email:
                        <input type="text" name="Email"/>
                        Password:
                        <input type="text" name="Password"/>
                        <input type="submit" />
                    </form>
                </div>

                <button type="button" onClick={logout}>Logout</button>


            </div>)
}

const mapStateToProps = (state)=>({
    loggedIn: state.actions.loggedIn
})


export default connect(mapStateToProps, { logInAPI, logOutAPI })(Homepage)