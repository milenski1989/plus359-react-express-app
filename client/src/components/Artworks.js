import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Artworks.css";
import "./App.css";
import Message from "./Message";
import InfoIcon from "@mui/icons-material/Info";
import {
    Dialog,
    DialogContent,
    IconButton,
    InputBase,
    Paper,
    TextField,
    Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

const MyDialog = ({isModalOpen, handleCloseModal, children, image, editMode, updatedEntry, handleChangeEditableField}) => {
    if (image) {
        return (
            <Dialog open={isModalOpen}>
                <DialogContent>
                    {children}
    
                    <div className="infoContainer">
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.author
                                    : image.author
                            }
                            label="Author"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            required={editMode}
                            name="author"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
    
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.title
                                    : image.title
                            }
                            label="Title"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="title"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
    
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.height
                                    : image.height
                            }
                            label="Height"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="number"
                            required={editMode}
                            pattern="[0-9]*"
                            name="height"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
    
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.width
                                    : image.width
                            }
                            label="Width"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="number"
                            required={editMode}
                            pattern="[0-9]*"
                            name="width"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
                    </div>
                </DialogContent>
                <Tooltip title="Close"  placement="top">
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
    
            </Dialog>
        )
    }
   
}

const Artworks = () => {
    const [arts, setArts] = useState([]);
    const [updatedEntry, setUpdatedEntry] = useState({});
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editError, setEditError] = useState({ error: false, message: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null)
    const [params, setParams] = useState('')

    const handleSearchItems = async (value) => {
        if (value === '') return
        setLoading(true)
        const response = await fetch(`https://app.plus359gallery.eu/api/search?author=${value}`);
        const data = await response.json();

        if (response.status === 200) {
            setArts(data.results)
            setLoading(false)
        } else {
            console.log('ERROR')
            setLoading(false)
        }
    }

    const search = (params) => {
        handleSearchItems(params)
    }

    const getArts = async () => {
        setLoading(true);
        const response = await fetch("https://app.plus359gallery.eu/api/artworks");

        const data = await response.json();

        if (response.status === 200) {
            setArts(data.artworks);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params === '') getArts();
        else  search(params)
    }, [params]);

    const deleteSingleArt = async (id) => {
        const response = await axios.delete(
            `https://app.plus359gallery.eu/api/artworks/${id}`,
            { id: id }
        );

        if (response.status === 200) {
            setArts(arts.filter((art) => art.id !== id));
            setDeleting(false);
        }
    };

    const hadleDelete = (id) => {
        deleteSingleArt(id)
        setIsModalOpen(false)
    };

    const editArt = async (id) => {
        const response = await axios.put(
            `https://app.plus359gallery.eu/api/artworks/${id}`,
            updatedEntry
        );

        const data = await response.data;
        if (response.status === 200) {
            setEditMode(false);
            setUpdatedEntry({});
            getArts();
        } else {
            setEditMode(false);
            setUpdatedEntry({});
            setEditError({ error: true, message: data.error.message.slice(0, 62) });
        }
    };

    const handleEdit = (id) => {
        setEditMode(true);
        let copyOfArtDetails;
        copyOfArtDetails = arts.find((art) => art.id === id);
        setUpdatedEntry({
            id: copyOfArtDetails.id,
            author: copyOfArtDetails.author,
            title: copyOfArtDetails.title,
            height: copyOfArtDetails.height,
            width: copyOfArtDetails.width,
        });
    };

    const handleSave = (id) => {
        editArt(id);
        setIsModalOpen(false)
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
        setIsModalOpen(false)
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
                            onClick={() => hadleDelete(image.id)}
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
                <Message
                    open={editError.error}
                    handleClose={() => setEditError({ error: false, message: "" })}
                    message={editError.message}
                    severity="error"
                />
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
                        value={params}
                        onChange={(e) => setParams(e.target.value)}
                        name="param"
                    />
                    <IconButton type="button" name="author" onClick={() => search(params)} sx={{ p: "10px" }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>

            {loading || deleting ? (
                <div className="loader">
                    <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#78FECF"
                        ariaLabel="three-dots-loading"
                        visible={true}
                    />
                </div>
            ) : (
                <div className="gallery">
                    {arts.map((art, id) => ( 
              
                        <div key={id}>
                            <Tooltip title="Show more">
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
                          
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
export default Artworks;
