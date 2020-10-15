import React from 'react'


const Homepage = ()=>{

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
        let logInURL = "/api/rest-auth/login/"
        let requestBody = {
            email: event.target.Email.value,
            username: event.target.Username.value,
            password: event.target.Password.value
        }

        fetch(logInURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        })
        .then(res=>{
            if(res.status!==200){
                console.log(res.statusText, res.status, res)
            } else {
                console.log("logged in")
            }
        })
    }

    const logout = () => {
        let logoutURL = "/api/rest-auth/logout/"
        fetch(logoutURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        })
            .then(res=>{
                console.log("Logged out")

            })
            .catch(err=>{
                console.log("logout error.")
            })

    }


    return (<div>
                This is the homepage.
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

                Login
                <div>
                    <form onSubmit={onLoginHandler}>
                        Email:
                        <input type="text" name="Email"/>
                        Username:
                        <input type="text" name="Username"/>
                        Password:
                        <input type="text" name="Password"/>
                        <input type="submit" />
                    </form>
                </div>

                <button type="button" onClick={logout}>Logout</button>


            </div>)
}

export default Homepage