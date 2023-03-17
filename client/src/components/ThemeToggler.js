import React from 'react'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { ThemeContext } from './App';

const ThemeToggler = () =>  {
    
    const {theme, setTheme} = useContext(ThemeContext)

    const changeTheme = () => {
        if (theme === 'dark') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }
    return (
        <>
     
            <IconButton type="button" sx={{ p: "10px" }} onClick={changeTheme}>
                {theme === 'dark' ? <DarkModeIcon/> : <LightModeIcon/>}
            </IconButton>
    
        </>
    )
}

export default ThemeToggler