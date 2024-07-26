import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, TextField } from '@mui/material';
import { useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '../assets/save-solid.svg'
import Message from '../reusable/Message';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomDialog from '../reusable/CustomDialog';
import { deleteOneStorage, getStoragesWithNoEntries, saveOneStorage } from '../../api/storageService';


const StoragesManagement = () => {

    const [storages, setStorages] = useState([])
    const [selectedStorage, setSelectedStorage] = useState()
    const [newStorageName, setNewStorageName] = useState()
    const [showInput, setShowInput] = useState(false)
    const [error, setError] = useState({ error: false, message: "" })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        getEmptyStorages()
    },[])

    const getEmptyStorages = async () => {
        try {
            const response = await getStoragesWithNoEntries()
            setStorages(response.data);
        } catch (error) {
            throw new Error(error)
        }
    }

    const saveNewStorage = async (name) => {
        try {
            await saveOneStorage(name)

        } catch (error) {
            setError({ error: true, message: error.response.data.message })
        }
    }

    const deleteStorage = async (name) => {
        setIsLoading(true)
        try {
            await deleteOneStorage(name)
        } catch (error) {
            throw new Error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClickAddNewStorage = () => {
        setShowInput(true)
    }

    const handleChange = (e) => {
        setNewStorageName(e.target.value)
    }

    const handleSaveNewStorage = async () => {
        if (!newStorageName) return
        await saveNewStorage(newStorageName)
        setShowInput(false)
        getEmptyStorages()
    }

    const handleCancel = () => {
        setNewStorageName()
        setShowInput(false)
    }

    const handleDeleteStorage = () => {
        setIsDialogOpen(true)
    }
  
    return <>
        {isLoading && <CircularProgress className="loader" color="primary" />}
        <Message
            open={error.error}
            handleClose={() => setError({ error: false, message: "" })}
            message={error.message}
            severity="error" />

        {isDialogOpen &&
                <CustomDialog
                    openModal={isDialogOpen}
                    setOpenModal={() => setIsDialogOpen(true)}
                    title="Are you sure you want to delete this empty storage and all related cells and positions ?"
                    handleClickYes={async () => {
                        await deleteStorage(selectedStorage)
                        getEmptyStorages()
                        setIsDialogOpen(false)
                    }}
                    handleClickNo={() => {setSelectedStorage(); setIsDialogOpen(false)}} 
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                    style={{padding: '0'}}
                />}

        <Box  
            component="section"
            className={isSmallDevice ?
                'mobile-locations-container' :
                'locations-container'
            }>
            {showInput ?
                <div className={isSmallDevice ? 'mobile-textfield-icon-container' : 'textfield-icon-container'}>
                    <TextField sx={isSmallDevice ?
                        {
                            '& .MuiOutlinedInput-root':{
                                borderRadius: '37px', width: '242px', height: '47px'
                            }} :
                        {
                            '& .MuiOutlinedInput-root':{
                                borderRadius: '37px', width: '242px', height: '47px'
                            }, '&.MuiFormControl-root': {
                                marginBottom: '-1rem'
                            }}
                    } placeholder='Enter name...' onChange={(e) => handleChange(e)} />
                    <div style={isSmallDevice ? {position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)'} :{position: 'absolute', right: '15px', top: '30%'}} className={isSmallDevice ? 'mobile-icons-container': 'icons-container'}>
                        <img src={SaveIcon} style={{cursor: 'pointer', marginRight: '0.5rem'}} onClick={handleSaveNewStorage}/>
                        <CloseIcon sx={{fontSize: "30px", cursor: 'pointer'}} onClick={handleCancel}/>
                    </div>
                </div>
                :
                <div 
                    onClick={handleClickAddNewStorage}
                    className={isSmallDevice ? 'mobile-location-item add-new-storage' : 'location-item add-new-storage'}><AddIcon/></div>
            }
            {storages.map(storage => (
                <div 
                    className={isSmallDevice ? 'mobile-location-item' : 'location-item'} 
                    key={storage.id} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '25px'}}>
                    <div>
                        {storage.name}
                    </div>
                    <DeleteOutlineIcon 
                        className='icon'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {setSelectedStorage(storage.name);handleDeleteStorage()}}
                    />
                </div>
            ))}
        </Box></>  
}

export default StoragesManagement