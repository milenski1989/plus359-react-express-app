import React from 'react'
import { useHistory } from 'react-router-dom';
import Icon277Exit from './icons as components/IconExit';

function Logout() {

    const history = useHistory()

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        history.push("/login")
    }

    return (
        <>
            <Icon277Exit
                onClick={handleLogout}
                color="white"
            />
        </>
       
    )
}

export default Logout