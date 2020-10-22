import React from 'react'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import { updateGroup } from '../../redux/action-creators'
import './index.css'




function SingleMember({ userID, username, userIsAdmin, isAdmin, groupID, updateGroup, loggedInUserID }) {

    function removeMemberFromGroup(){
        let requestBody = {
            updateType: "remove_member_from_group",
            userID,
            groupID
        }
        let token = Cookies.get('csrftoken')

        updateGroup(token, requestBody)
    }

    let showRemoveButton = isAdmin && loggedInUserID!==userID

    return (<div className="member-row">
                <div>{username}</div>
                {showRemoveButton ? <button type="button" className="remove-member-button" onClick={removeMemberFromGroup}>Remove from group</button> : null}
            </div>)

}

const mapStateToProps = (state)=>({
    loggedInUserID: state.authActions.userID
})

export default connect(mapStateToProps, {updateGroup})(SingleMember)