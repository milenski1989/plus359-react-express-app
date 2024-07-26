import * as React from "react";
import { useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { ImageContext } from "../contexts/ImageContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Dialog, DialogContent } from "@mui/material";
import './ListView.css'
import { generateBackGroundColor } from "../utils/helpers";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArtInfoContainer from "../gallery/ArtInfoContainer";
import EditIcon from '../assets/edit-solid.svg'
import DownloadIcon from '../assets/download-solid.svg'
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import LocationIcon from '../assets/move-solid.svg';

const propsToShow = [
    { key: 'image_url', label: 'Image', align: 'left', isImage: true },
    { key: 'artist', label: 'Artist', align: 'center' },
    { key: 'dimensions', label: 'Dimensions', align: 'center' },
    { key: 'technique', label: 'Technique', align: 'center' },
    { key: 'cell', label: 'Cell', align: 'center' },
]


const ListView = ({searchResults,  handleIsLocationChangeDialogOpen}) => {
    const { currentImages, setCurrentImages} = useContext(ImageContext)
    const [imagePreview, setImagePreview] = useState(false)
    const [selectedArt, setSelectedArt] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null)
    const [fullInfoOpened, setFullInfoOpened] = useState(false)

    const navigate = useNavigate()

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

    const truncateInfoProp = (propKey, length) => {
        if (propKey.length > length) {
            return `${propKey.slice(0, length)}...`
        } else {
            return propKey
        }
    }

    const openFullInfoDialog = (art) => {
        setSelectedRow(art)
        setFullInfoOpened(true)
    }

    const downloadOriginalImage = (downloadUrl, name) => {
        saveAs(downloadUrl, name);
        setCurrentImages([])
    };

    const prepareImagesForLocationChange = async() => {
        handleIsLocationChangeDialogOpen(true)
    }
       
    return <>
        <div className="rows">
            {searchResults.map((art, ind) => {
                const labelId = `checkbox-list-secondary-label-${ind}`;
                return (
                    <div key={art.id} className="row">
                        <div
                            className={`row-position-container ${art.position ? 'position-text' : ''}`}
                            style={art.position ? 
                                {backgroundColor: generateBackGroundColor(art.cell)} :
                                {backgroundColor: '#5A5A5A'}
                            }>
                            <p>{art.position ? art.position : ''}</p>
                        </div>
                        <div className="row-container">
                            <div className="row-items-container">
                                {propsToShow.map(prop => (
                                    <React.Fragment key={prop.key}>
                                        {prop.isImage ? (
                                            <div className="row-image-container">
                                                <img 
                                                    onClick={() => openImageDialog(art)}
                                                    src={art[prop.key]} 
                                                    alt={art[prop.key]} 
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                id={`${labelId}-${prop.key}`}
                                                style={{ textAlign: prop.align, flex: '1 1' }}
                                            >
                                                <p>
                                                    {truncateInfoProp(art[prop.key], 25)}
                                                </p>
                                                
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                              
                                 
                                <div className="actions">
                                    <Checkbox
                                        onChange={() => checkBoxHandler(art.id)}
                                        checked={currentImages.some(image => image.id === art.id)}
                                        sx={{
                                            padding: 0,
                                            color: 'black',
                                            "&.Mui-checked": {
                                                color: "black",
                                            },
                                        }}
                                        icon={<RadioButtonUncheckedIcon />}
                                        checkedIcon={<CheckCircleOutlineIcon />}
                                    />
                                    <img 
                                        src={EditIcon} 
                                        className='icon'
                                        onClick={() => {
                                            setCurrentImages([art]);
                                            localStorage.setItem('currentImage', JSON.stringify(art));
                                            navigate('/edit-page')
                                        } }/>
                                    {currentImages.length === 1 && currentImages[0].id === art.id ?
                                        <img 
                                            src={DownloadIcon} 
                                            className='icon'
                                            onClick={() => downloadOriginalImage(art.download_url, art.download_key)}/>
                                        :
                                        <></>
                                    }
                                    {currentImages.length === 1 && currentImages[0].id === art.id &&   <img 
                                        src={LocationIcon} 
                                        className='icon' 
                                        onClick={prepareImagesForLocationChange}/>}
                                    <MoreHorizIcon 
                                        onClick={() => openFullInfoDialog(art)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    
        {selectedArt && (
            <Dialog open={imagePreview} onClose={() => setImagePreview(false)}>
                <img onClick={() => setImagePreview(false)} src={selectedArt.image_url} style={{ width: "100%", height: "auto" }} />
            </Dialog>
        )}
          
        {fullInfoOpened && (
            <Dialog 
                open={fullInfoOpened} 
                onClose={() => setFullInfoOpened(false)}>
                <DialogContent>
                    <ArtInfoContainer art={selectedRow} />
                </DialogContent>
            </Dialog>
        )}
    </>   
}

export default ListView
