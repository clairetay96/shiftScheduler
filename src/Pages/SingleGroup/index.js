import React from 'react'
import { withRouter } from "react-router-dom";

const SingleGroup = (props) => {


    return <div>This is single group. {props.match.params.id}</div>

}

export default withRouter(SingleGroup)