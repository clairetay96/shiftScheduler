import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import SingleGroup from '../SingleGroup'
import { Switch, Route, Link, withRouter } from "react-router-dom";
import Cookies from 'js-cookie'

import { getUserGroups } from '../../redux/action-creators'


function Groups({ loggedIn, userGroups, getUserGroups}){

    useEffect(()=>{
        if (userGroups.length===0){
            getUserGroups()
        }

    }, [])

    //make a new group
    function makeNewGroup(event) {
        event.preventDefault()

        let URL = "/api/groups/"
        let requestBody = {
            name: event.target.groupName.value,
            members: [event.target.member.value]
        }

        fetch(URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                'X-CSRFToken': Cookies.get('csrftoken')
             },
            body: JSON.stringify(requestBody)
        })
            .then(res=>res.json())
            .then(res=>console.log(res))
            .catch(err=>console.log("help"))
    }


    return (<div>

                <Switch>
                    <Route path="/groups/new/">
                        <form onSubmit={makeNewGroup}>
                            Make a New Group!
                            Name: <input type="text" name="groupName" />
                            Members: <input type="integer" name="member"/>
                            <input type="submit" />

                        </form>
                    </Route>

                    <Route path="/groups/:id">
                        <SingleGroup />
                    </Route>

                    <Route path="/groups/">
                        This is groups
                        <div><Link to="/groups/new/">Add a new group</Link></div>
                        {userGroups.map((item, index)=>{
                            return <div key={index}>{item.name}</div>
                        })}
                    </Route>
                </Switch>

            </div>)
}


const mapStateToProps = (state) => ({
    loggedIn: state.authActions.loggedIn,
    userGroups: state.appActions.userGroups
})


export default withRouter(connect(mapStateToProps, { getUserGroups })(Groups))