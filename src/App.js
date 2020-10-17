import React, { useEffect } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {connect} from 'react-redux'


import Homepage from './Pages/Homepage'
import Groups from './Pages/Groups'
import SignUpPage from './Pages/SignUp'
import LogInPage from './Pages/Login'
import NavBar from './Components/NavBar'

import { openAppValidate } from './redux/action-creators'

import './App.css';

function App({openAppValidate}) {

    //check if cookies are set and if valid
    //populate redux store accordingly.

    useEffect(()=>{
        openAppValidate()
    }, [])


  return (
    <div>

      {/*should change based on logged in state*/}
      <NavBar />

  {/*leaves space for the Nav Bar since NavBar position is fixed.*/}
      <div className="spacer"></div>

      <Switch>

        {/*should be protected*/}
        <Route path="/groups">
            <Groups />
        </Route>

        <Route path="/login">
            <LogInPage />
        </Route>

        <Route path="/signup">
            <SignUpPage />
        </Route>

        {/*Conditional - show different for logged in users vs non logged in*/}
        <Route path="/">
            <Homepage />
        </Route>

      </Switch>

    </div>
  );
}

const mapStateToProps = (state) => ({
    loggedIn: state.authActions.loggedIn,
    userGroups: state.appActions.userGroups
})

export default connect(mapStateToProps, {openAppValidate})(App);