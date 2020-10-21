import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'



const Homepage = ({ loggedIn, userShifts })=>{

    if(loggedIn){
        if(userShifts!==undefined){
            let userShiftsUI = () => userShifts.map((item, index) => {
                return <div key={index}>moment({item.shift_start}).fornat("ddd DD/MM/YY HH:mm"), moment({item.shift_end}).fornat("ddd DD/MM/YY HH:mm")</div>
        })

            return <div>
                    <h2>Your Shifts</h2>

                    {userShiftsUI()}

                  </div>


        } else {
            return "Loading..."
        }


    } else {
        return (<div>
                This is the homepage.
            </div>)
    }


}

const mapStateToProps = (state)=>({
    loggedIn: state.authActions.loggedIn,
    userShifts: state.appActions.userShifts
})


export default connect(mapStateToProps)(Homepage)