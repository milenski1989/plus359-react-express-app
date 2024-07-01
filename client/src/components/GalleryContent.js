import React, { useContext, useEffect, useState } from "react";
import "./GalleryContent.css";
import "./App.css";
import {CircularProgress} from "@mui/material";
import Message from "./Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ImageContext } from "./contexts/ImageContext";
import { useNavigate, useOutletContext } from "react-router-dom";
import LocationIcon from './assets/move-solid.svg'
import PdfIcon from './assets/pdf-solid.svg'
import SelectAllIcon from './assets/select-all.svg'
import UnselectAllIcon from './assets/unselect-all.svg'
import DeleteDialog from "./DeleteDialog";
import LocationChangeDialog from "./LocationChangeDialog";
import { useMediaQuery } from "@mui/material";
import DownloadIcon from './assets/download-solid.svg'
import { saveAs } from "file-saver";


const GalleryContent = ({children}) => {

    const {searchResults, setIsLocationChangeDialogOpen} = useOutletContext()

    const {
        currentImages,
        setCurrentImages,
        isEditMode
    } = useContext(ImageContext);

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");


    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
   
    const [error, setError] = useState({
        error: false,
        message: "",
    });
    // eslint-disable-next-line no-unused-vars
    const [imageLoaded, setImageLoaded] = useState({});
    let navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
    
        const promises = searchResults && searchResults.map((art) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = art.image_url;
                img.onload = () => {
                    resolve();
                    setImageLoaded(prev => ({ ...prev, [art.id]: true }));
                };
            });
        });

        if (promises) {
            Promise.allSettled(promises).then(() => {
                setLoading(false)
            });
        }

    }, [searchResults]);

    const prepareImagesForLocationChange = async() => {
        setIsLocationChangeDialogOpen(true)
    }

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

    const downloadOriginalImage = () => {
        for (let currentImage of currentImages) {
            saveAs(currentImage.download_url, currentImage.download_key);
        }
    };
    
    return (
        <>
            <div className="gallery">
                <Message
                    open={error.error}
                    handleClose={() => setError({ error: false, message: "" })}
                    message={error.message}
                    severity="error" />

                <LocationChangeDialog 
                />
                <DeleteDialog
                    isDeleting={isDeleting}
                    handleIsDeleting={setIsDeleting}
                    
                />
                <div className={isSmallDevice ? 'mobile-search-filters-buttons-container' :
                    'search-filters-buttons-container'}>
                    {!isSmallDevice && 
                             <div className="select-pdf-location-buttons-container">
                                 {searchResults.length || searchResults.length ?
                                     <img onClick={handleSelectAll} src={currentImages.length ? UnselectAllIcon : SelectAllIcon} className='icon' /> :
                                     <></>
                                 }
                                 {currentImages.length && !isEditMode ?
                                     <><img
                                         src={PdfIcon}
                                         className='icon'
                                         onClick={() => navigate('/pdf')} />
                                     {user.superUser ?
                                         <img 
                                             src={LocationIcon} 
                                             className='icon' 
                                             onClick={prepareImagesForLocationChange}/> :
                                         <></>
                                     }
                                     </> : <></>
                                 }
                                 {currentImages.length > 1 ?
                                     <img 
                                         style={{width: '39px'}}
                                         src={DownloadIcon} 
                                         className='icon'
                                         onClick={downloadOriginalImage}/>
                                     :
                                     <></>
                                 }
                             </div>
                    }
                    <>
                     
                        <div className={isSmallDevice ? 'mobile-view-mode-actions-container' :
                            'view-mode-icons-container'
                        }>
                            {isSmallDevice ?
                                <div className="mobile-select-pdf-location-buttons-container">
                                    {currentImages.length  ?
                                        <>
                                            {user.superUser ?
                                                <img 
                                                    src={LocationIcon} 
                                                    className='icon' 
                                                    onClick={prepareImagesForLocationChange}/> :
                                                <></>
                                            }
                                            <img src={PdfIcon} 
                                                className='icon' 
                                                onClick={() => navigate('/pdf')} />
                                        </>
                                        : <></> }
                                    {currentImages.length > 1 ?
                                        <img 
                                            style={{width: '39px'}}
                                            src={DownloadIcon} 
                                            className='icon'
                                            onClick={downloadOriginalImage}/>
                                        :
                                        <></>
                                    }
                                    <img onClick={handleSelectAll} src={currentImages.length ? UnselectAllIcon : SelectAllIcon} className='icon' />
                                </div>
                                :
                                null
                            }
                         
                        </div>
                    </>
                
                </div>   
                 
                {loading ? (
                    <CircularProgress className="loader" color="primary" />
                ) : (
                    <>
                        {children}
                        {!searchResults && <div className="flex flex-row justify-center content-center max-sm:ml-20 max-sm:mr-20">Nothing was found!</div>}
                    </>
                )}
             
            </div>
        </>
    );
};
export default GalleryContent;
