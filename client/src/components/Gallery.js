import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Gallery.css";
import "./App.css";
import {Checkbox, CircularProgress, Pagination} from "@mui/material";
import axios from "axios";
import Message from "./Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import ConfirmationDialog from "./ConfirmationDialog";
import { ImageContext } from "./App";
import { saveAs } from "file-saver";
import CascadingDropdowns from "./CascadingDropdowns";
import SearchBar from "./SearchBar";
import IconMoreHorizontal from "./icons as components/IconMoreHorizontal";
import IconBxsDownload from "./icons as components/IconBxsDownload";
import Icon277Exit from "./icons as components/IconExit";
import IconSave from "./icons as components/IconSave";
import IconEdit from "./icons as components/IconEdit";
import IconDelete from "./icons as components/IconDelete";
import { blue } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";



const Gallery = () => {
    const {
        currentImages,
        setCurrentImages,
        setUpdatedEntry,
        updatedEntry,
        setIsEditMode,
        isEditMode,
    } = useContext(ImageContext);
    const myStorage = window.localStorage;

    let navigate = useNavigate();

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
    // eslint-disable-next-line no-unused-vars
    const [multiSelectMode, setMultiSelectMode] = useState(false)

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: "",
    });

    useEffect(() => {
        getAll();
    }, [page]);

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

    const onChangeEditableInput = (event) => {
        const { name, value } = event.target;
        setUpdatedEntry((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const getAll = async () => {
        setLoading(true);
        const res = await fetch(
            `http://localhost:5000/api/artworks?count=25&page=${page}`
        );
        const data = await res.json();
        const { arts, artsCount } = data;

        if (res.status === 200) {
            setResults(arts);
            setSearchResults(arts);
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
            setLoading(false);
        } else {
            setError({ error: true, message: "" });
            setLoading(false);
        }
    };

    const triggerSearchWithEnter = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            searchByKeyword();
        }
    };

    const searchByKeyword = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/artworks/${keyword}`);
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

        await axios.delete(
            `http://localhost:5000/api/artworks/${originalFilename}`,
            { originalFilename }
        );

        await axios.delete(`http://localhost:5000/api/artworks/${filename}`, {
            filename,
        });
        const response = await axios.delete(
            `http://localhost:5000/api/artworks/${id}`,
            { id }
        );

        if (response.status === 200) {
            getAll();
            setIsDeleting(false);
            setDeleteSuccessful(true);
        }
    };

    const downloadOriginalImage = (downloadUrl, name) => {
        console.log(downloadUrl, name)
        saveAs(downloadUrl, name);
    };

    const noNextPage = () => {
        const currentPage = page + 1;
        const lastPage = Math.ceil(totalCount / 25);
        if (currentPage === lastPage) return true;
    };

    const isTherePrevPage = () => {
        return page !== 0;
    };

    const prefillEditableFields = (id) => {
        setIsEditMode(true);
        let copyOfEntry;

        copyOfEntry = searchResults.find((art) => art.id === id);
        const {
            id: copyId,
            artist,
            title,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cell,
            position,
            onWall,
            inExhibition,
        } = copyOfEntry;
        setUpdatedEntry({
            id: copyId,
            artist,
            title,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cell,
            position,
            onWall,
            inExhibition,
        });
    };

    const cancelEditing = () => {
        setIsEditMode(false);
        setCurrentImages([])
    };

    const saveUpdatedEntry = (id) => {
        updateEntry(id);
        myStorage.removeItem("image");
        setCurrentImages([])
        setMultiSelectMode(false)
    };

    const updateEntry = async (id) => {
        const response = await axios.put(
            `http://localhost:5000/api/artworks/${id}`,
            updatedEntry
        );
        if (response.status === 200) {
            setIsEditMode(false);
            setUpdatedEntry({});
            getAll();
        } else {
            setIsEditMode(false);
            setUpdatedEntry({});
        }
    };

    const checkBoxHandler = (e, id) => {
        const index = searchResults.findIndex(art => art.id === id)
        if (e.target.checked) {
           
            setCurrentImages(prev => [...new Set(prev).add(searchResults[index])])
        } else {
            setCurrentImages(prev => [...prev.filter(image => image.id !== id )])
        }
    }

    const handleSelectImages = () => {
        setMultiSelectMode(prev => !prev)
        setCurrentImages([])
    }

    return (
        <>
            <Message
                open={error.error}
                handleClose={() => setError({ error: false, message: "" })}
                message={error.message}
                severity="error"
            />

            <Message
                open={deletedSuccessful}
                handleClose={() => setDeleteSuccessful(false)}
                message="Entry deleted successfully!"
                severity="success"
            />
            <ConfirmationDialog
                deleteOne={deleteOne}
                isDeleteConfOpen={isDeleteConfOpen}
                setIsDeleteConfOpen={setIsDeleteConfOpen}
            />

            <Navbar />

            <SearchBar
                onChange={onChange}
                searchByKeyword={searchByKeyword}
                triggerSearchWithEnter={triggerSearchWithEnter}
            />

            {loading || isDeleting ? (
                <CircularProgress className="loader" color="primary" />
            ) : (
                <>
                    <div className="flex max-sm:flex-col items-center justify-center mt-16 max-sm:mb-8 max-sm:mb-8">
                        <button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                            onClick={handleSelectImages}>Select images</button>
                        {currentImages.length ?
                            <><button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                onClick={() => navigate("/pdf")}>Generate PDF</button>
                            <button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:mb-3 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                onClick={() => setIsDeleteConfOpen(true)}>Delete selected</button>
                            <button className='flex bg-main text-white rounded mr-4 max-sm:mr-0 max-sm:w-2/4 justify-center px-3 py-1.5 text-md leading-6 text-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                                onClick={() => {setMultiSelectMode(false); setCurrentImages([])}}>Unselect all</button>
                            </> :
                            <></>
                        }
                       
                    </div>
            
                    <div className="grid grid-cols-4 gap-x-3 max-sm:grid-cols-1 max-sm:p-0 p-20">
                        {searchResults.length ? (
                            searchResults.map((art, id) => (
                                <><div
                                    key={id}
                                    className="bg-white my-7 border border shadow-lg shadow-grey rounded-md h-max max-2xl:w-3/4">
                                    <div className="flex items-center p-4">

                                        <p className="flex-1 text-sm font-semibold">{art.artist}</p>
                                        <IconMoreHorizontal className="h-5" />
                                    </div>

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
                                    <img className="w-full" src={art.image_url} />
                                    <div className="flex justify-between p-4">
                                        <IconBxsDownload
                                            onClick={() => downloadOriginalImage(art.download_url, art.download_key)} />
                                        {isEditMode && currentImages.length && currentImages[0].id === art.id &&
                                            <>
                                                <Icon277Exit onClick={cancelEditing} />
                                                <IconSave onClick={() => saveUpdatedEntry(art.id)} />
                                            </>}

                                        <IconEdit
                                            onClick={() => {
                                                setCurrentImages([art]);
                                                setIsEditMode(true);
                                                prefillEditableFields(art.id);
                                            } } />

                                        <IconDelete
                                            onClick={() => {
                                                setCurrentImages([art]);
                                                setIsDeleteConfOpen(true);
                                            } } />
                                    </div>
                                    <div>
                                        <p className="px-4 mb-4">
                                            {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                                                <div>
                                                    <input
                                                        name="artist"
                                                        onChange={(event) => onChangeEditableInput(event)}
                                                        className="text-lg editable"
                                                        disabled={!isEditMode}
                                                        value={isEditMode ? updatedEntry.artist : currentImages[0].artist} />
                                                    <input
                                                        name="title"
                                                        onChange={(event) => onChangeEditableInput(event)}
                                                        className="text-lg editable"
                                                        disabled={!isEditMode}
                                                        value={isEditMode ? updatedEntry.title : currentImages[0].title} />
                                                    <input
                                                        name="technique"
                                                        onChange={(event) => onChangeEditableInput(event)}
                                                        className="text-lg editable"
                                                        disabled={!isEditMode}
                                                        value={updatedEntry.technique || currentImages[0].technique} />
                                                    <input
                                                        name="dimensions"
                                                        onChange={(event) => onChangeEditableInput(event)}
                                                        className="text-lg editable"
                                                        disabled={!isEditMode}
                                                        value={updatedEntry.dimensions || currentImages[0].dimensions} />
                                                    <input
                                                        name="price"
                                                        onChange={(event) => onChangeEditableInput(event)}
                                                        className="text-lg editable"
                                                        disabled={!isEditMode}
                                                        value={updatedEntry.price || currentImages[0].price} />

                                                    <input
                                                        name="notes"
                                                        onChange={(event) => onChangeEditableInput(event)}
                                                        className="text-lg editable"
                                                        disabled={!isEditMode}
                                                        value={updatedEntry.notes || currentImages[0].notes} />
                                                </div>
                                            ) : (
                                                <>
                                                    <p>
                                                        {`${art.title ? art.title : "No title"} made with ${art.technique} with dimensions ${art.dimensions}
                                                  and price of ${art.price}EU`}
                                                    </p>
                                                    <p>
                                                        {`Notes: ${art.notes}`}
                                                    </p>
                                                </>
                                            )}
                                            {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                                                <CascadingDropdowns
                                                    formControlData={formControlData}
                                                    setFormControlData={setFormControlData} />
                                            ) : (
                                                <>
                                                    <p>{`Located in: ${art.storageLocation} - ${art.cell} - ${art.position}`}</p>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                </>
                            ))
                        ) : (
                            <h3 className="nothingFound">Nothing was found!</h3>
                        )}
                    </div></>
            )}

            {searchResults.length ? (
                <Pagination
                    count={pagesCount && pagesCount}
                    page={page}
                    variant="outlined"
                    color="primary"
                    sx={{ margin: "5rem" }}
                    onChange={(event, page) => setPage(page)}
                    showFirstButton={isTherePrevPage && true}
                    showLastButton={noNextPage && true}
                />
            ) : (
                <></>
            )}
        </>
    );
};
export default Gallery;
