import * as React from "react";
import { useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { ImageContext } from "../contexts/ImageContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Dialog, DialogContent } from "@mui/material";
import './ListView.css'
import { checkBoxHandler, downloadOriginalImage, generateBackGroundColor } from "../utils/helpers";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArtInfoContainer from "../gallery/ArtInfoContainer";
import EditIcon from '../assets/edit-solid.svg'
import DownloadIcon from '../assets/download-solid.svg'
import { useNavigate } from "react-router-dom";
import LocationIcon from '../assets/move-solid.svg';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const ListView = ({ searchResults, handleIsLocationChangeDialogOpen, handleDialogOpen }) => {
    const { currentImages, setCurrentImages } = useContext(ImageContext)
    const [imagePreview, setImagePreview] = useState(false)
    const [selectedArt, setSelectedArt] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null)
    const [fullInfoOpened, setFullInfoOpened] = useState(false)

    const navigate = useNavigate()

    const openImageDialog = (art) => {
        setSelectedArt(art);
        setImagePreview(true);
    };

    const truncateInfoProp = (propValue, length) => {
        if (propValue.length > length) {
            return `${propValue.slice(0, length)}...`
        } else {
            return propValue
        }
    }

    const openFullInfoDialog = (art) => {
        setSelectedRow(art)
        setFullInfoOpened(true)
    }

    const prepareImagesForLocationChange = async () => {
        handleIsLocationChangeDialogOpen(true)
    }

    return (
        <>
            <div className="rows">
                {searchResults.map((art, ind) => {
                    const labelId = `checkbox-list-secondary-label-${ind}`;
                    return (
                        <div className="row-container" key={labelId}>
                            <div
                                className={`row-position-container ${art.position ? 'position-text' : ''}`}
                                style={art.position ?
                                    { backgroundColor: generateBackGroundColor(art.cell) } :
                                    { backgroundColor: '#5A5A5A' }}>
                                <p>{art.position ? art.position : ''}</p>
                            </div>
                            <img
                                className="row-image"
                                onClick={() => openImageDialog(art)}
                                src={art.image_url}
                                alt="list-item-image" />
                            <div style={{ textAlign: 'center', flex: '1 1' }}>
                                <p>{truncateInfoProp(art.artist, 25)}</p>
                            </div>
                            <div style={{ textAlign: 'center', flex: '1 1' }}>
                                <p>{truncateInfoProp(art.dimensions, 25)}</p>
                            </div>
                            <div style={{ textAlign: 'center', flex: '1 1' }}>
                                <p>{truncateInfoProp(art.technique, 25)}</p>
                            </div>
                            <div style={{ textAlign: 'center', flex: '1 1' }}>
                                <p>{truncateInfoProp(art.cell, 25)}</p>
                            </div>
                            <div className="row-actions"> 
                                <Checkbox
                                    onChange={() => checkBoxHandler(currentImages, setCurrentImages, searchResults, art.id)}
                                    checked={currentImages.some(image => image.id === art.id)}
                                    sx={{
                                        padding: 0,
                                        color: 'black',
                                        "&.Mui-checked": {
                                            color: "black",
                                        },
                                    }}
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<CheckCircleOutlineIcon />} />
                                <img
                                    src={EditIcon}
                                    className='icon'
                                    onClick={() => {
                                        setCurrentImages([art]);
                                        localStorage.setItem('currentImage', JSON.stringify(art));
                                        navigate('/edit-page');
                                    }} />
                                {currentImages.length === 1 && currentImages[0].id === art.id &&
                                <>
                                    <img
                                        src={DownloadIcon}
                                        className='icon'
                                        onClick={() => downloadOriginalImage(currentImages, setCurrentImages)} />
                                    <DeleteOutlineIcon
                                        className="icon card-delete-icon"
                                        onClick={() => {
                                            handleDialogOpen(true);
                                        }} />
                                    <img
                                        src={LocationIcon}
                                        className='icon'
                                        onClick={prepareImagesForLocationChange} />
                                </>}
                                <MoreHorizIcon onClick={() => openFullInfoDialog(art)} />
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
                <Dialog open={fullInfoOpened} onClose={() => setFullInfoOpened(false)}>
                    <DialogContent>
                        <ArtInfoContainer art={selectedRow} />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default ListView;
