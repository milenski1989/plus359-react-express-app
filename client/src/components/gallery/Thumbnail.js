import React from 'react'
import { useContext } from 'react';
import { ImageContext } from '../contexts/ImageContext';
import { Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import './Thumbnail.css'
import { useLoadedImages } from '../hooks/useLoadedImages';
import { checkBoxHandler } from '../utils/helpers';

const Thumbnail = ({artwork, searchResults}) => {

    
    const [allImagesLoaded] = useLoadedImages(searchResults)

    const {
        currentImages,
        setCurrentImages,
    } = useContext(ImageContext);

    return <>
        <div
            key={artwork.id}>
            <Checkbox
                onChange={() => checkBoxHandler(currentImages, setCurrentImages, searchResults, artwork.id)}
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
            <div 
                className="image-container">
                {allImagesLoaded &&
                    <img 
                        src={artwork.image_url} 
                        alt="image" 
                    />
                }
            </div>
        </div>
        
    </>   
}

export default Thumbnail