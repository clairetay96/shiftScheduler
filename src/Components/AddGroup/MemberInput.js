import React, { useState } from 'react'


const MemberInput = ({ addMemberID, customKey, selectedUsername }) => {
    let [options, setOptions] = useState(null)

    const onChangeHandler = (e) => {
        addMemberID(customKey, null, e.target.value)

        if(e.target.value.length > 0){

            //make request to find username containing target value
            let URL = `/api/find-user/${e.target.value}/`
            fetch(URL)
                .then(res => res.json())
                .then(res => {

                    let optionHTML = res.map((item, index)=>{
                        return <div key={index} onClick={()=>{ setOptions(null); addMemberID(customKey, item.id, item.username)}}>{item.username}</div>
                    })

                    setOptions(optionHTML)
                })

        } else {
            setOptions(null)

        }


    }

    return (<div>
                <input type="text" onChange={onChangeHandler} value={selectedUsername} autoComplete="off"/>
                {options}

            </div>)


}

export default MemberInput