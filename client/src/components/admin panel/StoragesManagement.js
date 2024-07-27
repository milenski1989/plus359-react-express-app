import React, { useEffect, useState } from 'react';
import { CircularProgress, TextField } from '@mui/material';
import { useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '../assets/save-solid.svg';
import Message from '../reusable/Message';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CustomDialog from '../reusable/CustomDialog';
import { deleteOneStorage, getStoragesWithNoEntries, saveOneStorage } from '../../api/storageService';
import './StoragesManagement.css';

const StoragesManagement = () => {
    const [storages, setStorages] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState();
    const [newStorageName, setNewStorageName] = useState();
    const [showInput, setShowInput] = useState(false);
    const [error, setError] = useState({ error: false, message: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        getEmptyStorages();
    }, []);

    const getEmptyStorages = async () => {
        setIsLoading(true);
        try {
            const response = await getStoragesWithNoEntries();
            setStorages(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError({ error: true, message: error.response?.data?.message || "An error occurred" });
        }
    };

    const saveNewStorage = async (name) => {
        setIsLoading(true);
        try {
            await saveOneStorage(name);
            setIsLoading(false);
            getEmptyStorages();
        } catch (error) {
            setIsLoading(false);
            setError({ error: true, message: error.response?.data?.message || "An error occurred" });
        }
    };

    const deleteStorage = async (name) => {
        setIsLoading(true);
        try {
            await deleteOneStorage(name);
            getEmptyStorages();
        } catch (error) {
            setIsLoading(false);
            setError({ error: true, message: error.response?.data?.message || "An error occurred" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickAddNewStorage = () => {
        setShowInput(true);
    };

    const handleChange = (e) => {
        setNewStorageName(e.target.value);
    };

    const handleSaveNewStorage = async () => {
        if (!newStorageName) return;
        await saveNewStorage(newStorageName);
        setShowInput(false);
    };

    const handleCancel = () => {
        setNewStorageName('');
        setShowInput(false);
    };

    const handleDeleteStorage = () => {
        setIsDialogOpen(true);
    };

    return (
        <>
            {isLoading && <CircularProgress className="loader" color="primary" />}
            
            <Message
                open={error.error}
                handleClose={() => setError({ error: false, message: "" })}
                message={error.message}
                severity="error"
            />

            {isDialogOpen &&
                <CustomDialog
                    openModal={isDialogOpen}
                    setOpenModal={() => setIsDialogOpen(true)}
                    title="Are you sure you want to delete this empty storage and all related cells and positions?"
                    handleClickYes={async () => {
                        await deleteStorage(selectedStorage);
                        setIsDialogOpen(false);
                    }}
                    handleClickNo={() => { setSelectedStorage(); setIsDialogOpen(false); }}
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                    style={{ padding: '0' }}
                />
            }

            {!isLoading && !error.error && (
                <div className="storages-management-content-container">
                    {showInput ? (
                        <div className="add-new-storage-textfield-actions-container">
                            <TextField
                                sx={isSmallDevice
                                    ? { '& .MuiOutlinedInput-root': { borderRadius: '37px', width: '242px', height: '47px' } }
                                    : { '& .MuiOutlinedInput-root': { borderRadius: '37px', width: '242px', height: '47px' } }}
                                placeholder='Enter name...'
                                onChange={handleChange}
                            />
                            <div className="add-new-storage-actions-container">
                                <img src={SaveIcon} onClick={handleSaveNewStorage} />
                                <CloseIcon onClick={handleCancel} />
                            </div>
                        </div>
                    ) : (
                        <div className="add-new-storage-button-container">
                            <AddIcon onClick={handleClickAddNewStorage}/>
                        </div>
                    )}
                    <div className="locations-container">
                        {storages.length > 0 ? (
                            storages.map(storage => (
                                <div className="location location-action-container" key={storage.id}>
                                    {storage.name}
                                    <DeleteOutlineIcon
                                        className='icon'
                                        onClick={() => { setSelectedStorage(storage.name); handleDeleteStorage(); }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No storages found</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default StoragesManagement;
