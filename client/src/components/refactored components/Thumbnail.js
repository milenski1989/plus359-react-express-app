import React from 'react'
import { useContext } from 'react';
import { ImageContext } from '../contexts/ImageContext';
import { Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ImageContainer from '../refactored components/ImageContainer';


const Thumbnail = ({searchResults, showCheckbox, setShowCheckbox}) => {

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
        {searchResults && searchResults.map((art, id) => (
            <div
                key={id}>
                {showCheckbox &&
                       <Checkbox
                           onChange={() => checkBoxHandler(art.id)}
                           checked={currentImages.some(image => image.id === art.id)}
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
                }
                <div style={{cursor: 'pointer'}}>
                    <ImageContainer setShowCheckbox={setShowCheckbox} imageSrc={art.image_url}/>
                </div>
            </div>
        ))}
    </>   
}

export default Thumbnail