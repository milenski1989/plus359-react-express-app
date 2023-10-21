
import { Checkbox } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useContext } from 'react';
import { ImageContext } from './contexts/ImageContext';
import './ThumbnailView.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ThumbnailView = ({searchResults, multiSelectMode, handleThumbnailView, handleSelectedImageIndex}) => {

    const {
        setCurrentImages,
    } = useContext(ImageContext);

    const handleImageClick = (id) => {
        const index = searchResults.findIndex(art => art.id === id)
        handleSelectedImageIndex(index)
    }

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
                    {multiSelectMode &&
                                    <Checkbox
                                        style={{position: "absolute"}} onChange={(e) => checkBoxHandler(e,art.id)} 
                                        sx={{
                                            color: blue[400],
                                            '&.Mui-checked': {
                                                color: blue[600],
                                            },
                                            zIndex: '9999'}}
                                    
                                    />

                    }
                    <LazyLoadImage
                        onClick={() => {handleThumbnailView(false); handleImageClick(art.id)}}
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