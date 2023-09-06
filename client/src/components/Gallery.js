import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Gallery.css";
import "./App.css";
import {CircularProgress, Pagination} from "@mui/material";
import axios from "axios";
import Message from "./Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ImageContext } from "./contexts/ImageContext";
import CascadingDropdowns from "./CascadingDropdowns";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import CustomDialog from "./CustomDialog";
import ThumbnailView from "./ThumbnailView";
import ListView from "./ListView";
import Sort from "./Sort";
import { useParams } from "react-router-dom";


const Gallery = () => {
    const {
        currentImages,
        setCurrentImages,
        setUpdatedEntry,
    } = useContext(ImageContext);
    const myStorage = window.localStorage;
  

    let navigate = useNavigate();
    const {name} = useParams()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        error: false,
        message: "",
    });
    const [results, setResults] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [deletedSuccessful, setDeleteSuccessful] = useState(false);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [pagesCount, setPagesCount] = useState(0);
    const [thumbnailView, setThumbnailView] = useState(true)
    const [selectedImageIndex, setSelectedImageIndex] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [multiSelectMode, setMultiSelectMode] = useState(false)

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: "",
    });

    const [sortField, setSortField] = useState('id')
    const [sortOrder, setSortOrder] = useState('desc')

    useEffect(() => {
        fetchData();
    }, [page, sortField, sortOrder, isDeleting]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/artworks/${name.split(':')[1]}?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`,
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const { arts, artsCount } = data;
            setResults(arts);
            setSearchResults(arts);
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
            searchByKeyword();
        }
    };

    const searchByKeyword = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/artworks/artwork/${keyword}`);
        const data = await res.json();

        if (res.status === 200) {
            setSearchResults(data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const onChange = (e) => {
        setKeyword(e.target.value);
        if (!e.target.value) setSearchResults(results);
    };

    const deleteOne = async (originalFilename, filename, id) => {
        setIsDeleting(true);

        const params = {originalFilename, filename, id}

        await axios.delete(
            `http://localhost:5000/artworks/artwork/${params}`,
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

    const handleSelectImages = () => {
        setMultiSelectMode(prev => !prev)
        setCurrentImages([])
    }

    const updateLocation = async (formControlData) => {
        const ids = []
        for (let image of currentImages) {
            ids.push(image.id)
        }
        const response = await axios.put(
            `http://localhost:5000/storage/update-location`,
            {ids, formControlData}
        );
        if (response.status === 200) {
            setOpenModal(false);
            setMultiSelectMode(false)
            setCurrentImages([])
            await fetchData()
        } else {
            setOpenModal(false);
            setMultiSelectMode(false)
            setCurrentImages([])
        }
    }

    const prepareImagesForLocationChange = async() => {
        setOpenModal(true)
    }

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
                        if (currentImages.length === 1) {
                            setCurrentImages([]);
                            setIsDeleteConfOpen(false);
                        } else {
                            setIsDeleteConfOpen(false);
                        }
                    } } />}

            {openModal &&
                <CustomDialog
                    openModal={openModal}
                    setOpenModal={() => setOpenModal(false)}
                    title="This will change the location of all selected entries, are you sure?"
                    handleClickYes={() => updateLocation(formControlData)}
                    handleClickNo={() => { setOpenModal(false), setCurrentImages([]), setMultiSelectMode(false); } }
                >
                    <CascadingDropdowns
                        formControlData={formControlData}
                        setFormControlData={setFormControlData}
                        openInModal={openModal} />

                </CustomDialog>}

            <SearchBar
                onChange={onChange}
                searchByKeyword={searchByKeyword}
                triggerSearchWithEnter={triggerSearchWithEnter} />
            {loading || isDeleting ? (
                <CircularProgress className="loader" color="primary" />
            ) : (
                <>
                    <div className="flex max-sm:flex-col items-center justify-center mt-16 max-sm:mb-8 max-sm:mb-8">
                        <button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                            onClick={handleSelectImages}>Select images</button>
                        {currentImages.length ?
                            <><button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                onClick={() => navigate("/pdf")}>Create a certificate</button>
                            <button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                onClick={prepareImagesForLocationChange}>Change Location</button>
                            <button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                onClick={() => setIsDeleteConfOpen(true)}>Delete selected</button>
                            <button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                onClick={() => { setMultiSelectMode(false); setCurrentImages([]); } }>Unselect all</button>
                            </> :
                            <></>}

                    </div>
                    <></>
                    {searchResults.length !== 0 &&
                        <Sort
                            sortField={sortField}
                            handleSortField={setSortField}
                            sortOrder={sortOrder}
                            handleSortOrder={setSortOrder} />}
                    {thumbnailView ?
                        <ThumbnailView
                            searchResults={searchResults}
                            multiSelectMode={multiSelectMode}
                            handleThumbnailView={setThumbnailView}
                            handleSelectedImageIndex={setSelectedImageIndex} />
                        :
                        selectedImageIndex != null &&
                        <ListView
                            searchResults={searchResults}
                            handleThumbnailView={setThumbnailView}
                            handleUpdatedEntry={setUpdatedEntry}
                            handleMultiSelectMode={setMultiSelectMode}
                            multiSelectMode={multiSelectMode}
                            handleConfirmationDialog={setIsDeleteConfOpen}
                            fetchData={fetchData} />}
                    {!searchResults.length && <div className="flex flex-row justify-center content-center max-sm:ml-20 max-sm:mr-20">Nothing was found!</div>}
                </>
            )}

            {searchResults.length && !loading ? (
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
