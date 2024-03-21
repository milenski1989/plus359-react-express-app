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
import { Dialog, DialogContent } from "@mui/material";
import './ListView.css'
import { generateBackGroundColor } from "./constants/constants";

const properties = [
    { key: 'position', label: 'Position', align: 'center' },
    { key: 'image_url', label: 'Image', align: 'center', isImage: true },
    { key: 'artist', label: 'Artist', align: 'center' },
    { key: 'title', label: 'Title', align: 'center' },
    { key: 'dimensions', label: 'Dimensions', align: 'center' },
    { key: 'technique', label: 'Technique', align: 'center' },
    { key: 'price', label: 'Price', align: 'center' },
    { key: 'notes', label: 'Notes', align: 'center' },
    { key: 'storageLocation', label: 'Storage Location', align: 'center' }
];

const ListView = ({searchResults, handleDialogOpen, handleSearchResults}) => {
    const {isEditMode, updatedEntry, setUpdatedEntry, currentImages, setCurrentImages} = useContext(ImageContext)
    const [imagePreview, setImagePreview] = useState(false)
    const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false)
    const [selectedArt, setSelectedArt] = useState(null);
    const [selectedProp, setSelectedProp] = useState(null)

    const checkBoxHandler = (id) => {
        if (currentImages.some(image => image.id === id)) {
            setCurrentImages(currentImages.filter(image => image.id !== id));
        } else {
            setCurrentImages([...currentImages, searchResults.find(image => image.id === id)]);
        }
    }
    
    const onChangeEditableInput = (event, property) => {
        const { value } = event.target;
        setUpdatedEntry((prevState) => ({
            ...prevState,
            [property]: value,
        }));
    };

    const openImageDialog = (art) => {
        setSelectedArt(art);
        setImagePreview(true);
    };

    const showAll = (propKey) => {
        if (propKey.length <=10) return;
        setSelectedProp(propKey)
        setIsMoreInfoOpen(true)
    }

    const truncateInfoProp = (propKey) => {
        if (propKey.length > 10) {
            return `${propKey.slice(0, 10)}...`
        } else {
            return propKey
        }
    }

    return <>
        <List dense sx={{ width: "100%", maxWidth: "100vw", bgcolor: "background.paper" }}>
            {searchResults.map((art, ind) => {
                const labelId = `checkbox-list-secondary-label-${ind}`;

                return (
                    <ListItem
                        sx={{
                            "&:hover": {
                                backgroundColor: "black",
                            },
                        }}
                        className={'list-item'}
                        key={art.id}
                        disablePadding
                    >
                        <ListItemButton
                            sx={{
                                color: "black",
                                backgroundColor: '#F7F9FA',
                                borderRadius: '10px',
                                boxShadow: '0px 0px 19.100000381469727px 0px rgba(0, 0, 0, 0.25)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(11, 9%)',
                                "&:hover": {
                                    backgroundColor: "#D5E8F2",
                                }
                            }}
                        >
                            <Checkbox
                                onChange={() => checkBoxHandler(art.id)}
                                checked={currentImages.some(image => image.id === art.id)}
                                sx={{
                                    justifySelf:  "flex-start",
                                    "&.Mui-checked": {
                                        color: "black",
                                    },
                                }}
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<CheckCircleOutlineIcon />}
                            />

                            {properties.map(prop => (
                                <React.Fragment key={prop.key}>
                                    {prop.isImage ? (
                                        <img onClick={() => openImageDialog(art)} style={{ width: '70px', height: '70px', objectFit: "cover" }} src={art[prop.key]} alt={art[prop.key]} />
                                    ) : (
                                        <ListItemText
                                            id={`${labelId}-${prop.key}`}
                                            primary={
                                                isEditMode && currentImages.length && currentImages[0].id === art.id && art[prop.key] !== currentImages[0].position ? (
                                                    
                                                    <input 
                                                        className="list-view-editable-input" 
                                                        value={updatedEntry[prop.key] || currentImages[0][prop.key]} 
                                                        onChange={(event) => onChangeEditableInput(event, prop.key)}
                                                    />
                                                    
                                                ) : (
                                                    art.position && art[prop.key] === art.position && art.position !== 0 ?
                                                        <div
                                                            style={{backgroundColor: generateBackGroundColor(art.cell), 
                                                                color: "white", 
                                                                height: "auto",
                                                                marginRight: "3rem",
                                                                padding: "1rem"
                                                            }}>
                                                            <p  className='full-info'>
                                                                {art[prop.key]}
                                                            </p>
                                                        </div>
                                                        :
                                                        <p  
                                                            className={art[prop.key].length > 10 ? 'truncated-art-info' : 'full-info'}
                                                            onClick={() => showAll(art[prop.key])}>
                                                            {truncateInfoProp(art[prop.key])}
                                                        </p>
                                                )
                                            }
                                            sx={{ textAlign: prop.align }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}

                            <ActionButtons
                                art={art}
                                handleDialogOpen={handleDialogOpen}
                                searchResults={searchResults}
                                handleSearchResults={handleSearchResults}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>

        {selectedArt && (
            <Dialog open={imagePreview} onClose={() => setImagePreview(false)}>
                <img onClick={() => setImagePreview(false)} src={selectedArt.image_url} style={{ width: "100%", height: "auto" }} />
            </Dialog>
        )}
        {isMoreInfoOpen && (
            <Dialog 
                open={isMoreInfoOpen} 
                onClose={() => setIsMoreInfoOpen(false)}>
                <DialogContent >
                    <p>{selectedProp}</p>
                </DialogContent>
            </Dialog>
        )
        }
    </>
}

export default ListView
