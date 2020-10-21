import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'


function SinglePeriodRow({ period_info, is_admin }){

    return <div>

                {moment(period_info.period_start).format("DD/MM/YY ddd")} to {moment(period_info.period_end).format("DD/MM/YY ddd")}


                {period_info.published ?

                    <Link to={`/groups/${period_info.work_group}/periods/${period_info.id}`}><button>See shifts</button></Link> :


                   ( period_info.preference_submitted ?
                        <Link to={`/groups/${period_info.work_group}/periods/${period_info.id}/edit-preference`}><button>Edit Preference </button></Link> :

                        <Link to={`/groups/${period_info.work_group}/periods/${period_info.id}/`}><button>Submit  Preference </button></Link>) }

                {is_admin? <Link to={`/groups/${period_info.work_group}/periods/${period_info.id}/edit`}><button>Edit</button></Link>: null}
            </div>


}

export default SinglePeriodRow