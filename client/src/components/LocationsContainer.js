import React from 'react'
import { useNavigate } from "react-router-dom";
import './LocationsContainer.css'
import { Box } from '@mui/material';
import { useMediaQuery } from "@mui/material";

const storages = [
    'All', 'Vasil Levski', 'Vasil Levski Folders', 'Charta', 'Lozenets',
    'South Park', 'Vasil Levski Rooms', 'Collect', 'Other', 'Sold'
]

const LocationsContainer = () => {

    let navigate = useNavigate();
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const handleStorageSelect = (name) => {
        navigate(`/gallery/:${name}`)
    }
    return <>
        <Box  
            component="section"
            className={isSmallDevice ?
                'mobile-locations-container' :
                'locations-container'
            }>
            {storages.map(storage => (
                <div className={isSmallDevice ? 'mobile-location-item' : 'location-item'} key={storage} onClick={() => handleStorageSelect(storage)}>{storage}</div>
            ))}
        </Box></>  
}

export default LocationsContainer