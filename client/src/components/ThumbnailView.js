
import { Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useContext } from 'react';
import { ImageContext } from './contexts/ImageContext';
import './ThumbnailView.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ThumbnailView = ({searchResults}) => {

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
        <div className="cards">
            {searchResults.map((art, id) => (
                <div
                    key={id}>
                    <Checkbox
                        onChange={(e) => checkBoxHandler(e, art.id)}
                        sx={{
                            position: "absolute",
                            zIndex: '9999',
                            color: "white",
                            "&.Mui-checked": {
                                color: "white",
                            },
                        }}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleOutlineIcon />}
                    />
                    <LazyLoadImage
                        src={art.image_url}
                        effect="blur"
                        width='100%'
                        height="auto"
                    />
                </div>
            ))}
                            
        </div>
    </>

}

export default ThumbnailView