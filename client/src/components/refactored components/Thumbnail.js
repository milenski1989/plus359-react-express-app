import React from 'react'
import { useContext } from 'react';
import { ImageContext } from '../contexts/ImageContext';
import { Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useEffect } from 'react';
import { useState } from 'react';
import './Thumbnail.css'


const Thumbnail = ({artwork, searchResults}) => {

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

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        setDimensions({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);
    };


    const {
        currentImages,
        setCurrentImages,
    } = useContext(ImageContext);

    const checkBoxHandler = (id) => {
        if (currentImages.some(image => image.id === id)) {
            setCurrentImages(currentImages.filter(image => image.id !== id));
        } else {
            setCurrentImages([...currentImages, searchResults.find(image => image.id === id)]);
        }
    }
    
    return <>
       
        <div
            className="thumb"
            key={artwork.id}>
            <Checkbox
                onChange={() => checkBoxHandler(artwork.id)}
                checked={currentImages.some(image => image.id === artwork.id)}
                sx={{
                    position: "absolute",
                    zIndex: '888',
                    color: "white",
                    "&.Mui-checked": {
                        color: "white",
                    },
                }}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleOutlineIcon />}
            />
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
                    />
                }
                
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
        </div>
        
    </>   
}

export default Thumbnail