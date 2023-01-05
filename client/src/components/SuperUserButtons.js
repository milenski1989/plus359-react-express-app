import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from '@mui/icons-material/FileDownload';import axios from 'axios';

function SuperUserButtons({
    currentImage,
    searchResults,
    updatedEntry,
    openDeleteConfirmationDialog,
    isEditMode,
    downloadImage,
    openEditMode,
    setEntryToUpdate,
    closeInfoModal,
    getAllEntries})
{

    const {id} = currentImage
    const {id: updatedEntryId} = updatedEntry


    //handle copy original img info to prefill the editable fields
    const handlePrefillEditableFields = (id) => {
        openEditMode(true);
        let copyOfEntry;
        copyOfEntry = searchResults.find((art) => art.id === id);
        const {id: copyId, artist, title, technique, dimensions, price, notes, storageLocation, cell, position} = copyOfEntry
        setEntryToUpdate({
            id: copyId,
            artist,
            title,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cell,
            position
        });
    };

    //handle save edited info
    const handleSaveEditedInfo = (id) => {
        editInfo(id);
        closeInfoModal(false)
        getAllEntries()
    };

    //handle cancel edit mode
    const handleCancelEditMode = () => {
        openEditMode(false);
    };

    //UPDATE entry - THERE IS MORE TO DO
    const editInfo = async (id) => {
        const response = await axios.put(
            `https://app.plus359gallery.eu/api/artworks/${id}`,
            updatedEntry
        );
    
        if (response.status === 200) {
            openEditMode(false);
            setEntryToUpdate({});
            getAllEntries();
        } else {
            openEditMode(false);
            setEntryToUpdate({});
        }
    };
    
    if (currentImage) {
        return (
            <div className="buttonsContainer">
                <Tooltip title="Delete" placement="top">
                    <IconButton
                        variant="outlined"
                        onClick={() => openDeleteConfirmationDialog(true)}
                        sx={{ marginTop: 0.75 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip><Tooltip title="Edit" placement="top">
                    <IconButton
                        variant="outlined"
                        onClick={() => handlePrefillEditableFields(id)}
                        sx={{ marginTop: 0.75 }}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
        
                {isEditMode && currentImage.id === updatedEntryId && 
                        
                        <><Tooltip title="Save" placement="top">
                            <IconButton
                                onClick={() => handleSaveEditedInfo(updatedEntryId)}
                                sx={{ marginTop: 0.75 }}
                            >
                                <SaveIcon />
                            </IconButton>
                        </Tooltip><Tooltip title="Cancel" placement="top">
                            <IconButton
                                onClick={handleCancelEditMode}
                                sx={{ marginTop: 0.75 }}
                            >
                                <CancelIcon />
                            </IconButton>
                        </Tooltip>
                        </>}

                <Tooltip title="Download" placement="top">
                    <IconButton
                        variant="outlined"
                        onClick={() => downloadImage(currentImage.download_url, currentImage.download_key)}
                    >
                        <FileDownloadIcon fontSize="medium" sx={{marginBottom: "-0.5rem"}} />
                    </IconButton>
                </Tooltip>
            </div>     
        )
    }
   
}

export default SuperUserButtons