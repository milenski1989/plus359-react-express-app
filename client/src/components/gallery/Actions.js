import LocationIconBig from '../assets/move-solid-big.svg'
import PdfIconBig from '../assets/pdf-solid-big.svg'
import SelectAllIcon from '../assets/select-all.svg'
import UnselectAllIcon from '../assets/unselect-all.svg'
import DownloadIconBig from '../assets/download-solid-big.svg'
import { ImageContext } from '../contexts/ImageContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveAs } from "file-saver";
import './Actions.css'
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";


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

    const prepareImagesForLocationChange = async() => {
        handleIsLocationChangeDialogOpen(true)
    }

    const downloadOriginalImage = () => {
        for (let currentImage of currentImages) {
            saveAs(currentImage.download_url, currentImage.download_key);
        }
    };

    return (
        <div className="action-buttons-container">
            {searchResults.length || searchResults.length && viewMode === 'details' ?
                <img onClick={handleSelectAll} src={currentImages.length ? UnselectAllIcon : SelectAllIcon} className='icon' /> :
                null
            }
            {currentImages.length  ?
                <img
                    src={PdfIconBig}
                    className='icon'
                    onClick={() => navigate('/pdf')} />
                : 
                null
            }

            {currentImages.length && currentImages.length !== 1 ?
                <img 
                    src={LocationIconBig} 
                    className='icon' 
                    onClick={prepareImagesForLocationChange}/> :
                null
            }
            {currentImages.length > 1 ?
                <img 
                    src={DownloadIconBig} 
                    className='icon download-icon'
                    onClick={downloadOriginalImage}/>
                :
                null
            }
            {currentImages.length > 1 ?
                <DeleteOutlineIcon
                    className="icon"
                    style={{ cursor: "pointer", height: '34px', width: '34px'}}
                    onClick={() => {
                        handleDialogOpen(true);
                    }}
                />
                :
                null
            }
        </div>
    )
}

export default Actions