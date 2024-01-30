/* eslint-disable no-undef */
import React from 'react'
import './App.css'
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import './Home.css'
import { Box } from '@mui/material';

const storages = [
    'All', 'Vasil Levski', 'Vasil Levski Folders', 'Charta', 'Lozenets',
    'South Park', 'Vasil Levski Rooms', 'Collect', 'Other'
]


const Home = () => {

    let navigate = useNavigate();

    const handleStorageSelect = (name) => {
        navigate(`/gallery/:${name}`)
    }

    return <>
        <Navbar/>
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center",
                marginTop: "6rem"
            }}
        >
            {storages.map(storage => (
                <Box 
                    key={storage} 
                    sx={{color: "black", cursor: "pointer", fontSize: "18px", marginBottom: "1rem"}}
                    onClick={() => handleStorageSelect(storage)}
                >
                    {storage}
                </Box>
            ))}
        </Box>
    </>
}

export default Home