import React from 'react'


function ShiftInput({ shift_info, onChangeHandler, customKey, removeShiftHandler }){
    return <div>
            Shift Start:
            <input type="datetime-local" name="shift_start" onChange={(event)=>{
                onChangeHandler(event.target.value, "shift_start", customKey)
            }} value={shift_info.shift_start}/>

            Shift End:
            <input type="datetime-local" name="shift_end" onChange={(event)=>{
                onChangeHandler(event.target.value, "shift_end", customKey)
            }} value={shift_info.shift_end}/>

            Workers required:
            <input type="text" name="workers_required" value={shift_info.workers_required} onChange={(event)=>{
                onChangeHandler(event.target.value, "workers_required", customKey)
            }} />


            <button type="button" onClick={()=>{removeShiftHandler(customKey)}}>Remove shift</button>

            </div>

}

export default ShiftInput