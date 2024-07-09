import { Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditableContainer from "../EditableContainer";
import '../DetailsView.css';
import { generateBackGroundColor } from "../utils/helpers";
import { useContext, useState, useEffect } from "react";
import { ImageContext } from "../contexts/ImageContext";
import './Card.css'
import EditIcon from '../assets/edit-solid.svg'
import DownloadIcon from '../assets/download-solid.svg'
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";


const Card = ({ searchResults, artwork}) => {

    const {
        currentImages,
        setCurrentImages,
    } = useContext(ImageContext);

    const navigate = useNavigate()

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    useEffect(() => {
        const allImages = searchResults.map(result => result.image_url);
        const imagePromises = allImages.map(imageUrl => {
            return new Promise(resolve => {
                const img = new Image();
                img.onload = () => resolve();
                img.src = imageUrl;
            });
        });

        Promise.all(imagePromises).then(() => {
            setAllImagesLoaded(true);
        });
    }, [searchResults]);

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

    return (
        <div className="card" key={artwork.id}>
            <div className="card-header-container">
                <p className="card-header">{artwork.artist || 'No Artist'}</p>
                {artwork.position !== 0 ? (
                    <div
                        style={{
                            backgroundColor: generateBackGroundColor(artwork.cell),
                            color: "white",
                            height: "auto",
                            marginRight: "0.5rem"
                        }}>
                        <p style={{ padding: "0.7rem" }}>{artwork.position}</p>
                    </div>
                ) : null}
                <Checkbox
                    onChange={() => checkBoxHandler(artwork.id)}
                    checked={currentImages.some(image => image.id === artwork.id)}
                    sx={{
                        "&.Mui-checked": {
                            color: "black",
                        },
                    }}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleOutlineIcon />}
                />
            </div>
            <div style={{
                position: 'relative',
                width: '100%',
                height: imageLoaded ? 'auto' : `${(dimensions.height / dimensions.width) * 100}%`,
                overflow: 'hidden'
            }}>
                {allImagesLoaded &&
                    <img
                        src={artwork.image_url}
                        alt="image"
                        onLoad={handleImageLoad}
                        style={{
                            display: imageLoaded ? 'block' : 'none',
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            marginBottom: '1rem'
                        }}
                    /> }
            </div>
            {!imageLoaded && 
            
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%)',
                    backgroundSize: '80vw 100%',
                    animation: 'placeholderShimmer 1.5s linear infinite forwards'
                }}></div>
            }
           
            <>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <img 
                        style={{marginLeft: '1rem'}}
                        src={EditIcon} 
                        className='icon'
                        onClick={() => {
                            setCurrentImages([artwork]);
                            localStorage.setItem('currentImage', JSON.stringify(artwork));
                            navigate('/edit-page')
                        } }/>
                    {currentImages.length === 1 && currentImages[0].id === artwork.id ?
                        <img 
                            src={DownloadIcon} 
                            className='icon'
                            onClick={() => downloadOriginalImage(artwork.download_url, artwork.download_key)}/>
                        :
                        <></>
                    }
                </div>
              
                <EditableContainer
                    art={artwork}
                />
            </>
        
        </div>
    );
};

export default Card;
