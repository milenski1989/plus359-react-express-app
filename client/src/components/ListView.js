import { useContext, useEffect, useRef } from "react";
import { ImageContext } from './contexts/ImageContext';
import { blue } from '@mui/material/colors';
import { Checkbox } from "@mui/material";
import EditableContainer from "./EditableContainer";
import ActionButtons from "./ActionButtons";
import './ListView.css'


const ListView = ({searchResults, handleThumbnailView, handleMultiSelectMode, multiSelectMode, selectedImageIndex, handleConfirmationDialog, fetchData}) => {

    const {
        setCurrentImages,
    } = useContext(ImageContext);

    const listRef = useRef(null);

    useEffect(() => {
        if (selectedImageIndex != null && listRef.current) {
            const childElement = listRef.current.children[selectedImageIndex];
            const container = listRef.current;
            const scrollOffset = childElement.offsetTop - container.offsetTop;
          
            container.scrollTop = scrollOffset;
        }
    }, [selectedImageIndex]);
      

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

                <div className="card" key={id}>
                    <p className="card-header">{art.artist}</p>
                    {multiSelectMode &&
                <Checkbox
                    onChange={(e) => checkBoxHandler(e, art.id)}
                    sx={{
                        color: blue[400],
                        '&.Mui-checked': {
                            color: blue[600],
                        }
                    }}
                    style={{position: 'absolute', top: '40px'}}
                />}
                   
                    <img
                        onClick={() => handleThumbnailView(true)}
                        className="img" src={art.image_url}
                        loading="lazy"
                    />

                    <ActionButtons 
                        art={art}
                        handleMultiSelectMode={handleMultiSelectMode}
                        handleConfirmationDialog={handleConfirmationDialog}
                        searchResults={searchResults}
                        fetchData={fetchData}
                    />

                    <EditableContainer 
                        art={art}
                    />

                
                </div>
            ))}
        </div>
    </>
}

export default ListView