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

    console.log(currentImages)
    const [selectedRow, setSelectedRow] = useState(null)

    const navigate = useNavigate()

    const truncateInfoProp = (propValue, length) => {
        if (!propValue) return '';
        if (propValue.length > length) {
            return `${propValue.slice(0, length)}...`
        } else {
            return propValue
        }
    }

    const prepareImagesForLocationChange = async (art) => {
        setCurrentImages([art])
        handleIsLocationChangeDialogOpen(true)
    }

    console.log(selectedRow)

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
                                onClick={() => setSelectedRow(art)}
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
                                {currentImages && currentImages.length === 1 && currentImages[0].id === art.id &&
                                <>
                                    <FileDownloadIcon fontSize="medium" onClick={() => downloadOriginalImage(currentImages)}/>
                                    <DeleteOutlineIcon
                                        className="icon card-delete-icon"
                                        onClick={() => {
                                            handleDialogOpen(true);
                                        }} />
                                    <DriveFileMoveIcon fontSize="medium" onClick={() => prepareImagesForLocationChange(art)} />
                                 
                                    <PictureAsPdfIcon fontSize="medium" onClick={() => navigate('/pdf')}/>
                                </>}
                                <MoreHorizIcon fontSize="medium" onClick={() =>  setSelectedRow(art)} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedRow && (
                <Dialog open={selectedRow} onClose={() => setSelectedRow(null)}>
                    <DialogContent>
                        <div className="full-info-dialog">
                            <img
                                src={selectedRow.image_url}
                                alt="list-item-image" />
                            <ArtInfoContainer art={selectedRow} />
                            <div className="mobile-row-actions"> 
                                <EditIcon 
                                    fontSize="medium" 
                                    onClick={() => handleEdit(selectedRow, setCurrentImages, navigate)}/>
                           
                                <>
                                    <FileDownloadIcon fontSize="medium" onClick={() => downloadOriginalImage(currentImages)}/>
                                    <DeleteOutlineIcon
                                        fontSize="medium"
                                        onClick={() => {
                                            handleDialogOpen(true);
                                        }} />
                                    <DriveFileMoveIcon fontSize="medium" onClick={() => prepareImagesForLocationChange(selectedRow)} />
                                 
                                    <PictureAsPdfIcon fontSize="medium" onClick={() => navigate('/pdf')}/>
                                </>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default ListView;
