import React, { useState, useEffect } from 'react'
import DropdownButton from 'react-bootstrap/DropdownButton'
import { Dropdown } from 'react-bootstrap'
import { connect } from 'react-redux'
import { logOutAPI } from '../../redux/action-creators'
import { Switch, Route, Link, withRouter, useHistory } from "react-router-dom";
import './index.css'

import AddGroup from '../AddGroup'

function NavBar({ loggedIn, logOutAPI, username, userID, userGroups }){
    let history = useHistory()
    let [groupDropDown, setGroupDropDown] = useState(<DropdownButton title="Groups" onSelect={handleSelect}><Dropdown.Item eventKey="makeNew">Create new group...</Dropdown.Item></DropdownButton>)

    let [show, setShow] = useState(false)

    const logout = () => {

        //clears cookies and should also blacklist jwt
        logOutAPI()
            .then(res => {
                history.push("/")
            })

    }

    function handleSelect(event){
        if(event=="makeNew"){
            setShow(true)
        } else if (event=="allGroups"){
            history.push(`/groups/`)
        } else {
            history.push(`/groups/${event}`)
        }
    }

    const hideAddGroup = () => {
        setShow(false)
    }

    useEffect(()=>{

        if(Object.keys(userGroups).length > 0){
            let groupsHTML = Object.values(userGroups).map((item, index)=>{
                                    return <Dropdown.Item key={index} eventKey={item.id}>{item.name}</Dropdown.Item>

                                })

            setGroupDropDown(<DropdownButton title="Groups" onSelect={handleSelect}>
                                {groupsHTML}

                                <Dropdown.Divider />
                                <Dropdown.Item eventKey="allGroups">View all groups</Dropdown.Item>
                                <Dropdown.Item eventKey="makeNew">Create new group...</Dropdown.Item>
                                </DropdownButton>)

        }


    }, [userGroups, loggedIn])



    if(loggedIn){
        return (<div className="nav-bar nav-logged-in">
                    <div>
                    <AddGroup show={show} hideAddGroup={hideAddGroup}/>
                    </div>

                    <div className="left-aligned">
                    <div className="shifts">
                       <Link to="/">Home</Link>
                    </div>
                    <div>
                     {groupDropDown}
                    </div>
                    </div>

                    <div className="welcome-logout">
                        <div>Welcome, {username}.</div>
                        <div className="logout" onClick={logout}>Logout</div>
                    </div>

                </div>)
    }
    console.log(userGroups, loggedIn)
    return (<div className="nav-bar nav-logged-out">
                <div className="homepage-link">
                <Link to="/"><div className="shift-logo">DELEGO</div></Link>
                </div>
                <div className="login-signup">
                <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
                </div>
            </div>)

}

const mapStateToProps = (state) => ({
    loggedIn: state.authActions.loggedIn,
    username: state.authActions.username,
    userID: state.authActions.userID,
    userGroups: state.appActions.userGroups
})

export default withRouter(connect(mapStateToProps, { logOutAPI })(NavBar))