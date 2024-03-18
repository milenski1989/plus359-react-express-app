import React from 'react'
import { useContext } from 'react';
import { ImageContext } from '../contexts/ImageContext';
import { Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ImageContainer from '../refactored components/ImageContainer';


const Thumbnail = ({searchResults}) => {

    const {
        setCurrentImages,
    } = useContext(ImageContext);

    const checkBoxHandler = (e, id) => {
        const index = searchResults.findIndex(art => art.id === id)
        if (e.target.checked) {
            setCurrentImages(prev => [...new Set(prev).add(searchResults[index])])
        } else {
            setCurrentImages(prev => [...prev.filter(image => image.id !== id )])
        }
    }
    
    return <>
        {searchResults.map((art, id) => (
            <div
                key={id}>
                <Checkbox
                    onChange={(e) => checkBoxHandler(e, art.id)}
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
                <ImageContainer imageSrc={art.image_url}/>
            </div>
        ))}
    </>   
}

export default Thumbnail