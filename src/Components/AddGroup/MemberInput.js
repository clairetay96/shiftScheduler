import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'


const MemberInput = ({ addMemberID, existingMembers }) => {
    let [options, setOptions] = useState([]) //array containing usernames
    let [optionUsernames, setOptionUsernames] = useState({}) //object mapping username to IDs

    const onInputChangeHandler = (e) => {

        if(e.length > 0){

            //make request to find username containing target value
            let URL = `/api/find-user/${e}/`
            fetch(URL)
                .then(res => res.json())
                .then(res => {

                    let tempOption = []
                    res.forEach((item)=>{
                        if(!existingMembers.includes(item.username)){
                            tempOption.push(item.username)
                        }
                    })

                    let tempOptionUsernames = {}
                    res.forEach((item)=>{
                        tempOptionUsernames[item.username] = item.id
                    })

                    setOptions(tempOption)
                    setOptionUsernames((prevState)=>({...prevState, ...tempOptionUsernames}))
                })

        } else {
            setOptions([])

        }
    }

    const onChangeHandler = (e) =>{

        let listOfIDs = e.map((item)=> optionUsernames[item])

        addMemberID(listOfIDs)

    }

    return (<div>
                <Typeahead id="basic-typeahead-multiple" multiple options={options} onInputChange={onInputChangeHandler} placeholder="Select Members..." onChange={onChangeHandler} />

            </div>)


}

export default MemberInput