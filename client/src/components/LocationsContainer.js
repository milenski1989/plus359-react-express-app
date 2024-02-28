import React from 'react'
import { useNavigate } from "react-router-dom";
import './LocationsContainer.css'

const storages = [
    'All', 'Vasil Levski', 'Vasil Levski Folders', 'Charta', 'Lozenets',
    'South Park', 'Vasil Levski Rooms', 'Collect', 'Other', 'Sold'
]

const LocationsContainer = () => {

    let navigate = useNavigate();

    const handleStorageSelect = (name) => {
        navigate(`/gallery/:${name}`)
    }
    return <>
        <div className='locations-container'>
            {storages.map(storage => (
                <div className='location-item' key={storage} onClick={() => handleStorageSelect(storage)}>{storage}</div>
            ))}
        </div></>  
}

export default LocationsContainer