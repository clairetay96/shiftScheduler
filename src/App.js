import React from 'react';
import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Homepage from './Pages/Homepage'
import './App.css';

function App() {
  return (
    <div>
      <Router>
          <Switch>
            <Route path="/">
                <Homepage />
            </Route>

          </Switch>
      </Router>
    </div>
  );
}

export default App;