import React from 'react'
import { useNavigate } from 'react-router-dom';
import Icon277Exit from './icons as components/IconExit';

function Logout() {

    let navigate = useNavigate();

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
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