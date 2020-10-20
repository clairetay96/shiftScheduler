import React from 'react'
import { connect } from 'react-redux'



const Homepage = ({ loggedIn, userShifts })=>{

    if(loggedIn){
        if(userShifts!==undefined){
            let userShiftsUI = () => userShifts.map((item, index) => {
                return <div key={index}>{item.shift_start}, {item.shift_end}</div>
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