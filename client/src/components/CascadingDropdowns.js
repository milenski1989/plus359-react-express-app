/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { ImageContext } from './contexts/ImageContext';
import { locations, findAvailablePositions } from "./constants/constants";
import { Box } from '@mui/material';

function CascadingDropdowns({
    setFormControlData, 
    openInModal, 
}) {

    const {setUpdatedEntry, isEditMode} = useContext(ImageContext)

    const [location, setLocation] = useState('--Location--')
    const [cells, setCells] = useState([])
    const [availablePositions, setAvailablePositions] = useState([])


    const changeLocation = (newValue) => {
        setLocation(newValue)
        setCells(locations.find(location => location.name === newValue).cells)

        setFormControlData((prevState) => ({
            ...prevState,
            storageLocation: newValue,
        })),
        setUpdatedEntry &&
        setUpdatedEntry((prevState) => ({
            ...prevState,
            storageLocation: newValue
        }))
    }

    const changeCell = async (newValue) => {
        if (!openInModal){
            const _availablePositions =  await findAvailablePositions(newValue, location).then(data => data)
            setAvailablePositions(_availablePositions)
        }
        setFormControlData((prevState) => ({
            ...prevState,
            cell: newValue,
        }));

        if (setUpdatedEntry) {
            setUpdatedEntry((prevState) => ({
                ...prevState,
                cell: newValue
            }))
        }  
    }

    const changePosition = (newValue) => {
        setFormControlData((prevState) => ({
            ...prevState,
            position: newValue,
        }));
        
        if (setUpdatedEntry) {
            setUpdatedEntry((prevState) => ({
                ...prevState,
                position: newValue
            }))
        }  
    }

    return (
        <Box>
            <Autocomplete
                disablePortal
                options={locations.map(location => location.name)}
                renderInput={(params) => <TextField {...params} label="Location" />} 
                onChange={(event, newValue) => changeLocation(newValue)}
                fullWidth
                sx={{marginBottom: '1rem'}}
            />
          
            <Autocomplete
                disablePortal
                disabled={location === 'Sold'}
                options={cells.map(cell => cell.name)}
                renderInput={(params) => <TextField {...params} label="Cell" />} 
                onChange={(event, newValue) => changeCell(newValue)}
                fullWidth
                sx={{marginBottom: '1rem'}}
            />
            
            {!openInModal &&
                <Autocomplete
                    disablePortal
                    disabled={location === 'Sold'}
                    options={availablePositions}
                    renderInput={(params) => <TextField {...params} label="Position" />} 
                    onChange={(event, newValue) => changePosition(newValue)}
                    fullWidth
                    sx={{marginBottom: '1rem'}}
                />
            }
        </Box>
    )
}

export default CascadingDropdowns
