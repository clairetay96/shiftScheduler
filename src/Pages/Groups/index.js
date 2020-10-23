import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import SingleGroup from '../SingleGroup'
import AddGroup from '../../Components/AddGroup'
import AddPeriod from '../AddPeriod'
import SinglePeriod from '../SinglePeriod'
import SinglePeriodEdit from '../SinglePeriodEdit'
import { BiPlus } from 'react-icons/bi'

import './index.css'

import { Switch, Route, Link, withRouter } from "react-router-dom";


import { getUserGroups } from '../../redux/action-creators'



function Groups({ loggedIn, userGroups, getUserGroups }){
    let [userGroupsState, setUserGroupsState] = useState([])

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

    useEffect(()=> {
        if(Object.keys(userGroups).length > 0) {
            let tempUserGroupsState = [...Object.values(userGroups)]
            tempUserGroupsState.sort((a, b)=>{
                if (a.name < b.name){
                    return -1
                } else if (a.name > b.name){
                    return 1
                }
                return 0
            })

            setUserGroupsState(tempUserGroupsState)

        }

    }, [userGroups])




    return (<div className="groups-page">
                <Switch>

                    <Route path="/groups/:id/periods/new">
                        <AddPeriod />
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

                        <div className="groups-page-header">
                        <h3>Your Groups</h3>
                        <AddGroup show={show} hideAddGroup={hideAddGroup}/>
                        {loggedIn && <div onClick={showAddGroup} className="add-group"><BiPlus size={25}/></div>}
                        </div>

                        <div className="groups-list">
                        {userGroupsState.map((item, index)=>{
                            return <Link to={"/groups/"+item.id} key={index}><div>{item.name}</div></Link>
                        })}
                        </div>
                    </Route>

                </Switch>
            </div>)
}


const mapStateToProps = (state) => ({
    loggedIn: state.authActions.loggedIn,
    userGroups: state.appActions.userGroups
})


export default withRouter(connect(mapStateToProps, { getUserGroups })(Groups))