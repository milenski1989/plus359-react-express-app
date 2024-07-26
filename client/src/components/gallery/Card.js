import { Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './DetailsView.css';
import { generateBackGroundColor } from "../utils/helpers";
import { useContext, useState } from "react";
import { ImageContext } from "../contexts/ImageContext";
import './Card.css'
import EditIcon from '../assets/edit-solid.svg'
import DownloadIcon from '../assets/download-solid.svg'
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import LocationIcon from '../assets/move-solid.svg'
import ArtInfoContainer from "./ArtInfoContainer";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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


    const checkBoxHandler = (id) => {
        if (currentImages.some(image => image.id === id)) {
            setCurrentImages(currentImages.filter(image => image.id !== id));
        } else {
            setCurrentImages([...currentImages, searchResults.find(image => image.id === id)]);
        }
    };

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setDimensions({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);
    };

    const downloadOriginalImage = (downloadUrl, name) => {
        saveAs(downloadUrl, name);
        setCurrentImages([])
    };

    const prepareImagesForLocationChange = async() => {
        handleIsLocationChangeDialogOpen(true)
    }

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
                    onChange={() => checkBoxHandler(art.id)}
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
                    <img 
                        src={EditIcon} 
                        className='icon'
                        onClick={() => {
                            setCurrentImages([art]);
                            localStorage.setItem('currentImage', JSON.stringify(art));
                            navigate('/edit-page')
                        } }/>
                    {currentImages.length === 1 && currentImages[0].id === art.id &&
                        <img 
                            src={DownloadIcon} 
                            className='icon'
                            onClick={() => downloadOriginalImage(art.download_url, art.download_key)}/>
                    }
                    {currentImages.length === 1 && currentImages[0].id === art.id &&  <img 
                        src={LocationIcon} 
                        className='icon' 
                        onClick={prepareImagesForLocationChange}/>}
                    {currentImages.length === 1 && currentImages[0].id === art.id ?
                        <DeleteOutlineIcon
                            className="icon card-delete-icon"
                            onClick={() => {
                                handleDialogOpen(true);
                            }}
                        />
                        :
                        null
                    }
                </div>
                <ArtInfoContainer art={art} />
            </>
        </div>
    );
};

export default Card;
