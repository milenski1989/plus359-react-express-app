import React, {  useEffect, useState } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Artworks.css";
import "./App.css";
import InfoIcon from "@mui/icons-material/Info";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Tooltip } from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import MyDialog from "./MyDialog";
import { saveAs } from 'file-saver'
import Message from "./Message";
import SuperUserButtons from "./SuperUserButtons";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { yellow, green } from '@mui/material/colors';

const Artworks = () => {

    const user = JSON.parse(localStorage.getItem('user')); 

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

    //GET entries
    const getAllEntries = async () => {
        console.log('invoked function')
        setLoading(true);
        const res = await fetch("https://app.plus359gallery.com/api/artworks");
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

    //download original image
    const downloadImage = (downloadUrl, name ) => {
        saveAs(downloadUrl, name)
    }

    useEffect(() => {
        getAllEntries()
    }, []);

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

        await axios.delete(`https://app.plus359gallery.com/api/artworks/${originalFilename}`,
            {originalFilename})

        await axios.delete(`https://app.plus359gallery.com/api/artworks/${filename}`,{filename})
        const response = await axios.delete(
            `https://app.plus359gallery.com/api/artworks/${id}`,
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
                handleChangeEditableField={handleChangeEditableField}
            >
                { user.superUser ? 
                    <SuperUserButtons
                        currentImage={currentImage}
                        searchResults={searchResults}
                        updatedEntry={updatedEntry}
                        openDeleteConfirmationDialog={setIsDeleteConfOpen}
                        isEditMode={isEditMode}
                        downloadImage={downloadImage}
                        openEditMode={setIsEditMode}
                        setEntryToUpdate={setUpdatedEntry}
                        closeInfoModal={setIsInfoModalOpen}
                        getAllEntries={getAllEntries}
                    
                    />  :
                    <> </>               
                }
              
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
                <div className="gallery">
                    {searchResults.map((art, id) => ( 
                        
                        <div className="galleryItem" key={id}>
                            <span className="imagePositionLabel">{art.position}</span>
                            <img
                                className="galleryImage"
                                src={art.image_url}
                                alt="no preview" />

                            <div className="imageButtons">
                                <div>
                                    <Tooltip title="Show more">
                                        <IconButton
                                            variant="outlined"
                                            onClick={() => handleOpenInfoModal(art)}
                                            sx={{ marginTop: 0.75 }}
                                        >
                                            <InfoIcon fontSize="medium" color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </div>

                                <div>
                                    <Tooltip title="Download" placement="top">
                                        <IconButton
                                            variant="outlined"
                                            onClick={() => downloadImage(art.download_url, art.download_key)}
                                            sx={{ marginTop: 0.75 }}
                                        >
                                            <FileDownloadIcon fontSize="medium" color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                {
                                    art.onWall || art.inExhibition ?
                                        <div>
                                            <Tooltip title={art.onWall && "on a wall" || art.inExhibition && "in exhibition"} placement="top">
                                                <span>
                                                    <IconButton disabled>
                                                        <CheckCircleIcon sx={{ color: art.onWall && yellow[500] || art.inExhibition && green[500] }} />
                                                    </IconButton>
                                                </span>
                                               
                                            </Tooltip>
                                        </div> : <></>
                                }
                            </div>
                        </div>
                    ))}
                </div>
 
            )}
        </>
    );
};
export default Artworks;
