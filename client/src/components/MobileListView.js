import * as React from "react";
import { useContext, useState, useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ActionButtons from "./ActionButtons";
import { ImageContext } from "./contexts/ImageContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Dialog, DialogContent } from "@mui/material";
import './ListView.css'
import { generateBackGroundColor } from "./constants/constants";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditableContainer from "./EditableContainer";

const properties = [
    { key: 'image_url', label: 'Image', align: 'center', isImage: true },
    { key: 'artist', label: 'Artist', align: 'center' },
    { key: 'dimensions', label: 'Dimensions', align: 'center' },
];

const MobileListView = ({searchResults, handleDialogOpen, handleSearchResults}) => {
    const {currentImages, setCurrentImages} = useContext(ImageContext)
    const [imagePreview, setImagePreview] = useState(false)
    const [fullInfoOpened, setFullInfoOpened] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null)
    const [showCheckbox, setShowCheckbox] = useState(false);

    const timeoutRef = useRef(null);

    const checkBoxHandler = (id) => {
        if (currentImages.some(image => image.id === id)) {
            setCurrentImages(currentImages.filter(image => image.id !== id));
        } else {
            setCurrentImages([...currentImages, searchResults.find(image => image.id === id)]);
        }
    }

    const openImagePreviewDialog = (art) => {
        if (!showCheckbox) {
            setSelectedImage(art);
            setImagePreview(true);
        }
    };

    const openFullInfoDialog = (art) => {
        setSelectedRow(art)
        setFullInfoOpened(true)
    }

    const truncateInfoProp = (propKey, symbolsCount) => {
        if (propKey.length > symbolsCount) {
            return `${propKey.slice(0, symbolsCount)}...`
        } else {
            return propKey
        }
    }

    const handleLongPress = () => {
        setShowCheckbox(true);
    };
  
    const handleMouseDown = () => {
        timeoutRef.current = setTimeout(handleLongPress, 700);
    };
  
    const handleMouseUp = () => {
        clearTimeout(timeoutRef.current);
    };

    return <>
        <List dense sx={{ width: "100%", maxWidth: "100vw", bgcolor: "background.paper" }}>
            {searchResults.map((art, ind) => {
                const labelId = `checkbox-list-secondary-label-${ind}`;
                return (
                    <div key={art.id} className="mobile-list-item-container">
                        <div className={art.position ? "mobile-position-container" : "mobile-position-container black-text"} style={art.position ? 
                            {backgroundColor: generateBackGroundColor(art.cell)} :
                            {backgroundColor: '#F7F9FA'}
                        }>
                            <p >{art.position}</p>
                        </div>
                        <ListItem
                            className='mobile-list-item'
                            disablePadding
                        >
                            <div className="mobile-list-item-elements"
                            >
                                {properties.map(prop => (
                                    <React.Fragment key={prop.key}>
                                        {prop.isImage ? (
                                            <div className="mobile-image-checkbox-container">
                                                <img 
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseLeave={handleMouseUp}
                                                    onClick={() => openImagePreviewDialog(art)}
                                                    style={{
                                                        width: '70px', 
                                                        height: '70px', 
                                                        objectFit: "cover", 
                                                    }} 
                                                    src={art[prop.key]} 
                                                    alt={art[prop.key]} />
                                                {showCheckbox &&
                                                          <Checkbox
                                                              onChange={() => checkBoxHandler(art.id)}
                                                              checked={currentImages.some(image => image.id === art.id)}
                                                              sx={{
                                                                  position: "absolute",
                                                                  top: "50%",
                                                                  left: "50%",
                                                                  transform: "translate(-50%, -50%)",
                                                                  color: 'white',
                                                                  "&.Mui-checked": {
                                                                      color: "white",
                                                                  },
                                                              }}
                                                              icon={<RadioButtonUncheckedIcon />}
                                                              checkedIcon={<CheckCircleOutlineIcon />}
                                                          />
                                                }
                                          
                                            </div>
                                        
                                        ) : (
                                       
                                            <ListItemText
                                                id={`${labelId}-${prop.key}`}
                                                sx={{
                                                    textAlign: prop.align,
                                                    '&.MuiListItemText-root': {
                                                        marginRight: '0.5rem'
                                                    }
                                                }}
                                                primary={
                                                    <p className="mobile-info-text">
                                                        {art[prop.key] === art.artist ? 
                                                            truncateInfoProp(art[prop.key], 10): 
                                                            truncateInfoProp(art[prop.key], 8)}</p> 
                                                }
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                                <MoreHorizIcon 
                                    sx={{marginRight: "0.3rem"}}
                                    onClick={() => openFullInfoDialog(art)}
                                />
                        
                            </div>
                        </ListItem>
                    </div>
                );
            })}
        </List>

        {selectedImage && (
            <Dialog open={imagePreview} onClose={() => setImagePreview(false)}>
                <img onClick={() => setImagePreview(false)} src={selectedImage.image_url} style={{ width: "100%", height: "auto" }} />
            </Dialog>
        )}
        {fullInfoOpened && (
            <Dialog 
                open={fullInfoOpened} 
                onClose={() => setFullInfoOpened(false)}>
                <DialogContent>
                    <ActionButtons
                        art={selectedRow}
                        handleDialogOpen={handleDialogOpen}
                        searchResults={searchResults}
                        handleSearchResults={handleSearchResults}
                    />
                    <EditableContainer art={selectedRow} />
                </DialogContent>
            </Dialog>
        )
        }
    </>
}

export default MobileListView
