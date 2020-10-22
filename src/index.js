import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import { Provider } from "react-redux"
import { composeWithDevTools } from "redux-devtools-extension"

import rootReducer from './redux/reducers'

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
    )

const rootElement = document.getElementById('root')

ReactDOM.render(<Provider store={store}>
                    <Router>
                        < App />
                    </Router>
                </Provider>
                , rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();