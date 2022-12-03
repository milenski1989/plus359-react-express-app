import { Button } from '@mui/material'
import React from 'react'

const buttonStyle = {
    position: "absolute",
    top: "2rem",
    right: "2rem",
    color:"white"
}

function Logout() {

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        history.push("/login")
    }

    return (
        <>
            <Button
                style={buttonStyle}
                className="actionButton logoutButton"
                children="Log out"
                onClick={handleLogout}
            />
        </>
       
    )
}

export default Logout