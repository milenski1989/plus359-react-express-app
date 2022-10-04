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
import CollectionsIcon from '@mui/icons-material/Collections';


const Artworks = () => {
    const [arts, setArts] = useState([]);
    const [updatedArt, setUpdatedArt] = useState({});
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editError, setEditError] = useState({ error: false, message: "" });
    const [infoShown, setInfoShown] = useState(false);
    const [imageId, setImageId] = useState(null)
    const [params, setParams] = useState('')
    const [foundItems, setFoundItems] = useState(null)
    const [viewAll, setViewAll] = useState(false)

    const handleSearch = async (value) => {
        if (value === '') return
        setLoading(true)
        const response = await fetch(`http://localhost:5000/search?author=${value}`);
        const data = await response.json();

        if (response.status === 200) {
            setFoundItems(data.results)
            setLoading(false)
        } else {
            console.log('ERROR')
            setLoading(false)
        }
    }

    const search = (params) => {
        handleSearch(params)
        setParams('')
        setViewAll(false)
    }

    const getArts = async () => {
        setLoading(true);
        const response = await fetch("http://localhost:5000/artworks");

        const data = await response.json();

        if (response.status === 200) {
            setArts(data.artworks);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        getArts();
    }, []);

    const deleteSingleArt = async (id) => {
        const response = await axios.delete(
            `http://localhost:5000/artworks/${id}`,
            { id: id }
        );

        if (response.status === 200) {
            if (foundItems) setFoundItems(foundItems.filter(art => art.id !== id))
            else setArts(arts.filter((art) => art.id !== id));
           
            setDeleting(false);
        }
    };

    const hadleDelete = (id) => {
        deleteSingleArt(id)
    };

    const editArt = async (id) => {
        const response = await axios.put(
            `http://localhost:5000/artworks/${id}`,
            updatedArt
        );

        const data = await response.data;
        if (response.status === 200) {
            setEditing(false);
            setUpdatedArt({});
            !foundItems && getArts();
        } else {
            setEditing(false);
            setUpdatedArt({});
            setEditError({ error: true, message: data.error.message.slice(0, 62) });
        }
    };

    const handleEdit = (id) => {
        setEditing(true);
        let copyOfArtDetails;
        if (foundItems) copyOfArtDetails = foundItems.find((art) => art.id === id);
        else copyOfArtDetails = arts.find((art) => art.id === id);
        setUpdatedArt({
            id: copyOfArtDetails.id,
            author: copyOfArtDetails.author,
            title: copyOfArtDetails.title,
            height: copyOfArtDetails.height,
            width: copyOfArtDetails.width,
        });
    };

    const handleSave = (id) => {
        editArt(id);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const onChangeEditableField = (e) => {
        const { name, value } = e.target;
        setUpdatedArt((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleOpenInfo = (id) => {
        setInfoShown(true)
        setImageId(id)
    }

    const handleCloseInfo = () => {
        setInfoShown(false)
        setImageId(null)
    } 

    const handleViewAll = () => {
        setViewAll(true)
        setFoundItems(null)
    }

    return (
        <>
            {
                <Message
                    open={editError.error}
                    handleClose={() => setEditError({ error: false, message: "" })}
                    message={editError.message}
                    severity="error"
                />
            }

            <SecondaryNavbar />
            
            <div>
                <Tooltip title="Show all">
                    <IconButton
                        style={{marginLeft:'0.5rem'}}
                        variant="outlined"
                        onClick={handleViewAll}
                        sx={{ marginTop: 0.75 }}
                    >
                        <CollectionsIcon/>
                    </IconButton>
                </Tooltip>
            </div>

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
                    {foundItems && !viewAll ? foundItems.map((art, id) => (
              
                        <div key={id}>
                            <Tooltip title="Show more">
                                <IconButton
                                    style={{marginBottom:'-3rem'}}
                                    variant="outlined"
                                    onClick={() => handleOpenInfo(art.id)}
                                    sx={{ marginTop: 0.75 }}
                                >
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
      
                            <Dialog open={infoShown}>
                                <DialogContent>
                                    <div className="buttonsContainer">
                                        <Tooltip title="Delete"  placement="top">
                                            <IconButton
                                                variant="outlined"
                                                onClick={() => hadleDelete(imageId)}
                                                sx={{ marginTop: 0.75 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit"  placement="top">
                                            <IconButton
                                                variant="outlined"
                                                onClick={() => handleEdit(imageId)}
                                                sx={{ marginTop: 0.75 }}
                                            >
                                                <ModeEditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {editing && imageId === updatedArt.id && (
                                            <>
                                                <Tooltip title="Save"  placement="top">
                                                    <IconButton
                                                        onClick={() => handleSave(updatedArt.id)}
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

                                    <div className="infoContainer">
                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.author
                                                    : art.author
                                            }
                                            label="Author"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="text"
                                            required={editing}
                                            name="author"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />

                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.title
                                                    : art.title
                                            }
                                            label="Title"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="text"
                                            name="title"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />

                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.height
                                                    : art.height
                                            }
                                            label="Height"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="number"
                                            required={editing}
                                            pattern="[0-9]*"
                                            name="height"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />

                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.width
                                                    : art.width
                                            }
                                            label="Width"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="number"
                                            required={editing}
                                            pattern="[0-9]*"
                                            name="width"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />
                                    </div>
                                </DialogContent>
                                <Tooltip title="Close"  placement="top">
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleCloseInfo}
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
                            <img
                                src={art.image_url}
                                alt="No Preview"
                                className="artImage"
                                style={{ width: "100%" }}
                            />
                
                        </div>
                    )) : arts.map((art, id) => (
              
                        <div key={id}>
                            <Tooltip title="Show more">
                                <IconButton
                                    style={{marginBottom:'-3rem'}}
                                    variant="outlined"
                                    onClick={() => handleOpenInfo(art.id)}
                                    sx={{ marginTop: 0.75 }}
                                >
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>

                            <Dialog open={infoShown}>
                                <DialogContent>
                                    <div className="buttonsContainer">
                                        <Tooltip title="Delete"  placement="top">
                                            <IconButton
                                                variant="outlined"
                                                onClick={() => hadleDelete(imageId)}
                                                sx={{ marginTop: 0.75 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit"  placement="top">
                                            <IconButton
                                                variant="outlined"
                                                onClick={() => handleEdit(imageId)}
                                                sx={{ marginTop: 0.75 }}
                                            >
                                                <ModeEditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {editing && imageId === updatedArt.id && (
                                            <>
                                                <Tooltip title="Save"  placement="top">
                                                    <IconButton
                                                        onClick={() => handleSave(updatedArt.id)}
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

                                    <div className="infoContainer">
                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.author
                                                    : art.author
                                            }
                                            label="Author"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="text"
                                            required={editing}
                                            name="author"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />

                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.title
                                                    : art.title
                                            }
                                            label="Title"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="text"
                                            name="title"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />

                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.height
                                                    : art.height
                                            }
                                            label="Height"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="number"
                                            required={editing}
                                            pattern="[0-9]*"
                                            name="height"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />

                                        <TextField
                                            value={
                                                editing && imageId === updatedArt.id
                                                    ? updatedArt.width
                                                    : art.width
                                            }
                                            label="Width"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="number"
                                            required={editing}
                                            pattern="[0-9]*"
                                            name="width"
                                            disabled={imageId !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)}
                                        />
                                    </div>
                                </DialogContent>
                                <Tooltip title="Close"  placement="top">
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleCloseInfo}
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
