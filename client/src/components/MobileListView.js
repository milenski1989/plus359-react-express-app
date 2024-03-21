import * as React from "react";
import { useContext, useState, useEffect } from "react";
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
    { key: 'position', label: 'Position', align: 'center' },
    { key: 'image_url', label: 'Image', align: 'center', isImage: true },
    { key: 'artist', label: 'Artist', align: 'center' },
    { key: 'dimensions', label: 'Dimensions', align: 'center' },
];

const MobileListView = ({searchResults, handleDialogOpen, handleSearchResults}) => {
    const {currentImages, setCurrentImages} = useContext(ImageContext)
    const [imagePreview, setImagePreview] = useState(false)
    const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false)
    const [selectedArt, setSelectedArt] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null)
    const [copyOfResults, setCopyOfResults] = useState([])

    useEffect(() => {
        if (searchResults.length) {
            const _copyOfResults = []
            for (let result of searchResults) {
                const newObj =  {
                    ['id']: result.id,
                    ['position']: result.position,
                    ['cell']: result.cell,
                    ['image_url']: result.image_url, 
                    ['download_key']: result.download_key,
                    ['download_url']: result.download_url,
                    ['artist']: result.artist, 
                    ['dimensions']: result.dimensions,
                    ['title']: result.title,
                    ['technique']: result.technique,
                    ['price']: result.price,
                    ['notes']: result.notes,
                    ['location']: result.storageLocation,  
                }

                _copyOfResults.push(newObj)
            }

            setCopyOfResults(_copyOfResults)
        }
    },[searchResults])

    const checkBoxHandler = (id) => {
        if (currentImages.some(image => image.id === id)) {
            setCurrentImages(currentImages.filter(image => image.id !== id));
        } else {
            setCurrentImages([...currentImages, searchResults.find(image => image.id === id)]);
        }
    }

    const openImageDialog = (art) => {
        setSelectedArt(art);
        setImagePreview(true);
    };

    const showAll = (art) => {
        setSelectedRow(art)
        setIsMoreInfoOpen(true)
    }

    const truncateInfoProp = (propKey, symbolsCount) => {
        if (propKey.length > symbolsCount) {
            return `${propKey.slice(0, symbolsCount)}...`
        } else {
            return propKey
        }
    }

    return <>
        <List dense sx={{ width: "100%", maxWidth: "100vw", bgcolor: "background.paper" }}>
            {copyOfResults.map((art, ind) => {
                const labelId = `checkbox-list-secondary-label-${ind}`;
                return (
                    <ListItem
                        sx={{
                            "&:hover": {
                                backgroundColor: "black",
                            },
                        }}
                        className='mobile-list-item'
                        key={art.id}
                        disablePadding
                    >
                        <div
                            style={{
                                color: "black",
                                backgroundColor: '#F7F9FA',
                                borderRadius: '10px',
                                boxShadow: '0px 0px 19.100000381469727px 0px rgba(0, 0, 0, 0.25)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                "&:hover": {
                                    backgroundColor: "#F7F9FA",
                                },
                            }}
                        >
                            <Checkbox
                                onChange={() => checkBoxHandler(art.id)}
                                checked={currentImages.some(image => image.id === art.id)}
                                sx={{
                                    justifySelf: "flex-start",
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
                                        <img 
                                            onClick={() => openImageDialog(art)} 
                                            style={{
                                                width: '70px', 
                                                height: '70px', 
                                                objectFit: "cover", 
                                            }} 
                                            src={art[prop.key]} 
                                            alt={art[prop.key]} />
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
                                              
                                                art.position && art[prop.key] === art.position ?
                                                    <p
                                                        style={{backgroundColor: generateBackGroundColor(art.cell), 
                                                            color: "white", 
                                                            padding: "0.5rem 0.3rem",
                                                        }}>
                                                        {art[prop.key]}
                                                    </p>
                                                    :
                                                    !art.position && art[prop.key] === art.position ?
                                                        null :
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
                                onClick={() => showAll(art)}
                            />
                        
                        </div>
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
