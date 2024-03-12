import { Autocomplete, IconButton, InputBase, Paper, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from './assets/filter-solid.svg'
import './SearchAndFiltersBar.css'
import { getAllEntries, getAllEntriesByKeywords } from '../utils/apiCalls';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from "@mui/material";
import axios from 'axios';

const boxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'

function SearchAndFiltersBar({page, setPage, handlePagesCount, handleTotalCount, sortField, sortOrder, setPaginationDisabled, handleLoading, handleError, handleSearchResults, keywords, handleKeywords}) {

    const [artists, setArtists] = useState([])
    const [cells, setCells] = useState([])
    const [selectedArtist, setSelectedArtist] = useState()
    const [selectedCell, setSelectedCell] = useState()
    const {name} = useParams()
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        getArtists()
        getCells()
    },[])

    useEffect(() => {
        filterByArtistAndCellInCurrentLocation();
    }, [selectedCell, selectedArtist]);

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

    const filterByArtistAndCellInCurrentLocation = async () => {
        try {

            if (!selectedArtist && selectedArtist !== "-" && !selectedCell) {
                setPaginationDisabled(false);
                getAllData()
            } else {
                const response = await axios.get('http://localhost:5000/artworks/filterByArtistAndCell', {
                    params: {
                        cell: selectedCell,
                        artist: selectedArtist,
                        storage: name.split(':')[1]
                    },
                });
                console.log(response)
                handleSearchResults(response.data.artworks);
                setPaginationDisabled(true)
            }

            setPage(1)
        } catch (error) {
            console.error('Error fetching artworks:', error);
        }
    };

    const getArtists = async () => {
        const res = await fetch(`http://localhost:5000/artists/relatedToEntriesInStorage/${name.split(':')[1]}`)
        const data = await res.json()

        const normalizedArtists = data.map(artist => artist.toLowerCase().trim());
        const uniqueNormalizedArtists = [...new Set(normalizedArtists)];
        const uniqueArtists = uniqueNormalizedArtists.map(normalizedArtist => {
            return data.find(artist => artist.toLowerCase().trim() === normalizedArtist);
        });

        setArtists(uniqueArtists);
    }

    const getCells = async () => {
        const res = await fetch(`http://localhost:5000/storage/all/allCellsFromCurrentStorage/${name.split(':')[1]}`)
        const data = await res.json()
        const uniqueCells = [...new Set(data)]
        setCells(uniqueCells);
    }
  
    return (
        <div className={isSmallDevice ?
            'mobile-search-filters-container' :
            'search-filters-container'
        }>
            <div className={!isSmallDevice ? 'filter-container' : '' }>
                {!isSmallDevice ? <img src={FilterIcon} style={{width: '39px', height: '39px'}}/> : <></>}
                <Autocomplete
                    className={isSmallDevice ? 'mobile-filter-input' :
                        'filter-input'}
                    sx={{
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
                    onChange={(event, newValue) => setSelectedArtist(newValue)} />
                <Autocomplete
                    className={isSmallDevice ? 'mobile-filter-input' :
                        'filter-input'}
                    sx={{
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
                    options={cells}
                    renderInput={(params) => <TextField {...params} label="Select cell" />}
                    onChange={(event, newValue) => setSelectedCell(newValue)} />
            </div>
            <Paper
                component="form"
                className={isSmallDevice ? 'mobile-search-input' :
                    'search-input'}
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