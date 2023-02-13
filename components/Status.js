import { useState } from "react";

const Status = (props) => {

    const [state, setState ] = useState(() => {
        if(props.deadline > (Date.now() / 1000)) {
            return {status: 'Active', colour: 'green'};
        } else {
            return {status: 'Expired', colour: 'red'};
        }
    })
    return (
        <p style = {{color: state.colour}}>{state.status}</p>
    )
}

export default Status;