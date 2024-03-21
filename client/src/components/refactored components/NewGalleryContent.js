import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar";
import "./NewGalleryContent.css";
import "../App.css";
import {CircularProgress} from "@mui/material";
import Message from "../Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ImageContext } from "../contexts/ImageContext";
import SearchAndFiltersBar from "../SearchAndFiltersBar";
import { useNavigate, useParams } from "react-router-dom";
import ThumbnailView from "../ThumbnailView";
import DetailsView from "../DetailsView";
import ListViewIcon from '../../components/assets/list-view-solid.svg';
import ThumbnailViewIcon from '../../components/assets/thumbnail-view-solid.svg';
import ListView from "../ListView";
import DetailsViewIcon from '../../components/assets/details-view-solid.svg';
import LocationIcon from '../../components/assets/move-solid.svg'
import PdfIcon from '../../components/assets/pdf-solid.svg'
import SelectAllIcon from '../../components/assets/select-all.svg'
import UnselectAllIcon from '../../components/assets/unselect-all.svg'
import DeleteDialog from "./DeleteDialog";
import LocationChangeDialog from "./LocationChangeDialog";
import PaginationComponent from './PaginationComponent'
import { getAllEntries, getAllEntriesByKeywords } from "../../utils/apiCalls";
import { useMediaQuery } from "@mui/material";
import NewSort from "./NewSort";
import MobileListView from "../MobileListView";


const NewGalleryContent = () => {

    const {
        currentImages,
        setCurrentImages,
        setUpdatedEntry,
        isEditMode
    } = useContext(ImageContext);

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState('id')
    const [sortOrder, setSortOrder] = useState('desc')
    const [keywords, setKeywords] = useState([]);
    
    const {name} = useParams()

    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [locationChanged, setLocationChanged] = useState(false)
    const [isLocationChangeDialogOpen, setIsLocationChangeDialogOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pagesCount, setPagesCount] = useState(0);
    const [error, setError] = useState({
        error: false,
        message: "",
    });
    const [imageLoaded, setImageLoaded] = useState({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState('thumbnail')
    const [paginationDisabled, setPaginationDisabled] = useState(false);
    let navigate = useNavigate();
    
    const getData = async (search = false) => {
        setLoading(true);
        try {
            let data;
            if (search && keywords.length) {
                data = await getAllEntriesByKeywords(keywords, page, sortField, sortOrder);
            } else {
                console.log('invoked from gallery')

                data = await getAllEntries(name, page, sortField, sortOrder);
            }
            const { arts, artsCount } = data;
            setSearchResults(arts);
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
        } catch (error) {
            setError({ error: true, message: error.message });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    
        const promises = searchResults.map((art) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = art.image_url;
                img.onload = () => {
                    resolve();
                    setImageLoaded(prev => ({ ...prev, [art.id]: true }));
                };
            });
        });

        Promise.allSettled(promises).then(() => {
            setLoading(false)
        });
    }, [searchResults]);

    useEffect(() => {
        keywords.length ? getData(true) : getData();
    }, [page, sortField, sortOrder, isDeleting, locationChanged, keywords]);

    
    const prepareImagesForLocationChange = async() => {
        setIsLocationChangeDialogOpen(true)
    }

    const handlePage = (newPage) => {
        setPage(newPage)
    }

    const renderViewMode = () => {
        if (viewMode === 'thumbnail') {
            return  <ThumbnailView
                searchResults={searchResults}
            />  
        } else if (viewMode === 'details') {
            return <DetailsView
                searchResults={searchResults}
                handleDialogOpen={setIsDeleteDialogOpen}
                handleSearchResults={setSearchResults}
                imageLoaded={imageLoaded}
            />
          
        } else if (viewMode === 'list' && isSmallDevice) {
            return  <MobileListView
                searchResults={searchResults}
                handleUpdatedEntry={setUpdatedEntry}
                handleDialogOpen={setIsDeleteDialogOpen}
                handleSearchResults={setSearchResults}
            /> 
        } else {
            return <ListView
                searchResults={searchResults}
                handleUpdatedEntry={setUpdatedEntry}
                handleDialogOpen={setIsDeleteDialogOpen}
                handleSearchResults={setSearchResults}
            /> 
        }
    }

    const handleKeywords = (enteredKeywords) => {
        setKeywords(enteredKeywords)
    }

    const handleLocationChanged = () => {
        setLocationChanged(prev => !prev)
    }

    const handleViewMode = (mode) => {
        setViewMode(mode)
        setCurrentImages([])
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
    
    return (
        <>
            <Navbar />
            <div className="gallery">
                <Message
                    open={error.error}
                    handleClose={() => setError({ error: false, message: "" })}
                    message={error.message}
                    severity="error" />

                <LocationChangeDialog 
                    isLocationChangeDialogOpen={isLocationChangeDialogOpen}
                    handleIsLocationChangeDialogOpen={setIsLocationChangeDialogOpen}
                    handleLocationChanged = {handleLocationChanged}
                />
                <DeleteDialog
                    isDialogOpen={isDeleteDialogOpen}
                    handleDialogOpen={setIsDeleteDialogOpen}
                    isDeleting={isDeleting}
                    handleIsDeleting={setIsDeleting}
                    
                />
                
                <div className={isSmallDevice ? 'mobile-search-actions-container' :
                    'search-actions-container'}>
                    {!isSmallDevice && 
                             <div className="main-actions-pdf-location-container">
                                 <img onClick={handleSelectAll} src={currentImages.length ? UnselectAllIcon : SelectAllIcon} className='icon' />
                                 {currentImages.length && !isEditMode ?
                                     <><img
                                         src={PdfIcon}
                                         className='icon'
                                         onClick={() => navigate('/pdf')} /><img
                                         src={LocationIcon}
                                         className='icon'
                                         onClick={prepareImagesForLocationChange} /></> : <></>
                                 }
                             </div>
                    }
                    <>
                        <NewSort 
                            sortField={sortField}
                            handleSortField={setSortField}
                            sortOrder={sortOrder}
                            handleSortOrder={setSortOrder}
                        />
                        <SearchAndFiltersBar
                            page={page}
                            setPage={setPage}
                            handlePagesCount={setPagesCount}
                            handleTotalCount={setTotalCount}
                            sortField={sortField}
                            sortOrder={sortOrder}
                            setPaginationDisabled={setPaginationDisabled}
                            handleLoading={setLoading}
                            handleError={setError}
                            handleSearchResults={setSearchResults}
                            keywords={keywords}
                            handleKeywords={handleKeywords}
                         
                        />

                        <div className={isSmallDevice ? 'mobile-view-mode-icons-container' :
                            'view-mode-icons-container'
                        }>
                            {isSmallDevice ?
                                <div className="mobile-main-actions-pdf-location-container">
                                    {currentImages.length  ?
                                        <>
                                            <img 
                                                src={LocationIcon} 
                                                className='icon' 
                                                onClick={prepareImagesForLocationChange}/>
                                            <img src={PdfIcon} 
                                                className='icon' 
                                                onClick={() => navigate('/pdf')} />
                                        </>
                                        : <></> }
                                    <img onClick={handleSelectAll} src={currentImages.length ? UnselectAllIcon : SelectAllIcon} className='icon' />
                                </div>
                                :
                                null
                            }
                            {isSmallDevice ? 
                                <div className="mobile-mode-icons">
                                    <img className={viewMode === 'thumbnail' ? 'selected icon' : 'icon'} src={ThumbnailViewIcon} onClick={() => handleViewMode('thumbnail')}/>
                                    <img className={viewMode === 'details' ? 'selected icon' : 'icon'} src={DetailsViewIcon} onClick={() => handleViewMode('details')}/>
                                    <img className={viewMode === 'list' ? 'selected icon' : 'icon'} src={ListViewIcon} onClick={() => handleViewMode('list')}/>
                                </div> :
                                <>
                                    <img className={viewMode === 'thumbnail' ? 'selected icon' : 'icon'} src={ThumbnailViewIcon} onClick={() => handleViewMode('thumbnail')} />
                                    <img className={viewMode === 'details' ? 'selected icon' : 'icon'} src={DetailsViewIcon} onClick={() => handleViewMode('details')} />
                                    <img className={viewMode === 'list' ? 'selected icon' : 'icon'} src={ListViewIcon} onClick={() => handleViewMode('list')} />
                                </>
                            }
                        </div>
                    </>
                
                </div>   
                 
                {loading ? (
                    <CircularProgress className="loader" color="primary" />
                ) : (
                    <>
                        {renderViewMode()}
                        {!searchResults.length && <div className="flex flex-row justify-center content-center max-sm:ml-20 max-sm:mr-20">Nothing was found!</div>}
                    </>
                )}
                {searchResults.length && !paginationDisabled && !loading ? (
                    <PaginationComponent 
                        page={page}
                        handlePage={handlePage}
                        pagesCount={pagesCount}
                        totalCount={totalCount}
                    />
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};
export default NewGalleryContent;
