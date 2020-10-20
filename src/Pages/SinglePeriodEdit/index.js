import React from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { deletePeriod } from '../../redux/action-creators'

import Cookies from 'js-cookie'
//Edit form for admins, populated with period info and with option to edit/assignshifts>publish/delete.
function SinglePeriodEdit({ userGroups, deletePeriod, ...props }){
    let group_id = props.match.params.group_id
    let period_id = props.match.params.period_id
    let history = useHistory()

    function deletePeriodClickHandler(){

        //call redux thunk
        let token = Cookies.get('csrftoken')
        deletePeriod(token, period_id, group_id)
        history.push(`/groups/${group_id}/`)


    }

    if (userGroups[group_id]){

        if(userGroups[group_id].is_admin){

            let period;

            for(let i=0;i < userGroups[group_id].periods.length; i ++ ){
                if(userGroups[group_id].periods[i].id==period_id){
                    period = userGroups[group_id].periods[i]
                }
            }

            return (<div>
                        <h2>Edit Period for {userGroups[group_id].name}</h2>

                        <div>
                        <h4>Edit Period</h4>

                        {period.period_start} to {period.period_end}

                        </div>

                        {period.published ? null : <div>
                            <h4>Assign Shifts</h4>

                            {/*Open Modal*/}
                            <div>View member's shift preferences</div>


                            <div>Members who have not submitted their preferences:</div>

                            <button>Automatically assign shifts</button>
                        </div>}

                        <div>
                            <h4>Delete Period</h4>

                            {/*To add - open modal to confirm*/}
                            <button onClick={deletePeriodClickHandler}>Delete</button>

                        </div>

                </div>)

        } else {
            return "Only an admin can make edits."
        }
    } else {
        return "Loading..."
    }



}

const mapStateToProps = (state) => {
    return {
        userGroups: state.appActions.userGroups
    }

}

export default withRouter(connect(mapStateToProps, { deletePeriod })(SinglePeriodEdit))