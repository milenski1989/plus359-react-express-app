import * as React from "react";
import { useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { ImageContext } from "../contexts/ImageContext";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';

import { Dialog, DialogContent } from "@mui/material";
import './ListView.css'
import { checkBoxHandler, downloadOriginalImage, generateBackGroundColor, handleEdit } from "../utils/helpers";
import ArtInfoContainer from "../gallery/ArtInfoContainer";
import { useNavigate } from "react-router-dom";



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
                            <div className="info-text">
                                <p>{truncateInfoProp(art.artist, 25)}</p>
                            </div>
                            <div className="info-text">
                                <p>{truncateInfoProp(art.dimensions, 25)}</p>
                            </div>
                            <div className="info-text">
                                <p>{truncateInfoProp(art.technique, 25)}</p>
                            </div>
                            <div className="info-text">
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
                                <EditIcon 
                                    fontSize="medium" 
                                    onClick={() => handleEdit(art, setCurrentImages, navigate)}/>
                                {currentImages.length === 1 && currentImages[0].id === art.id &&
                                <>
                                    <FileDownloadIcon fontSize="medium" onClick={() => downloadOriginalImage(currentImages, setCurrentImages)}/>
                                    <DeleteOutlineIcon
                                        className="icon card-delete-icon"
                                        onClick={() => {
                                            handleDialogOpen(true);
                                        }} />
                                    <DriveFileMoveIcon fontSize="medium" onClick={prepareImagesForLocationChange} />
                                 
                                    <PictureAsPdfIcon fontSize="medium" onClick={() => navigate('/pdf')}/>
                                </>}
                                <MoreHorizIcon fontSize="medium" onClick={() => openFullInfoDialog(art)} />
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
