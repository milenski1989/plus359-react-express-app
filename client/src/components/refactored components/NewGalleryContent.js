import React, { useCallback, useContext, useEffect, useState } from "react";
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
import Sort from "../Sort";
import ListViewIcon from '../../components/assets/list-view-solid.svg';
import ThumbnailViewIcon from '../../components/assets/thumbnail-view-solid.svg';
import ListView from "../ListView";
import DetailsViewIcon from '../../components/assets/details-view-solid.svg';
import LocationIcon from '../../components/assets/move-solid.svg'
import PdfIcon from '../../components/assets/pdf-solid.svg'
import DeleteDialog from "./DeleteDialog";
import LocationChangeDialog from "./LocationChangeDialog";
import PaginationComponent from './PaginationComponent'
import { getAllEntries, getAllEntriesByKeywords } from "../../utils/apiCalls";

const NewGalleryContent = () => {

    const {
        currentImages,
        setUpdatedEntry,
    } = useContext(ImageContext);
    const myStorage = window.localStorage;

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

    const getData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllEntries(name, page, sortField, sortOrder);
            const { arts, artsCount } = data;
            setSearchResults(arts);
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
        } catch (error) {
            setError({ error: true, message: error.message });
        } finally {
            setLoading(false);
        }
    }, [name, page, sortField, sortOrder, locationChanged]);

    const getDataFromSearch = async () => {
        setLoading(true);
        try {
            const data = await getAllEntriesByKeywords(keywords, page, sortField, sortOrder);
            const { arts, artsCount } = data;
            setSearchResults(arts);
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
        } catch(error) {
            setError({ error: true, message: error.message });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        keywords.length ? getDataFromSearch() : getData()
    }, [page, sortField, sortOrder, isDeleting, locationChanged]);

    let navigate = useNavigate();
  
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   
    const [viewMode, setViewMode] = useState('thumbnail')

    const [paginationDisabled, setPaginationDisabled] = useState(false);

    useEffect(() => {
        if (currentImages.length) {
            myStorage.setItem(
                "image",
                JSON.stringify({
                    id: currentImages[0].id,
                    thumbnail: currentImages[0].image_url,
                    artist: currentImages[0].artist,
                    title: currentImages[0].title,
                    technique: currentImages[0].technique,
                    dimensions: currentImages[0].dimensions,
                    price: currentImages[0].price,
                    notes: currentImages[0].notes,
                    storageLocation: currentImages[0].storageLocation,
                    cell: currentImages[0].cell,
                    position: currentImages[0].position,
                    downloadUrl: currentImages[0].download_url
                })
            );
        }
    }, [currentImages]);

    const handleDialogOpen = () => {
        setIsDeleteDialogOpen(true)
    }

    const handleDialogClose = () => {
        setIsDeleteDialogOpen(false)
    }
    
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
            return  <DetailsView
                searchResults={searchResults}
                handleDialogOpen={handleDialogOpen}
                page={page} 
                sortField={sortField}
                sortOrder={sortOrder} 
                handleSearchResults={setSearchResults}
                handlePagesCount={setPagesCount} 
                handleTotalCount={setTotalCount}
                handleError={setError}
                handleLoading={setLoading}
            />
        } else {
            return  <ListView
                searchResults={searchResults}
                handleUpdatedEntry={setUpdatedEntry}
                handleDialogOpen={handleDialogOpen}
                page={page} 
                sortField={sortField}
                sortOrder={sortOrder} 
                handleSearchResults={setSearchResults}
                handlePagesCount={setPagesCount} 
                handleTotalCount={setTotalCount}
                handleError={setError}
                handleLoading={setLoading}
            /> 
        }
    }

    const handleKeywords = (enteredKeywords) => {
        setKeywords(enteredKeywords)
    }

    const handleLocationChanged = () => {
        setLocationChanged(prev => !prev)
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
                    handleDialogClose={handleDialogClose}
                    isDeleting={isDeleting}
                    handleIsDeleting={setIsDeleting}
                    
                />
                
                <div className="search-actions-container">
                    <div className="main-actions-pdf-location-container">
                        <img src={PdfIcon} className='icon' onClick={() => navigate('/pdf')}/>
                        {currentImages.length ?
                            <img src={LocationIcon} className='icon' onClick={prepareImagesForLocationChange}/> : <></>}
                    </div>
                
                    <>
                        <Sort
                            sortField={sortField}
                            sortOrder={sortOrder}
                            handleSortField={setSortField}
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

                        <div className="view-mode-icons-container">
                            <img className={viewMode === 'thumbnail' ? 'selected icon' : 'icon'} src={ThumbnailViewIcon} onClick={() => setViewMode('thumbnail')}/>
                            <img className={viewMode === 'details' ? 'selected icon' : 'icon'} src={DetailsViewIcon} onClick={() => setViewMode('details')}/>
                            <img className={viewMode === 'list' ? 'selected icon' : 'icon'} src={ListViewIcon} onClick={() => setViewMode('list')}/>
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
