import { IconButton, InputBase, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import './SearchAndFiltersBar.css'
import { getAllEntries, getAllEntriesByKeywords } from '../utils/apiCalls';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from "@mui/material";
import Filters from './Filters';

function SearchAndFiltersBar({
    sortField, 
    sortOrder,
    setPaginationDisabled,
    handleLoading, 
    handleError, 
    handleSearchResults,
    keywords, 
    handleKeywords,
    isDeleting,
    locationChanged,
    setTotalCount,
    setPagesCount,
    setPage,
    page
}) {

    const [selectedArtist, setSelectedArtist] = useState()
    const [selectedCell, setSelectedCell] = useState()
    const {name} = useParams()
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const onChange = event => {
        if (!event.target.value) {
            setPage(1);
            getDataFromSearch(false);
        }
        const inputKeywords = event.target.value.split(' ');
        handleKeywords(inputKeywords);
       
    };

    const triggerSearchWithEnter = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            getDataFromSearch(true)
        }
    };

    const getDataFromSearch = async (isSearch) => {
        try {
            let data;
            if (isSearch) {
                data = await getAllEntriesByKeywords(keywords, page, sortField, sortOrder);
            } else {
                data = await getAllEntries(name, page, sortField, sortOrder);
            }
            const { arts, artsCount } = data;
            handleSearchResults(arts);
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
        } catch(error) {
            handleError({ error: true, message: error.message });
        } finally {
            handleLoading(false);
        } 
    }

    useEffect(() => {
        if (!selectedArtist && !selectedCell) getDataFromSearch(false);
    }, [page, sortField, sortOrder, isDeleting, locationChanged, selectedArtist, selectedCell]);
  
    return <>
        <div className={!isSmallDevice ?
            'search-filters-container' :
            null
        }>
            <Filters
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                selectedArtist={selectedArtist}
                setSelectedArtist={setSelectedArtist}
                handleError={handleError}
                setPaginationDisabled={setPaginationDisabled}
                setPage={setPage}
                handleSearchResults={handleSearchResults}
            />
            <Paper
                component="form"
                className={isSmallDevice ? 'mobile-search-input' :
                    'search-input filter-item'}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search" }}
                    onChange={onChange}
                    onKeyPress={triggerSearchWithEnter}
                />
                <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    onClick={() => getDataFromSearch(true)}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
      
    </>
}

export default SearchAndFiltersBar