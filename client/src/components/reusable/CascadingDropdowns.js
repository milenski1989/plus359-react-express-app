/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './CascadingDropdowns.css'
import { ImageContext } from '../contexts/ImageContext';
import { Box, useMediaQuery } from '@mui/material';
import { getAllStorages, getAvailablePositions } from '../../api/storageService';

function CascadingDropdowns({
    setFormControlData, 
    isOpenInModal
}) {

    const {setUpdatedEntry, updatedEntry, isEditMode, currentImages} = useContext(ImageContext)
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");


    const [location, setLocation] = useState('--Location--')
    const [cells, setCells] = useState([])
    const [availablePositions, setAvailablePositions] = useState([])
    const [storages, setStorages] = useState([])
    
    useEffect(() => {
        getStorages()
    },[])

    const getStorages = async () => {
        try {
            const response = await getAllStorages()
            setStorages(response.data);
        } catch (error) {
            throw new Error(error)
        }
    }

    const findAvailablePositions = async (selectedCell, location = null) => {
       
        const response = await getAvailablePositions(selectedCell, location)

        const freePositions = response.data
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
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Autocomplete
                disablePortal
                sx={isOpenInModal ? {width: '70%', marginBottom: '1rem'} : {width: '50vw', marginBottom: '1rem'}}
                options={storages.map(location => location.name)}
                renderInput={(params) => <TextField {...params} label={isEditMode ? updatedEntry.storageLocation : 'Location *'} />} 
                onChange={(event, newValue) => changeLocation(newValue)}
                onInputChange={(event, newInputValue) => {
                    if (newInputValue === '') {
                        clearLocation(event, newInputValue);
                    }
                }}
            />
          
            <Autocomplete
                disablePortal
                sx={isOpenInModal ? {width: '70%', marginBottom: '1rem'} : {width: '50vw', marginBottom: '1rem'}}
                disabled={location === 'Sold'}
                options={location !== 'Sold' ? cells : []}
                renderInput={(params) =>
                    <TextField {...params} label={isEditMode ? `cell: ${updatedEntry.cell ? updatedEntry.cell : 'none'}` : 'Cell'} />} 
                onChange={(event, newValue) => changeCell(newValue)}
            />
            {(isOpenInModal && currentImages.length === 1) || !isOpenInModal ? 
                <Autocomplete
                    disablePortal
                    sx={isOpenInModal ? {width: '70%', marginBottom: '1rem'} : {width: '50vw', marginBottom: '1rem'}}
                    disabled={location === 'Sold'}
                    options={availablePositions}
                    renderInput={(params) =>
                        <TextField {...params} label={isEditMode ? `position: ${updatedEntry.position}` : 'Position'} />} 
                    onChange={(event, newValue) => changePosition(newValue)}
                /> :
                <></>
            }
         
        </Box>
    )
}

export default CascadingDropdowns
