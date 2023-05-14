import React, { useContext, useEffect, useState } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Gallery.css";
import "./App.css";
import {CircularProgress, Pagination} from "@mui/material";
import axios from "axios";
import Message from "./Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import ConfirmationDialog from "./ConfirmationDialog";
import { ImageContext } from "./App";
import { saveAs } from "file-saver";
import CascadingDropdowns from "./CascadingDropdowns";
import SearchBar from "./SearchBar";

function IconMoreHorizontal(props) {
    return (
        <svg
            cursor="pointer"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            height="20px"
            width="20px"
            {...props}
        >
            <path d="M13 12 A1 1 0 0 1 12 13 A1 1 0 0 1 11 12 A1 1 0 0 1 13 12 z" />
            <path d="M20 12 A1 1 0 0 1 19 13 A1 1 0 0 1 18 12 A1 1 0 0 1 20 12 z" />
            <path d="M6 12 A1 1 0 0 1 5 13 A1 1 0 0 1 4 12 A1 1 0 0 1 6 12 z" />
        </svg>
    );
}

function IconBxsDownload(props) {
    return (
        <svg
            cursor="pointer"
            viewBox="0 0 24 24"
            fill="currentColor"
            height="20px"
            width="20px"
            {...props}
        >
            <path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z" />
        </svg>
    );
}

function IconEdit(props) {
    return (
        <svg
            cursor="pointer"
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="20px"
            width="20px"
            {...props}
        >
            <path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z" />
        </svg>
    );
}

function IconDelete(props) {
    return (
        <svg
            cursor="pointer"
            viewBox="0 0 24 24"
            fill="currentColor"
            height="20px"
            width="20px"
            {...props}
        >
            <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12z" />
        </svg>
    );
}

function IconSave(props) {
    return (
        <svg
            cursor="pointer"
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="20px"
            width="20px"
            {...props}
        >
            <path d="M893.3 293.3L730.7 130.7c-12-12-28.3-18.7-45.3-18.7H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 176h256v112H384V176zm128 554c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144zm0-224c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z" />
        </svg>
    );
}

function Icon277Exit(props) {
    return (
        <svg
            cursor="pointer"
            viewBox="0 0 16 16"
            fill="currentColor"
            height="20px"
            width="20px"
            {...props}
        >
            <path
                fill="currentColor"
                d="M12 10V8H7V6h5V4l3 3zm-1-1v4H6v3l-6-3V0h11v5h-1V1H2l4 2v9h4V9z"
            />
        </svg>
    );
}

const Gallery = () => {
    const {
        currentImage,
        setCurrentImage,
        setUpdatedEntry,
        updatedEntry,
        setIsEditMode,
        isEditMode,
    } = useContext(ImageContext);
    const myStorage = window.localStorage;

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

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: "",
    });

    useEffect(() => {
        getAll();
    }, [page]);

    useEffect(() => {
        if (currentImage) {
            myStorage.setItem(
                "image",
                JSON.stringify({
                    id: currentImage.id,
                    thumbnail: currentImage.image_url,
                    artist: currentImage.artist,
                    title: currentImage.title,
                    technique: currentImage.technique,
                    dimensions: currentImage.dimensions,
                    price: currentImage.price,
                    notes: currentImage.notes,
                    storageLocation: currentImage.storageLocation,
                    cell: currentImage.cell,
                    position: currentImage.position,
                })
            );
        }
    }, [currentImage]);

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
    };

    const saveUpdatedEntry = (id) => {
        updateEntry(id);
        myStorage.removeItem("image");
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
                deleteImageAndEntry={deleteOne}
                isDeleteConfOpen={isDeleteConfOpen}
                setIsDeleteConfOpen={setIsDeleteConfOpen}
            />

            <SecondaryNavbar />

            <SearchBar
                onChange={onChange}
                searchByKeyword={searchByKeyword}
                triggerSearchWithEnter={triggerSearchWithEnter}
            />

            {loading || isDeleting ? (
                <CircularProgress className="loader" color="primary" />
            ) : (
                <div className="grid grid-cols-4 gap-x-3 max-sm:grid-cols-1 max-sm:p-0 mt-16 p-20">
                    {searchResults.length ? (
                        searchResults.map((art, id) => (
                            <><div
                                key={id} 
                                className="bg-white my-7 border border shadow-lg shadow-grey rounded-md h-max w-350px">
                                <div className="flex items-center p-4">
                                    <p className="flex-1 text-sm font-semibold">{art.artist}</p>
                                    <IconMoreHorizontal className="h-5" />
                                </div>
                                <img className="w-full" src={art.image_url} />
                                <div className="flex justify-between p-4">
                                    <IconBxsDownload
                                        onClick={() => downloadOriginalImage(art.download_url, art.download_key)} />
                                    {isEditMode && currentImage && currentImage.id === art.id &&
                                            <>
                                                <Icon277Exit onClick={cancelEditing} />
                                                <IconSave onClick={() => saveUpdatedEntry(art.id)} />
                                            </>}

                                    <IconEdit
                                        onClick={() => {
                                            setCurrentImage(art);
                                            setIsEditMode(true);
                                            prefillEditableFields(art.id);
                                        } } />

                                    <IconDelete
                                        onClick={() => {
                                            setCurrentImage(art);
                                            setIsDeleteConfOpen(true);
                                        } } />
                                </div>
                                <div>
                                    <p className="px-4 mb-4">
                                        {isEditMode && currentImage && currentImage.id === art.id ? (
                                            <div>
                                                <input
                                                    name="title"
                                                    onChange={(event) => onChangeEditableInput(event)}
                                                    className="text-lg editable"
                                                    disabled={!isEditMode}
                                                    value={isEditMode ? updatedEntry.title : currentImage.title} />
                                                <input
                                                    name="technique"
                                                    onChange={(event) => onChangeEditableInput(event)}
                                                    className="text-lg editable"
                                                    disabled={!isEditMode}
                                                    value={updatedEntry.technique || currentImage.technique} />
                                                <input
                                                    name="dimensions"
                                                    onChange={(event) => onChangeEditableInput(event)}
                                                    className="text-lg editable"
                                                    disabled={!isEditMode}
                                                    value={updatedEntry.dimensions || currentImage.dimensions} />
                                                <input
                                                    name="price"
                                                    onChange={(event) => onChangeEditableInput(event)}
                                                    className="text-lg editable"
                                                    disabled={!isEditMode}
                                                    value={updatedEntry.price || currentImage.price} />

                                                <input
                                                    name="notes"
                                                    onChange={(event) => onChangeEditableInput(event)}
                                                    className="text-lg editable"
                                                    disabled={!isEditMode}
                                                    value={updatedEntry.notes || currentImage.notes} />
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
                                        {isEditMode && currentImage && currentImage.id === art.id ? (
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
                </div>
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
