import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Gallery.css";
import "./App.css";
import {CircularProgress, Pagination} from "@mui/material";
import axios from "axios";
import Message from "./Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ImageContext } from "./contexts/ImageContext";
import SearchAndFiltersBar from "./SearchAndFiltersBar";
import { useNavigate } from "react-router-dom";
import CustomDialog from "./CustomDialog";
import ThumbnailView from "./ThumbnailView";
import DetailsView from "./DetailsView";
import Sort from "./Sort";
import { useParams } from "react-router-dom";
import ListViewIcon from '../components/assets/list-view-solid.svg';
import ThumbnailViewIcon from '../components/assets/thumbnail-view-solid.svg';
import ListView from "./ListView";
import DetailsViewIcon from '../components/assets/details-view-solid.svg';
import LocationIcon from '../components/assets/move-solid.svg'
import PdfIcon from '../components/assets/pdf-solid.svg'
import CascadingDropdowns from "./CascadingDropdowns";

const Gallery = () => {
    const {
        currentImages,
        setCurrentImages,
        setUpdatedEntry,
        isEditMode
    } = useContext(ImageContext);
    const myStorage = window.localStorage;
  

    let navigate = useNavigate();
    const {name} = useParams()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        error: false,
        message: "",
    });

    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [originalSearchResults, setOriginalSearchResults] = useState([]);
    const [deletedSuccessful, setDeleteSuccessful] = useState(false);
    const [page, setPage] = useState(1);
    const [keywords, setKeywords] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pagesCount, setPagesCount] = useState(0);
    const [viewMode, setViewMode] = useState('thumbnail')
    const [paginationDisabled, setPaginationDisabled] = useState(false);

    const [sortField, setSortField] = useState('id')
    const [sortOrder, setSortOrder] = useState('desc')
    const [locationReplaceDialogOpened, setLocationReplaceDialogOpened] = useState(false)

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: "",
    });

    useEffect(() => {
        keywords.length ? searchByKeywords() : fetchData()
    }, [page, sortField, sortOrder, isDeleting]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://app.plus359gallery.com/artworks/${name.split(':')[1]}?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`,
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const { arts, artsCount } = data;
            setSearchResults(arts);
            setOriginalSearchResults(arts)
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
            setLoading(false);
        } catch (error) {
            setError({ error: true, message: error.message });
            setLoading(false);
        }
    };

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


    const triggerSearchWithEnter = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            searchByKeywords();
        }
    };

    const onChange = event => {
        if (!event.target.value) {
            const res = fetchData()
            setSearchResults(res);
        }
        const inputKeywords = event.target.value.split(' ');
        setKeywords(inputKeywords);
       
    };
    
    const searchByKeywords = async() => {
        if (!keywords.length) return;

        try {
            const res = await fetch(`https://app.plus359gallery.com/artworks/artwork?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keywords }),
            })
    
            const data = await res.json();
            const { arts, artsCount } = data;
            setSearchResults(arts);
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
            setLoading(false);
        } catch (error) {
            setError({ error: true, message: error.message });
            setLoading(false);
        }
    };

    const deleteOne = async (originalFilename, filename, id) => {
        setIsDeleting(true);

        const params = {originalFilename, filename, id}

        await axios.delete(
            `https://app.plus359gallery.com/artworks/artwork/${params}`,
            { params }
        );

        setIsDeleting(false)

    };

    const noNextPage = () => {
        const currentPage = page + 1;
        const lastPage = Math.ceil(totalCount / 25);
        if (currentPage === lastPage) return true;
    };

    const isTherePrevPage = () => {
        return page !== 0;
    };

    const handleDeleteOne = async (originalName, filename, id) => {
        deleteOne(originalName, filename, id)
        setIsDeleteConfOpen(false)
        setDeleteSuccessful(true);
        setCurrentImages(prev => prev.filter(image => !currentImages.some(img => img.id === image.id)));
    };

    const handleDeleteMultiple = async () => {

        const deletePromises = currentImages.map(image =>
            deleteOne(image.download_key, image.image_key, image.id)
        );

        try {
            await Promise.all(deletePromises);
            setIsDeleting(false);
            setDeleteSuccessful(true);
            setCurrentImages(prev => prev.filter(image => !currentImages.some(img => img.id === image.id)));

            setIsDeleteConfOpen(false)
        } catch (error) {
            setIsDeleting(false);
            setDeleteSuccessful(false);
            setIsDeleteConfOpen(false)
        }
        
    }
    
    const prepareImagesForLocationChange = async() => {
        setLocationReplaceDialogOpened(true)
    }

    const updateLocation = async (formControlData) => {
        const ids = []
        for (let image of currentImages) {
            ids.push(image.id)
        }
        const response = await axios.put(
            `https://app.plus359gallery.com/storage/update-location`,
            {ids, formControlData}
        );
        if (response.status === 200) {
            setLocationReplaceDialogOpened(false);
            setCurrentImages([])
            await fetchData()
        } else {
            setLocationReplaceDialogOpened(false);
            setCurrentImages([])
        }
    }

    const renderViewMode = () => {
        if (viewMode === 'thumbnail') {
            return  <ThumbnailView
                searchResults={searchResults}
            />  
        } else if (viewMode === 'details') {
            return  <DetailsView
                searchResults={searchResults}
                handleConfirmationDialog={setIsDeleteConfOpen}
                fetchData={searchByKeywords}
            />
        } else {
            return  <ListView
                searchResults={searchResults}
                fetchData={searchByKeywords}
                handleUpdatedEntry={setUpdatedEntry}
                handleConfirmationDialog={setIsDeleteConfOpen}
            /> 
        }
    }

    return (
        <><Navbar /><div className="gallery">
            <Message
                open={error.error}
                handleClose={() => setError({ error: false, message: "" })}
                message={error.message}
                severity="error" />

            <Message
                open={deletedSuccessful}
                handleClose={() => setDeleteSuccessful(false)}
                message="Entry deleted successfully!"
                severity="success" />

            {locationReplaceDialogOpened &&
                <CustomDialog
                    openModal={locationReplaceDialogOpened}
                    setOpenModal={() => setLocationReplaceDialogOpened(false)}
                    title="This will change the location of all selected entries, are you sure?"
                    handleClickYes={() => updateLocation(formControlData)}
                    handleClickNo={() => { setLocationReplaceDialogOpened(false), setCurrentImages([])} }
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                >
                    <CascadingDropdowns
                        setFormControlData={setFormControlData}
                        openInModal={locationReplaceDialogOpened} />

                </CustomDialog>}

            {isDeleteConfOpen &&
                <CustomDialog
                    openModal={isDeleteConfOpen}
                    setOpenModal={() => setIsDeleteConfOpen(false)}
                    title="Are you sure you want to delete the entry ?"
                    handleClickYes={() => {
                        if (currentImages.length > 1) {
                            handleDeleteMultiple(currentImages[0].download_key, currentImages[0].image_key, currentImages[0].id);
                        } else {
                            handleDeleteOne(currentImages[0].download_key, currentImages[0].image_key, currentImages[0].id);
                        }
                    } }
                    handleClickNo={() => {
                        if (currentImages.length === 1 && !isEditMode) {
                            setCurrentImages([]);
                            setIsDeleteConfOpen(false);
                        } else {
                            setIsDeleteConfOpen(false);
                        }
                    } } 
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                />}
                
            <div className="search-actions-container">
                <div className="main-actions-pdf-location-container">
                    <img src={PdfIcon} className='icon' onClick={() => navigate('/pdf')}/>
                    {currentImages.length ?
                        <img src={LocationIcon} className='icon' onClick={prepareImagesForLocationChange}/> : <></>}
                </div>
                
                <>
                    <Sort
                        sortField={sortField}
                        handleSortField={setSortField}
                        sortOrder={sortOrder}
                        handleSortOrder={setSortOrder} />
                    <SearchAndFiltersBar
                        onChange={onChange}
                        searchByKeyword={searchByKeywords}
                        triggerSearchWithEnter={triggerSearchWithEnter}
                        setPaginationDisabled={setPaginationDisabled}
                        setSearchResults={setSearchResults}
                        originalSearchResults={originalSearchResults}
                        setPage={setPage} />
                    <div className="view-mode-icons-container">
                        <img className={viewMode === 'thumbnail' ? 'selected icon' : 'icon'} src={ThumbnailViewIcon} onClick={() => setViewMode('thumbnail')}/>
                        <img className={viewMode === 'details' ? 'selected icon' : 'icon'} src={DetailsViewIcon} onClick={() => setViewMode('details')}/>
                        <img className={viewMode === 'list' ? 'selected icon' : 'icon'} src={ListViewIcon} onClick={() => setViewMode('list')}/>
                    </div>
                </>
                
            </div>        
            {loading || isDeleting ? (
                <CircularProgress className="loader" color="primary" />
            ) : (
                <>
                    {renderViewMode()}
                    {!searchResults.length && <div className="flex flex-row justify-center content-center max-sm:ml-20 max-sm:mr-20">Nothing was found!</div>}
                </>
            )}

            {searchResults.length && !paginationDisabled && !loading ? (
                <Pagination
                    count={pagesCount && pagesCount}
                    page={page}
                    variant="outlined"
                    color="primary"
                    sx={{ margin: "5rem" }}
                    onChange={(event, page) => setPage(page)}
                    showFirstButton={isTherePrevPage && true}
                    showLastButton={noNextPage && true}
                    siblingCount={3}
                    boundaryCount={2} />
            ) : (
                <></>
            )}
        </div></>
    );
};
export default Gallery;
