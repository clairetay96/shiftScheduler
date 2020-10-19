import React, { useState } from 'react'
import { withRouter, Link, useHistory } from "react-router-dom";
import { connect } from 'react-redux'
import AddMember from '../../Components/AddMember'
import SingleMember from '../../Components/SingleMember'
import SinglePeriodRow from '../../Components/SinglePeriodRow'
import { deleteGroup } from '../../redux/action-creators'

import Cookies from 'js-cookie'

const SingleGroup = ({ userGroups, deleteGroup, ...props }) => {
    let history = useHistory()

    //modal functionality - show vs hide
    let [show, setShow] = useState(false)

    const hideAddMember = () => {
        setShow(false)
    }

    const showAddMember = () => {
        setShow(true)
    }

    //get periods and related shifts of group. add to redux store - redux thunk


    //deleteGroup functionality - redux thunk

    function deleteGroupOnClick(){
        deleteGroup(Cookies.get('csrftoken'), props.match.params.id)
        history.push("/groups/")

    }



    if(userGroups[props.match.params.id]){
        return <div>
                <h1>{userGroups[props.match.params.id].name}</h1>
                {userGroups[props.match.params.id].is_admin ?
                    <div>
                        <button onClick={deleteGroupOnClick}>Delete Group</button>
                    </div> : null
                }
                <div>

                    {userGroups[props.match.params.id].is_admin ?
                        <div>
                        <div onClick={showAddMember}>Add member</div>
                    <AddMember show={show} hideAddMember={hideAddMember} groupID={props.match.params.id} />

                    </div>:
                    null}
                </div>

                {userGroups[props.match.params.id].is_admin ?
                    <div>
                        <Link to={`/groups/${props.match.params.id}/periods/new`}> Add Period </Link>
                    </div> :

                    null }

                <div>
                <h3>Periods</h3>
                {userGroups[props.match.params.id].periods.map((item, index)=>{
                    if(item){
                         return <div key={index}><SinglePeriodRow period_info={item} is_admin={userGroups[props.match.params.id].is_admin}/></div>
                     }
                 })}

                </div>


                <div>

                <h3>Members</h3>
                {userGroups[props.match.params.id].members.map((item, index)=>{
                    if(item){
                         return <div key={index}><SingleMember username={item.username} userID={item.id} userIsAdmin={userGroups[props.match.params.id].admins.filter(adminItem=>adminItem.id===item.id)} isAdmin={userGroups[props.match.params.id].is_admin} groupID={props.match.params.id} /></div>

                    }



                })}
                </div>

        </div>

    } else {
        return "Loading..."
    }

}

const mapStateToProps = (state)=>({
    userGroups: state.appActions.userGroups
})

export default withRouter(connect(mapStateToProps, { deleteGroup })(SingleGroup))