import * as React from "react";
import { useContext, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ActionButtons from "./ActionButtons";
import { ImageContext } from "./contexts/ImageContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Dialog } from "@mui/material";
import './ListView.css'

const ListView = ({searchResults, handleDialogOpen, page, sortField, sortOrder, handleSearchResults, handlePagesCount, handleTotalCount, handleError, handleLoading}) => {
    const {isEditMode, setUpdatedEntry, currentImages, setCurrentImages} = useContext(ImageContext)
    const [imagePreview, setImagePreview] = useState(false)
    const [selectedArt, setSelectedArt] = useState(null);
    const checkBoxHandler = (e, id) => {
        const index = searchResults.findIndex(art => art.id === id)
        if (e.target.checked) {
           
            setCurrentImages(prev => [...new Set(prev).add(searchResults[index])])
        } else {
            setCurrentImages(prev => [...prev.filter(image => image.id !== id )])
        }
    }
    
    const onChangeEditableInput = (event) => {
        const { name, value } = event.target;
        setUpdatedEntry((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const openImageDialog = (art) => {
        setSelectedArt(art);
        setImagePreview(true);
    };

    return <>
        <List
            dense
            sx={{ width: "100%", maxWidth: "100vw", bgcolor: "background.paper", display: 'flex'}}
        >
        </List>
        <List
            dense
            sx={{ width: "100%", maxWidth: "100vw", bgcolor: "background.paper" }}
        >
            {searchResults.map((art, ind) => {
                const labelId = `checkbox-list-secondary-label-${ind}`;

                return <>
                    <ListItem
                        sx={{
                            marginBottom: "0.5rem",
                            borderRadius: "10px",
                            "&:hover": {
                                backgroundColor: "black",
                            },
                        }}
                        key={art.id}
                        disablePadding
                    >
                        <ListItemButton
                            sx={{
                                color: "black",
                                backgroundColor: '#F7F9FA',
                                borderRadius: '10px',
                                boxShadow: '0px 0px 19.100000381469727px 0px rgba(0, 0, 0, 0.25)',
                                "&:hover": {
                                    backgroundColor: "#D5E8F2",
                                }
                            }}
                        >
                            <Checkbox
                                onChange={(e) => checkBoxHandler(e, art.id)}
                                sx={{
                                    "&.Mui-checked": {
                                        color: "black",
                                    },
                                }}
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<CheckCircleOutlineIcon />}
                            />
                            <ListItemText
                                id={labelId}
                                primary={art.position}
                                sx={{ textAlign: "center"}}
                            />
                            <img onClick={() => openImageDialog(art)} style={{width: '70px', height: '70px', objectFit: "cover"}} src={art.image_url} />
                            <ListItemText
                                id={labelId}
                                primary={!isEditMode && art.artist}
                                secondary={isEditMode && currentImages.length && currentImages[0].id === art.id && 
                                    <>
                                        <label>{art.artist}</label>
                                        <input className="editable-input" onChange={(event) => onChangeEditableInput(event)} />
                                    </>}
                                sx={{textAlign: "center" }}
                            />

                            <ListItemText
                                id={labelId}
                                primary={!isEditMode && art.title}
                                secondary={isEditMode && currentImages.length && currentImages[0].id === art.id &&
                                    <>
                                        <label>{art.title}</label>
                                        <input className="editable-input" onChange={(event) => onChangeEditableInput(event)} />
                                    </>}
                                sx={{ textAlign: "center" }}
                            />

                            <ListItemText
                                id={labelId}
                                primary={!isEditMode && art.technique}
                                secondary={isEditMode && currentImages.length && currentImages[0].id === art.id && 
                                    <>
                                        <label>{art.technique}</label>
                                        <input className="editable-input" onChange={(event) => onChangeEditableInput(event)} />
                                    </>}
                                sx={{ textAlign: "center" }}
                            />

                            <ListItemText
                                id={labelId}
                                primary={!isEditMode && art.dimensions}
                                secondary={isEditMode && currentImages.length && currentImages[0].id === art.id && 
                                    <>
                                        <label>{art.dimensions}</label>
                                        <input className="editable-input" onChange={(event) => onChangeEditableInput(event)} />
                                    </>}
                                sx={{ textAlign: "center" }}
                            />  

                            <ListItemText
                                id={labelId}
                                primary={!isEditMode && art.price}
                                secondary={isEditMode && currentImages.length && currentImages[0].id === art.id &&  
                                    <>
                                        <label>{art.price}</label>
                                        <input className="editable-input" onChange={(event) => onChangeEditableInput(event)} />
                                    </>}
                                sx={{ textAlign: "center" }}
                            />  

                            <ListItemText
                                id={labelId}
                                primary={!isEditMode && art.notes}
                                secondary={isEditMode && currentImages.length && currentImages[0].id === art.id &&  
                                    <>
                                        <label>{art.notes}</label>
                                        <input className="editable-input" onChange={(event) => onChangeEditableInput(event)} />
                                    </>}
                                sx={{ textAlign: "center" }}
                            />  

                            <ListItemText
                                id={labelId}
                                primary={art.storageLocation}
                                sx={{ textAlign: "center" }}
                            />  
                            <ActionButtons 
                                art={art}
                                handleDialogOpen={handleDialogOpen}
                                searchResults={searchResults}
                                page={page} 
                                sortField={sortField}
                                sortOrder={sortOrder} 
                                handleSearchResults={handleSearchResults}
                                handlePagesCount={handlePagesCount} 
                                handleTotalCount={handleTotalCount}
                                handleError={handleError}
                                handleLoading={handleLoading}
                            />
                        </ListItemButton>
                    </ListItem>
                </>;
            })}
        </List>
        {selectedArt && (
            <Dialog open={imagePreview} onClose={() => setImagePreview(false)}>
                <img onClick={() => setImagePreview(false)} src={selectedArt.image_url} style={{ width: "100%", height: "auto" }} />
            </Dialog>
        )}
    </>
}

export default ListView
