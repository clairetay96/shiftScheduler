import React, { useState } from 'react'


const MemberInput = ({ addMemberID, customKey }) => {
    let [currentVal, setCurrentVal] = useState("")
    let [name, setName] = useState("member")
    let [options, setOptions] = useState(null)

    const onChangeHandler = (e) => {
        setCurrentVal(e.target.value)

        //make request to find username containing target value
        let URL = `/api/find-user/${e.target.value}/`
        fetch(URL)
            .then(res => res.json())
            .then(res => {

                let optionHTML = res.map((item, index)=>{
                    return <div key={index} onClick={()=>{setCurrentVal(item.username); setName("name_"+item.id); setOptions(null); addMemberID(customKey, item.id)}}>{item.username}</div>
                })

                setOptions(optionHTML)
            })



    }

    return (<div>
                <input type="text" onChange={onChangeHandler} value={currentVal} name={name}/>
                {options}

            </div>)


}

export default MemberInput