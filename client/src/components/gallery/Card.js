import { Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import './DetailsView.css';
import { checkBoxHandler, downloadOriginalImage, generateBackGroundColor, handleEdit, prepareImagesForLocationChange } from "../utils/helpers";
import { useContext, useState } from "react";
import { ImageContext } from "../contexts/ImageContext";
import './Card.css'
import { useNavigate } from "react-router-dom";
import ArtInfoContainer from "./ArtInfoContainer";
import { useLoadedImages } from "../hooks/useLoadedImages";


const Card = ({handleDialogOpen, searchResults, art, handleIsLocationChangeDialogOpen}) => {

    const [allImagesLoaded] = useLoadedImages(searchResults)

    const {
        currentImages,
        setCurrentImages,
    } = useContext(ImageContext);

    const navigate = useNavigate()

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setDimensions({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);
    };

    return (
        <div className="card" key={art.id}>
            <div className="card-header-container">
                <p className="card-header">{art.artist || 'No Artist'}</p>
                {art.position !== 0 ? (
                    <div
                        className="card-position-container"
                        style={{backgroundColor: generateBackGroundColor(art.cell)}}>
                        <p style={{ padding: "0.7rem" }}>{art.position}</p>
                    </div>
                ) : null}
                <Checkbox
                    onChange={() => checkBoxHandler(currentImages, setCurrentImages, searchResults, art.id)}
                    checked={currentImages.some(image => image.id === art.id)}
                    sx={{
                        "&.Mui-checked": {
                            color: "black",
                        },
                    }}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleOutlineIcon />}
                />
            </div>
            <div className="card-image-container" style={{
                height: imageLoaded ? 'auto' : `${(dimensions.height / dimensions.width) * 100}%`,
            }}>
                {allImagesLoaded &&
                    <img
                        className="card-image"
                        src={art.image_url}
                        alt="image"
                        onLoad={handleImageLoad}
                        style={{
                            display: imageLoaded ? 'block' : 'none',
                        }}
                    /> }
            </div>
            {!imageLoaded && 
                <div className="card-image-placeholder"></div>
            }
            <>
                <div className="card-actions">
                    <EditIcon 
                        fontSize="medium"   
                        onClick={() => handleEdit(art, setCurrentImages, navigate)}/>
                    {currentImages.length === 1 && currentImages[0].id === art.id ?
                        <>
                            <FileDownloadIcon fontSize="medium" onClick={() => downloadOriginalImage(currentImages)} />
                            <DriveFileMoveIcon fontSize="medium" onClick={() => prepareImagesForLocationChange(handleIsLocationChangeDialogOpen)} />
                            <DeleteOutlineIcon fontSize="medium" onClick={() => handleDialogOpen(true)}/>
                            <PictureAsPdfIcon fontSize="medium" onClick={() => navigate('/pdf')} />
                        </> :
                        null
                    }
                </div>
                <ArtInfoContainer art={art} />
            </>
        </div>
    );
};

export default Card;
