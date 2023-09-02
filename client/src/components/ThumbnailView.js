
import { Checkbox } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useContext } from 'react';
import { ImageContext } from './App';

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
        <div className="columns-5 max-sm:columns-2 max-sm:gap-2 gap-4 mr-4 ml-4 max-sm:mt-8 mt-16">
            {searchResults.map((art, id) => (
                <><div
                    key={id}>
                    {multiSelectMode &&
                                    <Checkbox
                                        style={{position: "absolute"}} onChange={(e) => checkBoxHandler(e,art.id)} 
                                        sx={{
                                            color: blue[400],
                                            '&.Mui-checked': {
                                                color: blue[600],
                                            }}}
                                    
                                    />

                    }
                    <img
                        className="h-auto w-full rounded-md max-sm:mb-2 mb-4" src={art.image_url} onClick={() => {handleThumbnailView(false); handleImageClick(art.id)}} />
                </div>
                </>
            ))}
                            
        </div>
    </>

}

export default ThumbnailView