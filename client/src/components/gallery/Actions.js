import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { ImageContext } from '../contexts/ImageContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './Actions.css'
import { downloadOriginalImage, prepareImagesForLocationChange } from '../utils/helpers'


function Actions({handleDialogOpen, viewMode, searchResults, handleIsLocationChangeDialogOpen}) {

    let navigate = useNavigate();

    const {
        currentImages,
        setCurrentImages,
    } = useContext(ImageContext);

    const handleSelectAll = () => {
        if (currentImages.length === searchResults.length) {
            setCurrentImages([]);
        } else {
            setCurrentImages([
                ...currentImages, 
                ...searchResults.filter(image => 
                    !currentImages.some(
                        currentImage => currentImage.id === image.id
                    ))
            ]);
        }
    }

    return (
        <div className="action-buttons-container">
            {searchResults.length || searchResults.length && viewMode === 'details' ?
                currentImages.length === searchResults.length ?
                    <LibraryAddCheckIcon fontSize="large" onClick={handleSelectAll} /> :
                    <CheckBoxOutlineBlankIcon fontSize="large" onClick={handleSelectAll} /> :
                null
            }
            {currentImages.length && currentImages.length !== 1 || (viewMode === 'thumbnail' && currentImages.length) ?
                <PictureAsPdfIcon fontSize="large" onClick={() => navigate('/pdf')} />
                : 
                null
            }
            {currentImages.length && currentImages.length !== 1 || (viewMode === 'thumbnail' && currentImages.length) ?
                <DriveFileMoveIcon fontSize="large" onClick={() => prepareImagesForLocationChange(handleIsLocationChangeDialogOpen)} /> :
                null
            }
            {currentImages.length > 1 || (viewMode === 'thumbnail' && currentImages.length) ?
                <>
                    <FileDownloadIcon fontSize="large" onClick={() => downloadOriginalImage(currentImages, setCurrentImages)}/>
                    <DeleteOutlineIcon fontSize="large" onClick={() => handleDialogOpen(true)}/>
                </>
                :
                null
            }
        </div>
    )
}

export default Actions