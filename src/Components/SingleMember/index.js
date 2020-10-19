import React from 'react'
import Cookies from 'js-cookie'
import { connect } from 'react-redux'
import { updateGroup } from '../../redux/action-creators'




function SingleMember({ userID, username, userIsAdmin, isAdmin, groupID, updateGroup }) {

    function removeMemberFromGroup(){
        let requestBody = {
            updateType: "remove_member_from_group",
            userID,
            groupID
        }
        let token = Cookies.get('csrftoken')

        updateGroup(token, requestBody)
    }



    return (<div>
                <div>{username}</div>
                {isAdmin? <button type="button" onClick={removeMemberFromGroup}>Remove from group</button> : null}
            </div>)

}

export default connect(null, {updateGroup})(SingleMember)