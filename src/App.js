import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Homepage from './Pages/Homepage'
import Groups from './Pages/Groups'
import NavBar from './Components/NavBar'

import './App.css';

function App() {
  return (
    <div>

      {/*should change based on logged in state*/}
      <NavBar />

      <Router>
          <Switch>

            {/*should be protected*/}
            <Route path="/groups">
                <Groups />
            </Route>

            {/*Conditional - show different for logged in users vs non logged in*/}
            <Route path="/">
                <Homepage />
            </Route>

          </Switch>
      </Router>
    </div>
  );
}

export default App;