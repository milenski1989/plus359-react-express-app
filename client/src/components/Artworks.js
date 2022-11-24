import React, { useEffect, useState } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Artworks.css";
import "./App.css";
import InfoIcon from "@mui/icons-material/Info";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import MyDialog from "./MyDialog";

const Artworks = () => {
    const [arts, setArts] = useState([]);
    const [updatedEntry, setUpdatedEntry] = useState({});
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
    const [editMode, setEditMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null)
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (e) => {
        const {value} = e.target
        const resultsArray = arts.filter(art => {
            if (
                art.artist.includes(value) || art.title.includes(value) || art.image_key.includes(value) || art.technique.includes(value) ||
                art.dimensions.includes(value) || art.notes.includes(value) || art.storageLocation.includes(value) ||
                art.cell.includes(value) || art.position.toString().includes(value)
            ) return true;
           
        })

        console.log(resultsArray)

        setSearchResults(resultsArray)
    }

    const getArts = async () => {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/artworks");
        const data = await res.json();

        if (res.status === 200) {
            setArts(data.artworks)
            setSearchResults(data.artworks)
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        getArts()
    }, []);

    const deleteSingleArt = async (filename, id) => {

        await axios.delete( `http://localhost:5000/api/artworks/${filename}`,
            {filename: filename})

     
        const response = await axios.delete(
            `http://localhost:5000/api/artworks/${id}`,
            { id: id }
        );
        
        if (response.status === 200) {
            getArts()
            setSearchResults(arts.filter((art) => art.id !== id));
            setDeleting(false);
        }
    };

    const hadleDelete = (filename, id) => {
        deleteSingleArt(filename, id)
        setOpenDeleteConfirmation(false)
        setIsModalOpen(false)
    };

    const editArt = async (id) => {
        const response = await axios.put(
            `http://localhost:5000/api/artworks/${id}`,
            updatedEntry
        );

        if (response.status === 200) {
            setEditMode(false);
            setUpdatedEntry({});
            getArts();
        } else {
            setEditMode(false);
            setUpdatedEntry({});
        }
    };

    const handleEdit = (id) => {
        setEditMode(true);
        let copyOfArtInfo;
        copyOfArtInfo = searchResults.find((art) => art.id === id);
        setUpdatedEntry({
            id: copyOfArtInfo.id,
            artist: copyOfArtInfo.artist,
            title: copyOfArtInfo.title,
            technique: copyOfArtInfo.technique,
            dimensions: copyOfArtInfo.dimensions,
            price: copyOfArtInfo.price,
            notes: copyOfArtInfo.notes,
            storageLocation: copyOfArtInfo.storageLocation,
            cell: copyOfArtInfo.cell,
            position: copyOfArtInfo.position
        });
    };

    const handleSave = (id) => {
        editArt(id);
        setIsModalOpen(false)
        getArts()
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleChangeEditableField = (e) => {
        const { name, value } = e.target;
        setUpdatedEntry((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleOpenModal = (art) => {
        setIsModalOpen(true)
        setImage(art)
    }

    const handleCloseModal = () => {
        setIsModalOpen(prev => !prev)
        setEditMode(false)
        setImage(null)
    } 
 
    return (
        <>
            <MyDialog
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                image={image}
                editMode={editMode}
                updatedEntry={updatedEntry}
                handleChangeEditableField={handleChangeEditableField}
            >
                <div className="buttonsContainer">
                    <Tooltip title="Delete"  placement="top">
                        <IconButton
                            variant="outlined"
                            onClick={() => setOpenDeleteConfirmation(true) }
                            sx={{ marginTop: 0.75 }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit"  placement="top">
                        <IconButton
                            variant="outlined"
                            onClick={() => handleEdit(image.id)}
                            sx={{ marginTop: 0.75 }}
                        >
                            <ModeEditIcon />
                        </IconButton>
                    </Tooltip>

                    {editMode && image.id === updatedEntry.id && (
                        <>
                            <Tooltip title="Save" placement="top">
                                <IconButton
                                    onClick={() => handleSave(updatedEntry.id)}
                                    sx={{ marginTop: 0.75 }}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Cancel"  placement="top">
                                <IconButton
                                    onClick={handleCancel}
                                    sx={{ marginTop: 0.75 }}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </div>
            </MyDialog>

            {
                <Dialog
                    open={openDeleteConfirmation}
                    onClose={() => setOpenDeleteConfirmation(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to delete the entry ?"}
                    </DialogTitle>
                    <DialogContent>
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => hadleDelete(image.image_key, image.id)}>Yes</Button>
                        <Button onClick={() => setOpenDeleteConfirmation(false)} autoFocus>
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
                        onChange={handleSearch}
                    />
                    <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>

            {loading || deleting ? (
                <CircularProgress className="loader" color="primary" />
            ) : (
                <div className="gallery">
                    {searchResults.map((art, id) => ( 
               
                        <div key={id}>
                            
                            <div className="imageContainer">
                                <Tooltip className="infoButtonContainer" title="Show more">
                                    <IconButton
                                        style={{marginBottom:'-3rem'}}
                                        variant="outlined"
                                        onClick={() => handleOpenModal(art)}
                                        sx={{ marginTop: 0.75 }}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                                <img
                                    src={art.image_url}
                                    alt="No Preview"
                                    className="artImage"
                                    style={{ width: "100%" }}
                                /> 
                                <div className="numberLabel">{art.position}</div> </div>
                        </div>
                        
                    ))}
                </div>
            )}
        </>
    );
};
export default Artworks;
