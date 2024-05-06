/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { ImageContext } from './contexts/ImageContext';
import { findAvailablePositions } from "./constants/constants";
import { Box } from '@mui/material';

function CascadingDropdowns({
    setFormControlData, 
    openInModal, 
}) {

    const {setUpdatedEntry, updatedEntry, isEditMode, currentImages} = useContext(ImageContext)

    const [location, setLocation] = useState('--Location--')
    const [cells, setCells] = useState([])
    const [availablePositions, setAvailablePositions] = useState([])
    const [storages, setStorages] = useState([])
    
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

    const findAvailablePositions = async (selectedCell, location = null) => {
        const getArtsNumbers = async () => {
            const res = await fetch(`artworks-management-app.vercel.app/storage/${selectedCell}/${location}`)
            const data = await res.json()
            return data
        };
        
        const freePositions = await getArtsNumbers()
        setAvailablePositions(freePositions)
    }

    const changeLocation = (newValue) => {
        if (!newValue) return
        setLocation(newValue)
        const selectedStorage = storages.find(location => location.name === newValue);
        const selectedCells = selectedStorage ? selectedStorage.cells.map(cell => cell.name) : [];
        setCells(selectedCells);

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
        if (!newValue) return

        findAvailablePositions(newValue, location)
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
        if (!newValue) return
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

    const clearLocation = (event, newValue) => {
        setFormControlData({
            storageLocation: newValue,
            position: newValue,
            cell: newValue
        });
    }

    return (
        <Box>
            <Autocomplete
                disablePortal
                options={storages.map(location => location.name)}
                renderInput={(params) => <TextField {...params} label={isEditMode ? updatedEntry.storageLocation : 'Location'} />} 
                onChange={(event, newValue) => changeLocation(newValue)}
                onInputChange={(event, newInputValue) => {
                    if (newInputValue === '') {
                        clearLocation(event, newInputValue);
                    }
                }}
                fullWidth
                sx={{marginBottom: '1rem'}}
            />
          
            <Autocomplete
                disablePortal
                disabled={location === 'Sold'}
                options={location !== 'Sold' ? cells : []}
                renderInput={(params) =>
                    <TextField {...params} label={isEditMode ? `cell: ${updatedEntry.cell ? updatedEntry.cell : 'none'}` : 'Cell'} />} 
                onChange={(event, newValue) => changeCell(newValue)}
                fullWidth
                sx={{marginBottom: '1rem'}}
            />
            {(openInModal && currentImages.length === 1) || !openInModal ? 
                <Autocomplete
                    disablePortal
                    disabled={location === 'Sold'}
                    options={availablePositions}
                    renderInput={(params) =>
                        <TextField {...params} label={isEditMode ? `position: ${updatedEntry.position}` : 'Position'} />} 
                    onChange={(event, newValue) => changePosition(newValue)}
                    fullWidth
                    sx={{marginBottom: '1rem'}}
                /> :
                <></>
            }
         
        </Box>
    )
}

export default CascadingDropdowns
