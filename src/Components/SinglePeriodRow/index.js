import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './index.css'


function SinglePeriodRow({ period_info, is_admin }){

    return <div className="period-row">

                {moment(period_info.period_start).format("DD/MM/YY ddd")} to {moment(period_info.period_end).format("DD/MM/YY ddd")}
                <div>

                {period_info.published ?
                    null:
                   ( period_info.preference_submitted ?
                        <Link to={`/groups/${period_info.work_group}/periods/${period_info.id}/`}><button className="period-button">Edit Preference </button></Link> :

                        <Link to={`/groups/${period_info.work_group}/periods/${period_info.id}/`}><button className="period-button">Submit  Preference </button></Link>) }

                {is_admin? <Link to={`/groups/${period_info.work_group}/periods/${period_info.id}/edit`}><button className="period-button">Edit</button></Link>: null}
                </div>
            </div>


}

export default SinglePeriodRow