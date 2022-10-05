import React, { useEffect, useState } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Artworks.css";
import "./App.css";
import Message from "./Message";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton, InputBase, Paper, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import MyDialog from "./MyDialog";
import Loader from "./Loader";

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
        const response = await fetch(`http://localhost:5000/api/search?author=${value}`);
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
        const response = await fetch("http://localhost:5000/api/artworks");

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
        else  {
            const searchDelay = setTimeout(() => {
                search(params)
            }, 2000)
          
            return () => clearTimeout(searchDelay)
        }
    }, [params]);

    const deleteSingleArt = async (id) => {
        const response = await axios.delete(
            `http://localhost:5000/api/artworks/${id}`,
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
            `http://localhost:5000/api/artworks/${id}`,
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
                <Loader/>
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
