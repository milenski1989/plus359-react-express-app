import * as React from "react";
import { useContext, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Dialog, DialogContent } from "@mui/material";
import { ImageContext } from "../contexts/ImageContext";
import { checkBoxHandler, generateBackGroundColor } from "../utils/helpers";
import './ListView.css';
import { downloadOriginalImage, handleEdit } from "../utils/helpers";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from "react-router-dom";
import './MobileListView.css';
import ArtInfoContainer from "./ArtInfoContainer";

const MobileListView = ({ searchResults, handleDialogOpen, handleIsLocationChangeDialogOpen }) => {
    const { currentImages, setCurrentImages } = useContext(ImageContext);
    const [selectedRow, setSelectedRow] = useState(null);

    const navigate = useNavigate()

    const openFullInfoDialog = (art) => {
        setSelectedRow(art);
        setCurrentImages([art])
    };

    const truncateInfoProp = (propValue, length) => {
        if (propValue.length > length) {
            return `${propValue.slice(0, length)}...`;
        } else {
            return propValue;
        }
    };

    const prepareImagesForLocationChange = async (art) => {
        setCurrentImages([art])
        handleIsLocationChangeDialogOpen(true)
    }

    return (
        <>
            <div className="mobile-rows">
                {searchResults.map((art, ind) => {
                    const labelId = `checkbox-list-secondary-label-${ind}`;
                    return (
                        <div className="mobile-row-container" key={labelId}>
                            <div
                                className={`mobile-row-position-container ${art.position ? 'position-text' : ''}`}
                                style={art.position ?
                                    { backgroundColor: generateBackGroundColor(art.cell) } :
                                    { backgroundColor: '#5A5A5A' }}>
                                <Checkbox
                                    onChange={() => checkBoxHandler(currentImages, setCurrentImages, searchResults, art.id)}
                                    checked={currentImages.some(image => image.id === art.id)}
                                    sx={{
                                        padding: 0,
                                        color: 'white',
                                        "&.Mui-checked": {
                                            color: "white",
                                        },
                                    }}
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<CheckCircleOutlineIcon />}
                                />
                                <p>{art.position ? art.position : ''}</p>
                            </div>
                            <img
                                className="row-image"
                                onClick={() => openFullInfoDialog(art)}
                                src={art.image_url}
                                alt="list-item-image" />
                            <div className="info-text">
                                <p>{truncateInfoProp(art.artist, 10)}</p>
                            </div>
                            <div className="info-text">
                                <p>{truncateInfoProp(art.dimensions, 10)}</p>
                            </div>
                            <MoreHorizIcon
                                sx={{ marginRight: "0.5rem", cursor: 'pointer' }}
                                onClick={() => openFullInfoDialog(art)}
                            />
                        </div>
                    );
                })}
            </div>

            {selectedRow && (
                <Dialog open={selectedRow} onClose={() => setSelectedRow(null)}>
                    <DialogContent>
                        <div className="mobile-full-info-dialog">
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
};

export default MobileListView;
