import moment from 'moment'
//takes in members (list of IDs), user preferences (list of objs), all shifts (list of objs)
//returns all shifts WITH user assignments
//ie shiftSetWithAssignment=[{shift_start, shift_end, workers_required, users, ...}]
function assignShifts(members, userPreferences, shiftSet) {
    let userPref = [...userPreferences]
    let shifts = {}

    shiftSet.forEach((item)=>{
        item.users = []
        shifts[item.id] = item
    })

    let memberList = Object.keys(members)

    //sort userPref by submitted_at
    userPref.sort((a, b)=>{
        if(moment(a.submitted_at).isBefore(b.submitted_at)){
            return -1
        } else {
            return 1
        }
    })

    let blockedOutPrefs = {}
    //loop through user preferences
    userPref.forEach((item)=>{
        //assign preferred shifts
        item.preferred_shifts.forEach((item1)=>{
            if(shifts[item1.id].users.length < shifts[item1.id].workers_required){
                shifts[item1.id].users.push(item.user)
            }
        })

        //store blocked out prefs in a more accessible form
        blockedOutPrefs[item.user] = {
            blocked_out_ids: item.blocked_out_shifts.map(item=>item.id),
            submitted_at: item.submitted_at
        }
    })

    let counter = 0
    let noOfMembers = memberList.length
    Object.keys(shifts).forEach((item)=>{

        if(shifts[item].users.length < shifts[item].workers_required){
            let start = 0
            let seen = []

            while(shifts[item].users.length < shifts[item].workers_required&&start < noOfMembers){
                if(blockedOutPrefs[memberList[counter%noOfMembers]]&&blockedOutPrefs[memberList[counter%noOfMembers]].blocked_out_ids.includes(item.id)){
                    seen.push({user_id: memberList[counter%noOfMembers], submitted_at:blockedOutPrefs[memberList[counter%noOfMembers]].submitted_at })
                } else if (!shifts[item].users.includes(parseInt(memberList[counter%noOfMembers]))) {
                    shifts[item].users.push(parseInt(memberList[counter%noOfMembers]))
                }

                counter += 1
                start += 1
            }

            if(shifts[item].users.length < shifts[item].workers_required){
                seen.sort((a,b)=>{
                    if(moment(a).isBefore(b)){
                        return -1
                    } else {
                        return 1
                    }
                })

                while(shifts[item].users.length < shifts[item].workers_required && seen.length > 0){
                    shifts[item].users.push(seen.pop())

                }
            }

        }

    })

    //return altered shifts
    return Object.values(shifts)
}


export default assignShifts