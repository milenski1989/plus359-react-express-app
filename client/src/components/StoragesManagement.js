import React, { useEffect, useState } from 'react'
import './LocationsContainer.css'
import { Box, CircularProgress, TextField } from '@mui/material';
import { useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '../components/assets/save-solid.svg'
import Message from './Message';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomDialog from './CustomDialog';


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
        getStoragesWithNoEntries()
    },[])

    const getStoragesWithNoEntries = async () => {
        try {
            const res = await fetch(`https://plus359-react-express-lk1cf594n-milenski1989s-projects.vercel.app/storage/storagesWithNoEntries`)
            const data = await res.json()
            setStorages(data);
        } catch (error) {
            throw new Error(error)
        }
    }

    const saveNewStorage = async (name) => {
        try {
            await axios.post("https://plus359-react-express-lk1cf594n-milenski1989s-projects.vercel.app/storage/saveOne", {name}, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            setError({ error: true, message: error.response.data })
        }
    }

    const deleteStorage = async (name) => {
        setIsLoading(true)
        try {
            await axios.delete(`https://plus359-react-express-lk1cf594n-milenski1989s-projects.vercel.app/storage/deleteOne`, {params: {name}});
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
        getStoragesWithNoEntries()
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
                        getStoragesWithNoEntries()
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