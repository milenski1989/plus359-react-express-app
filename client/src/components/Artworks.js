import React, {  useEffect, useState } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Artworks.css";
import "./App.css";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Tooltip, Pagination } from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import MyDialog from "./MyDialog";
import { saveAs } from 'file-saver'
import Message from "./Message";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { yellow, green } from '@mui/material/colors';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const Artworks = () => {

    const [entries, setEntries] = useState([])
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
    const [deletedSuccessful, setDeleteSuccessful] = useState(false);
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(2)

    //GET entries
    const getAllEntries = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/artworks?page=${page}`);
        const data = await res.json();
       
        if (res.status === 200) {
            setEntries(data)
            setSearchResults(data)

            setLoading(false);
        } else {
            setError({error: true, message: ""})
            setLoading(false);
        }
     
    };

    //handle copy original img info to prefill the editable fields
    const handlePrefillEditableFields = (id) => {
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

    //handle save edited info
    const handleSaveEditedInfo = (id) => {
        editInfo(id);
        setIsInfoModalOpen(false)
        getAllEntries()
    };

    //handle cancel edit mode
    const handleCancelEditMode = () => {
        setIsEditMode(false);
    };

    //UPDATE entry - THERE IS MORE TO DO
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

    //download original image
    const downloadImage = (downloadUrl, name ) => {
        saveAs(downloadUrl, name)
    }

    useEffect(() => {
        getAllEntries()
    }, [page]);

    //handle search by all fields
    const handleSearchByAllFields = (e) => {
        const {value} = e.target
        const resultsArray = entries.filter(art => {
            if (
                art.artist.toLowerCase().includes(value) || art.title.toLowerCase().includes(value) || art.image_key.toLowerCase().includes(value) || art.technique.toLowerCase().includes(value) ||
                art.dimensions.toLowerCase().includes(value) || art.notes.toLowerCase().includes(value) || art.storageLocation.toLowerCase().includes(value) ||
                art.cell.toLowerCase().includes(value) || art.position.toString().toLowerCase().includes(value)
            ) return true;
        })

        setSearchResults(resultsArray)
    }

    //handle open info modal
    const handleOpenInfoModal = (art) => {
        setIsInfoModalOpen(true)
        setCurrentImage(art)
    }

    //handle close info modal
    const handleCloseInfoModal = () => {
        setIsInfoModalOpen(prev => !prev)
        setIsEditMode(false)
        setCurrentImage(null)
    } 

    //handle change editable field in modal
    const handleChangeEditableField = (event) => {
        const { name, value } = event.target;
        setUpdatedEntry(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    //DELETE thumbnail, original image and entry
    const deleteImageAndEntry = async (originalFilename ,filename, id) => {
        setIsDeleting(true);

        await axios.delete(`http://localhost:5000/api/artworks/${originalFilename}`,
            {originalFilename})

        await axios.delete(`http://localhost:5000/api/artworks/${filename}`,{filename})
        const response = await axios.delete(
            `http://localhost:5000/api/artworks/${id}`,
            { id }
        );
        
        if (response.status === 200) {
            getAllEntries()
            setSearchResults(entries.filter((art) => art.id !== id));
            setIsDeleting(false);
            setDeleteSuccessful(true)
        }
        
    };

    //handle delete thumbnail, original image and entry
    const hadleDeleteImageAndEntry = (originalName, filename, id) => {
        deleteImageAndEntry(originalName, filename, id)
        setIsDeleteConfOpen(false)
        setIsInfoModalOpen(false)
    };

    //handle page change
    const handlePageChange = (event, value) => {
        setPage(Number(value))
        if (entries.length > 1) {
            setCount(value + 1)
        }
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

            {
                <Message
                    open={deletedSuccessful}
                    handleClose={() => setDeleteSuccessful(false)}
                    message="Entry deleted successfully!"
                    severity="success"
                />
            }
            <MyDialog
                isModalOpen={isInfoModalOpen}
                handleCloseModal={handleCloseInfoModal}
                image={currentImage}
                editMode={isEditMode}
                updatedEntry={updatedEntry}
                setUpdatedEntry={setUpdatedEntry}
                handleChangeEditableField={handleChangeEditableField}
            >

                <div className="buttonsContainer">
                    <Tooltip title="Delete" placement="top">
                        <IconButton
                            variant="outlined"
                            onClick={() => setIsDeleteConfOpen(true)}
                            sx={{ marginTop: 0.75}}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip><Tooltip title="Edit" placement="top">
                        <IconButton
                            variant="outlined"
                            onClick={() => handlePrefillEditableFields(currentImage.id)}
                            sx={{ marginTop: 0.75 }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
        
                    {isEditMode && currentImage.id === updatedEntry.id && 
                        
                        <><Tooltip title="Save" placement="top">
                            <IconButton
                                onClick={() => handleSaveEditedInfo(updatedEntry.id)}
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
                <><div className="gallery">
                    {searchResults.map((art, id) => (

                        <div className="galleryItem" key={id}>
                            <span className="imagePositionLabel">{art.position}</span>
                            <img
                                className="galleryImage"
                                src={art.image_url}
                                onClick={() => handleOpenInfoModal(art)}
                                alt="no preview" />

                            <div className="imageButtons">
                                {art.onWall || art.inExhibition ?
                                    <div>
                                        <Tooltip title={art.onWall && "on a wall" || art.inExhibition && "in exhibition"} placement="top">
                                            <span>
                                                <IconButton disabled>
                                                    <CheckCircleIcon sx={{ color: art.onWall && yellow[500] || art.inExhibition && green[500] }} />
                                                </IconButton>
                                            </span>

                                        </Tooltip>
                                    </div> : <></>}
                            </div>
                        </div>
                    ))}
                </div>
                <Pagination
                    count={count}
                    page={page}
                    variant="outlined"
                    showFirstButton
                    showLastButton
                    color="primary"
                    sx={{ marginTop: "3rem", marginLeft: "5rem"}}
                    onChange={handlePageChange} /></>
 
            )}
        </>
    );
};
export default Artworks;
