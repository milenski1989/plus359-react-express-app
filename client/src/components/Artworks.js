import React, { useEffect, useState } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Artworks.css";
import "./App.css";
import InfoIcon from "@mui/icons-material/Info";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import MyDialog from "./MyDialog";
import { saveAs } from 'file-saver'
import Message from "./Message";

const Artworks = () => {
    const [entries, setEntries] = useState([]);
    const [updatedEntry, setUpdatedEntry] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        error: false,
        message: ""
    })
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null)
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchByAllFields = (e) => {
        const {value} = e.target
        const resultsArray = entries.filter(art => {
            if (
                art.artist.includes(value) || art.title.includes(value) || art.image_key.includes(value) || art.technique.includes(value) ||
                art.dimensions.includes(value) || art.notes.includes(value) || art.storageLocation.includes(value) ||
                art.cell.includes(value) || art.position.toString().includes(value)
            ) return true;
           
        })

        setSearchResults(resultsArray)
    }

    const getAllEntries = async () => {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/artworks");
        const data = await res.json();
        console.log(data)
       
        if (res.status === 200) {
            setEntries(data)
            setSearchResults(data)
            setLoading(false);
        } else {
            setError({error: true, message: ""})
            setLoading(false);
        }
     
    };

    const downloadImage = (downloadUrl, name ) => {
        saveAs(downloadUrl, name)
    }

    useEffect(() => {
        getAllEntries()
    }, []);

    const deleteImageAndEntry = async (originalFilename ,filename, id) => {
        setIsDeleting(true);

        await axios.delete(`http://localhost:5000/api/artworks/${originalFilename}`,
            {originalFilename: originalFilename})

        await axios.delete(`http://localhost:5000/api/artworks/${filename}`,{filename: filename})
        const response = await axios.delete(
            `http://localhost:5000/api/artworks/${id}`,
            { id: id }
        );
        
        if (response.status === 200) {
            getAllEntries()
            setSearchResults(entries.filter((art) => art.id !== id));
            setIsDeleting(false);
        }
        
    };

    const hadleDeleteImageAndEntry = (originalName, filename, id) => {
        deleteImageAndEntry(originalName, filename, id)
        setIsDeleteConfOpen(false)
        setIsInfoModalOpen(false)
    };

    const editInfo = async (id) => {
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

    const handleEditInfo = (id) => {
        setIsEditMode(true);
        let copyOfEntry;
        copyOfEntry = searchResults.find((art) => art.id === id);
        setUpdatedEntry({
            id: copyOfEntry.id,
            artist: copyOfEntry.artist,
            title: copyOfEntry.title,
            technique: copyOfEntry.technique,
            dimensions: copyOfEntry.dimensions,
            price: copyOfEntry.price,
            notes: copyOfEntry.notes,
            storageLocation: copyOfEntry.storageLocation,
            cell: copyOfEntry.cell,
            position: copyOfEntry.position
        });
    };

    const handleSaveEditedInfo = (id) => {
        editInfo(id);
        setIsInfoModalOpen(false)
        getAllEntries()
    };

    const handleCancelEditMode = () => {
        setIsEditMode(false);
    };

    const handleChangeEditableField = (e) => {
        const { name, value } = e.target;
        setUpdatedEntry(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleOpenInfoModal = (art) => {
        setIsInfoModalOpen(true)
        setCurrentImage(art)
    }

    const handleCloseInfoModal = () => {
        setIsInfoModalOpen(prev => !prev)
        setIsEditMode(false)
        setCurrentImage(null)
    } 
 
    return (
        <>
            {
                <Message
                    open={error.error}
                    handleClose={() => setError({ error: false, message: "" })}
                    message={error.message}
                    severity="error"
                />
            }
            <MyDialog
                isModalOpen={isInfoModalOpen}
                handleCloseModal={handleCloseInfoModal}
                image={currentImage}
                editMode={isEditMode}
                updatedEntry={updatedEntry}
                handleChangeEditableField={handleChangeEditableField}
            >
                <div className="buttonsContainer">
                    <Tooltip title="Delete"  placement="top">
                        <IconButton
                            variant="outlined"
                            onClick={() => setIsDeleteConfOpen(true) }
                            sx={{ marginTop: 0.75 }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit"  placement="top">
                        <IconButton
                            variant="outlined"
                            onClick={() => handleEditInfo(currentImage.id)}
                            sx={{ marginTop: 0.75 }}
                        >
                            <ModeEditIcon />
                        </IconButton>
                    </Tooltip>

                    {isEditMode && currentImage.id === updatedEntry.id && (
                        <>
                            <Tooltip title="Save" placement="top">
                                <IconButton
                                    onClick={() => handleSaveEditedInfo(updatedEntry.id)}
                                    sx={{ marginTop: 0.75 }}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Cancel" placement="top">
                                <IconButton
                                    onClick={handleCancelEditMode}
                                    sx={{ marginTop: 0.75 }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                        
                    )}

                    <Tooltip title="Download" placement="top">
                        <IconButton
                            variant="outlined"
                            onClick={() => downloadImage(currentImage.download_url, currentImage.download_key)}
                            sx={{ marginTop: 0.75 }}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </MyDialog>

            {
                <Dialog
                    open={isDeleteConfOpen}
                    onClose={() => setIsDeleteConfOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to delete the entry ?"}
                    </DialogTitle>
                    <DialogContent>
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => hadleDeleteImageAndEntry(currentImage.download_key, currentImage.image_key, currentImage.id, )}>Yes</Button>
                        <Button onClick={() => setIsDeleteConfOpen(false)} autoFocus>
                      Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            }

            <SecondaryNavbar />

            <div className="searchBar">
                <Paper
                    component="form"
                    sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "70vw", marginLeft: "auto", marginRight: "auto" }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search..."
                        inputProps={{ "aria-label": "search" }}
                        onChange={handleSearchByAllFields}
                    />
                    <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>

            {loading || isDeleting ? (
                <CircularProgress className="loader" color="primary" />
            ) : (
                <div className="gridContainer">
                    {searchResults.map((art, id) => ( 
                        <div className="gridItem" key={id}>
                            <div className="numberLabel">{art.position}</div>

                            <div className="downloadButtonContainer">
                                <Tooltip title="Download" placement="top">
                                    <IconButton
                                        variant="outlined"
                                        onClick={() => downloadImage(art.download_url, art.download_key)}
                                        sx={{ marginTop: 0.75 }}
                                    >
                                        <FileDownloadIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                           
                            <img 
                                className="image"
                                src={art.image_url}
                                alt="no preview"
                            />

                            <div className="infoButtonContainer">
                                <Tooltip title="Show more">
                                    <IconButton
                                        variant="outlined"
                                        onClick={() => handleOpenInfoModal(art)}
                                        sx={{ marginTop: 0.75 }}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        
                    ))}
                </div>
                
                
            )}
        </>
    );
};
export default Artworks;
