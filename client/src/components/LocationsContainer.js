import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './LocationsContainer.css'
import { Box } from '@mui/material';
import { useMediaQuery } from "@mui/material";
import Message from './Message';

const LocationsContainer = () => {

    const [storages, setStorages] = useState([])
    const [error, setError] = useState({ error: false, message: "" })

    let navigate = useNavigate();
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        getStorages()
    },[])

    const getStorages = async () => {
        try {
            const res = await fetch(`artworks-management-app.vercel.app/storage/allStorages`)
            const data = await res.json()
            setStorages(data);
        } catch (error) {
            throw new Error(error)
        }
    }

    const handleStorageSelect = (name) => {
        navigate(`/gallery/:${name}`)
    }
  
    return <>
        <Message
            open={error.error}
            handleClose={() => setError({ error: false, message: "" })}
            message={error.message}
            severity="error" />

        <Box  
            component="section"
            className={isSmallDevice ?
                'mobile-locations-container' :
                'locations-container'
            }>
            <div 
                className={isSmallDevice ? 'mobile-location-item' : 'location-item'} 
                style={{textAlign: 'left', paddingLeft: '25px'}}
                onClick={() => handleStorageSelect('All')}>
                All
            </div>
            {storages.map(storage => (
                <div 
                    className={isSmallDevice ? 'mobile-location-item' : 'location-item'} 
                    key={storage.id} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '25px'}}>
                    <div 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleStorageSelect(storage.name)}
                    >
                        {storage.name}
                    </div>
                </div>
            ))}
        </Box></>  
}

export default LocationsContainer