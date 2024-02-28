import { Autocomplete, IconButton, InputBase, Paper, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import './SearchAndFiltersBar.css'
import { getAllEntries, getAllEntriesByKeywords } from '../utils/apiCalls';
import { useParams } from 'react-router-dom';

const boxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'

function SearchAndFiltersBar({page, setPage, handlePagesCount, handleTotalCount, sortField, sortOrder, setPaginationDisabled, handleLoading, handleError, handleSearchResults, keywords, handleKeywords}) {

    const [artists, setArtists] = useState([])
    const {name} = useParams()
   
    useEffect(() => {
        getArtists()
    },[])

    const onChange = event => {
        if (!event.target.value) {
            setPage(1);
            getAllData()
        }
        const inputKeywords = event.target.value.split(' ');
        handleKeywords(inputKeywords);
       
    };

    const triggerSearchWithEnter = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            getDataFromSearch()
        }
    };

    const getDataFromSearch = async () => {
        handleLoading(true);
        try {
            const data = await getAllEntriesByKeywords(keywords, page, sortField, sortOrder)
            const { arts, artsCount } = data;
            handleSearchResults(arts);
            handlePagesCount(Math.ceil(artsCount / 25));
            handleTotalCount(artsCount);
        } catch(error) {
            handleError({ error: true, message: error.message });
        } finally {
            handleLoading(false);
        }
        
    }

    const getAllData = useCallback(async () => {
        handleLoading(true);
        try {
            const data = await getAllEntries(name, page, sortField, sortOrder);
            const { arts, artsCount } = data;
            handleSearchResults(arts);
            handlePagesCount(Math.ceil(artsCount / 25));
            handleTotalCount(artsCount);
        } catch (error) {
            handleError({ error: true, message: error.message });
        } finally {
            handleLoading(false);
        }
    }, [name, page, sortField, sortOrder]); 

    const getArtists = async () => {
        const res = await fetch('http://localhost:5000/artists/allFromArtworks')
        const data = await res.json()

        const normalizedArtists = data.map(artist => artist.toLowerCase().trim());
        const uniqueNormalizedArtists = [...new Set(normalizedArtists)];
        const uniqueArtists = uniqueNormalizedArtists.map(normalizedArtist => {
            return data.find(artist => artist.toLowerCase().trim() === normalizedArtist);
        });

        setArtists(uniqueArtists);
    }

    const filterByArtist = async (event, artist) => {
        if (!artist && artist !== "-") {
            setPaginationDisabled(false);
            getAllData()
        } else {
            const res = await fetch(`http://localhost:5000/artworks/artworksByArtist/${artist}`)
            const data = await res.json()
            handleSearchResults(data.artworks);
            setPaginationDisabled(true)
        }
        setPage(1);
    };
  
    return (
        <div className="search-filters-container">
            <Autocomplete
                sx={{
                    width: '180px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    marginRight: '1rem',
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: 'none',
                        boxShadow
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        border: 'none',
                        boxShadow
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: 'none',
                        boxShadow
                    },
                }}
                disablePortal
                options={artists}
                renderInput={(params) => <TextField {...params} label="Select artist" />}
                onChange={(event, newValue) => filterByArtist(event, newValue)} />
            <Paper
                component="form"
                sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                    marginRight: "auto",
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    boxShadow
                }}
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
                    onClick={getDataFromSearch}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
    )
}

export default SearchAndFiltersBar