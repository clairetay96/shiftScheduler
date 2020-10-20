import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SingleGroup from '../SingleGroup'
import AddGroup from '../../Components/AddGroup'
import AddPeriod from '../AddPeriod'
import SinglePeriod from '../SinglePeriod'
import SinglePeriodEdit from '../SinglePeriodEdit'

import { Switch, Route, Link, withRouter } from "react-router-dom";


import { getUserGroups } from '../../redux/action-creators'



function Groups({ loggedIn, userGroups, getUserGroups }){

    //modal functionality - show vs hide
    let [show, setShow] = useState(false)

    const hideAddGroup = () => {
        setShow(false)
    }

    const showAddGroup = () => {
        setShow(true)
    }

    //if userGroups in redux store is not populated, fetch group data on component load.
    useEffect(()=>{
        if (Object.keys(userGroups).length===0){
            getUserGroups()
        }
    }, [])




    return (<div>
                <Switch>

                    <Route path="/groups/:id/periods/new">
                        <AddPeriod />
                    </Route>

                    <Route path="/groups/:group_id/periods/:period_id/edit-preference">
                       {/*Update preference*/}
                    </Route>

                    <Route path="/groups/:group_id/periods/:period_id/edit">
                        <SinglePeriodEdit />
                    </Route>

                    {/*Either show assigned shifts or form to submit shift preferences, depending on whether or not the period has been published*/}
                    <Route path="/groups/:group_id/periods/:period_id">
                        <SinglePeriod />
                    </Route>

                    <Route path="/groups/:id">
                        <SingleGroup />
                    </Route>

                    <Route path="/groups/">
                        <h3>Your Groups</h3>

                        <AddGroup show={show} hideAddGroup={hideAddGroup}/>
                        <div onClick={showAddGroup}>Add a new group</div>

                        {Object.values(userGroups).map((item, index)=>{
                            return <div key={index}><Link to={"/groups/"+item.id}>{item.name}</Link></div>
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