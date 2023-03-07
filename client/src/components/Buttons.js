import "./Gallery.css";
import axios from "axios";
import { saveAs } from 'file-saver'
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton, Tooltip } from "@mui/material"


const Buttons = ({ currentImage, isEditMode, searchResults, getAllEntries, setIsEditMode, updatedEntry, setUpdatedEntry, setIsDeleteConfOpen, setIsInfoModalOpen}) => {

    const downloadOriginalImage = (downloadUrl, name ) => {
        saveAs(downloadUrl, name)
    }

    //handle copy original img info to prefill the editable fields
    const prefillEditableFields = (id) => {
        setIsEditMode(true);
        let copyOfEntry;

        copyOfEntry = searchResults.find((art) => art.id === id);
        const {id: copyId, artist, title, technique, dimensions, price, notes, storageLocation, cell, position, onWall, inExhibition} = copyOfEntry
        setUpdatedEntry({
            id: copyId,
            artist,
            title,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cell,
            position,
            onWall,
            inExhibition
        });
    };

    const cancelEditing = () => {
        setIsEditMode(false);
    };

    const updateEntry = async (id) => {
        const response = await axios.put(
            `http://localhost:5000/api/artworks/${id}`,
            updatedEntry
        );
        if (response.status === 200) {
            setIsEditMode(false);
            setUpdatedEntry({});
            getAllEntries();
        } else {
            setIsEditMode(false);
            setUpdatedEntry({});
        }
    };

    const saveUpdatedEntry = (id) => {
        updateEntry(id);
        setIsInfoModalOpen(false)
        getAllEntries()
    };

    return (

        <div className="buttonsContainer">
            <Tooltip title="Delete" placement="top">
                <IconButton
                    variant="outlined"
                    onClick={() => setIsDeleteConfOpen(true)}
                    sx={{ marginTop: 0.75 }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Edit" placement="top">
                <IconButton
                    variant="outlined"
                    onClick={() => prefillEditableFields(currentImage.id)}
                    sx={{ marginTop: 0.75 }}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>

            {isEditMode && currentImage.id === updatedEntry.id &&

        <><Tooltip title="Save" placement="top">
            <IconButton
                onClick={() => saveUpdatedEntry(updatedEntry.id)}
                sx={{ marginTop: 0.75 }}
            >
                <SaveIcon />
            </IconButton>
        </Tooltip><Tooltip title="Cancel" placement="top">
            <IconButton
                onClick={cancelEditing}
                sx={{ marginTop: 0.75 }}
            >
                <CancelIcon />
            </IconButton>
        </Tooltip>
        </>}

            <Tooltip title="Download" placement="top">
                <IconButton
                    variant="outlined"
                    onClick={() => downloadOriginalImage(currentImage.download_url, currentImage.download_key)}
                >
                    <FileDownloadIcon fontSize="medium" sx={{ marginBottom: "-0.5rem" }} />
                </IconButton>
            </Tooltip>
        </div>
    )

}

export default Buttons