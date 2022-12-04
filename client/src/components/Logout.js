import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { IconButton, Tooltip } from "@mui/material";
import React from 'react'
import { useHistory } from 'react-router';

function Logout({styles}) {

    const history = useHistory()

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        history.push("/login")
    }

    return (
        <>
            <Tooltip title="Log out"  placement="bottom">
                <IconButton
                    variant="outlined"
                    onClick={handleLogout}
                    sx={{ position: 'absolute', ...styles}}
                >
                    <ExitToAppIcon fontSize="medium" color="primary"/>
                </IconButton>
            </Tooltip>
        </>
       
    )
}

export default Logout