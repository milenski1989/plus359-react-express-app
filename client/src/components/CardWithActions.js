import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ImageContext } from './contexts/ImageContext';
import { generateBackGroundColor } from './utils/helpers';
import { Checkbox } from '@mui/material';
import EditableContainer from './EditableContainer';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './CardWithActions.css'
import EditIcon from './assets/edit-solid.svg'
import DownloadIcon from './assets/download-solid.svg'
import { saveAs } from "file-saver";

function CardWithActions({art}) {

    const {searchResults} = useOutletContext()

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
    }

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
        <div className="card" key={art.id}>
            <div className="card-header-container">
                <p className="card-header">{art.artist || 'No Artist'}</p>
                {art.position !== 0 ? (
                    <div
                        style={{
                            backgroundColor: generateBackGroundColor(art.cell),
                            color: "white",
                            height: "auto",
                            marginRight: "0.5rem"
                        }}>
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
            <div style={{
                position: 'relative',
                width: '100%',
                height: imageLoaded ? 'auto' : `${(dimensions.height / dimensions.width) * 100}%`,
                overflow: 'hidden'
            }}>
                {allImagesLoaded &&
                <img
                    src={art.image_url}
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
                </div>
          
                <EditableContainer
                    art={art}
                />
            </>
    
        </div>
    )
}

export default CardWithActions