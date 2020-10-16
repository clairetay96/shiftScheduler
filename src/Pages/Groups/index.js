import React, { useState, useEffect } from 'react'


function Groups(){
    let [userGroups, setUserGroups] = useState([])

    //fetch all of a user's groups
    useEffect(()=>{
        let groupsURL = "/api/groups/"
        fetch(groupsURL)
            .then(res => res.json())
            .then(res => {
                let groupHTML = res.map((item, index)=>{
                    return <div key={index}>{item.name}, {item.members.map(member=>member.username)}</div>
                })
                setUserGroups(groupHTML)
            })


    }, [])



    return (<div>
                This is groups
                {userGroups}
            </div>)
}




export default Groups