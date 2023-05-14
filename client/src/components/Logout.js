import React from 'react'
import { useHistory } from 'react-router-dom';

function Icon277Exit(props) {
    return (
        <svg
            cursor="pointer"
            viewBox="0 0 16 16"
            fill="currentColor"
            height="20px"
            width="20px"
            color='white'
            {...props}
        >
            <path
                fill="currentColor"
                d="M12 10V8H7V6h5V4l3 3zm-1-1v4H6v3l-6-3V0h11v5h-1V1H2l4 2v9h4V9z"
            />
        </svg>
    );
}

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
            />
        </>
       
    )
}

export default Logout