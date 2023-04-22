/* eslint-disable indent */
import React, { useContext, useEffect, useState } from "react";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Gallery.css";
import "./App.css";
import { CircularProgress, Pagination, IconButton, InputBase, Paper } from "@mui/material";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import InfoDialog from "./InfoDialog";
import Message from "./Message";
//import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//import { yellow, green } from '@mui/material/colors';

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ConfirmationDialog from "./ConfirmationDialog";
import {ImageContext} from "./App";

const Gallery = () => {

    const {currentImage, setCurrentImage, setIsInfoModalOpen} = useContext(ImageContext)
    const myStorage = window.localStorage

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        error: false,
        message: ""
    })
    const [results, setResults] = useState([])
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteConfOpen, setIsDeleteConfOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [deletedSuccessful, setDeleteSuccessful] = useState(false);
    const [page, setPage] = useState(1)
    const [keyword, setKeyword] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [pagesCount, setPagesCount] = useState(0)

    useEffect(() => {
        getAll()
    }, [page]);

    useEffect(() => {
        if (currentImage) {
            myStorage.setItem('image', JSON.stringify(
                {  id: currentImage.id,
                   thumbnail: currentImage.image_url,
                   artist: currentImage.artist, 
                   title: currentImage.title, 
                   technique: currentImage.technique, 
                   dimensions: currentImage.dimensions, 
                   price: currentImage.price,
                   notes: currentImage.notes,
                   storageLocation: currentImage.storageLocation,
                   cell: currentImage.cell,
                   position: currentImage.position
                }
            ))
        }
    }, [currentImage])

    const getAll = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/artworks?count=25&page=${page}`);
        const data = await res.json();
        const {arts, artsCount} = data
       
        if (res.status === 200) {
            setResults(arts)
            setSearchResults(arts)
            setPagesCount(Math.ceil(artsCount / 25))
            setTotalCount(artsCount)
            setLoading(false);
        } else {
            setError({error: true, message: ""})
            setLoading(false);
        }
     
    };

    const searchByKeyword = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/artworks/${keyword}`);
        const data = await res.json();
       
        if (res.status === 200) {
            setSearchResults(data)
            setLoading(false);
        } else {
            setLoading(false);
        }
     
    }

    const triggerSearchWithEnter = (e) => {
        if (e.charCode === 13) {
            e.preventDefault()
            searchByKeyword()
        }
    }

    const onChange = (e) => {
        setKeyword(e.target.value)
        if (!e.target.value) setSearchResults(results)
    }

    const openInfoDialog = (art) => {
        setIsInfoModalOpen(true)
        setCurrentImage(art)
    }
    
    const deleteOne = async (originalFilename, filename, id) => {
        setIsDeleting(true);

        await axios.delete(`http://localhost:5000/api/artworks/${originalFilename}`,
            {originalFilename})

        await axios.delete(`http://localhost:5000/api/artworks/${filename}`,{filename})
        const response = await axios.delete(
            `http://localhost:5000/api/artworks/${id}`,
            { id }
        );
        
        if (response.status === 200) {
            getAll()
            setIsDeleting(false);
            setDeleteSuccessful(true)
        }
        
    };

    const noNextPage = () => {
        const currentPage = page + 1
        const lastPage = Math.ceil(totalCount/25)
        if (currentPage === lastPage) return true
    }

    const isTherePrevPage = () => {
        return page !== 0
    }

    return (
        <>
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
                {currentImage &&
                 <InfoDialog
                 setIsDeleteConfOpen={setIsDeleteConfOpen}
                 searchResults={searchResults}
                 getAllEntries={getAll}
             />}
            <ConfirmationDialog 
            deleteImageAndEntry={deleteOne}
            isDeleteConfOpen={isDeleteConfOpen}
            setIsDeleteConfOpen={setIsDeleteConfOpen}
            />

            <SecondaryNavbar />

            <div className="searchBar">
                <Paper
                    component="form"
                    sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "70vw", marginLeft: "auto", marginRight: "auto" }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search..."
                        inputProps={{ "aria-label": "search" }}
                        onChange={onChange}
                        onKeyPress={triggerSearchWithEnter} />
                    <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={searchByKeyword}>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>

            {loading || isDeleting ? (
                <CircularProgress className="loader" color="primary" />
            ) : (
                <><div className="gallery">
                    {searchResults.length ?

                        searchResults.map((art, id) => (

                            <div className="galleryItem" key={id}>
                                <span className="imagePositionLabel">{art.position}</span>
                                <LazyLoadImage
                                    effect="blur"
                                    className="galleryImage"
                                    src={art.image_url}
                                    width="100%"
                                    height="auto"
                                    onClick={() => openInfoDialog(art)}
                                    alt="no preview" />
                                {/*
<div className="imageButtons">
    {art.onWall || art.inExhibition ?
        <div>
            <Tooltip title={art.onWall && "on a wall" || art.inExhibition && "in exhibition"} placement="top">
                <span>
                    <IconButton disabled>
                        <CheckCircleIcon sx={{ color: art.onWall && yellow[500] || art.inExhibition && green[500] }} />
                    </IconButton>
                </span>

            </Tooltip>
        </div> : <></>}
</div> */}
                                <div className="mainImageInfoContainer">
                                    <span>{art.artist}</span>
                                    <span>{art.dimensions}</span>
                                </div>
                            </div>
                        )) :
                      <h3 className="nothingFound">Nothing was found!</h3>
                      }
                </div>

                </>
            )}

            {searchResults.length ?
             <Pagination
             count={pagesCount && pagesCount}
             page={page}
             variant="outlined"
             color="primary"
             sx={{ margin: "5rem"}}
             onChange={(event, page) => setPage(page)}
             showFirstButton={isTherePrevPage && true}
             showLastButton={noNextPage && true}
             /> : <></>}
           
        </>
    );
};
export default Gallery;
