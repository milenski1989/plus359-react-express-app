import { Autocomplete, IconButton, InputBase, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from "@mui/icons-material/Search";
import './SearchAndFiltersBar.css'
import { useParams } from 'react-router-dom';
import { useMediaQuery } from "@mui/material";
import { filterAllArtworks, getPaginatedArtworks } from '../api/artworksService';
import { getAllCellsFromSelectedStorage } from '../api/storageService';
import { getAllArtistsRelatedToEntriesInSelectedStorage } from '../api/artistsService';

const boxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'

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
    page
}) {

    const [artists, setArtists] = useState([])
    const [cells, setCells] = useState([])
    const [selectedArtist, setSelectedArtist] = useState()
    const [selectedCell, setSelectedCell] = useState()
    const {name} = useParams()
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const getArtists = async () => {
        try {
            const response = await getAllArtistsRelatedToEntriesInSelectedStorage(name)
            const normalizedArtists = response.data.map(artist => artist.toLowerCase().trim());
            const uniqueNormalizedArtists = [...new Set(normalizedArtists)];
            const uniqueArtists = uniqueNormalizedArtists.map(normalizedArtist => {
                return response.data.find(artist => artist.toLowerCase().trim() === normalizedArtist);
            });
    
            setArtists(uniqueArtists);
        } catch (error) {
            handleError({ error: true, message: error.response.data.message });
        }
    }

    const getCells = async () => {
        try {
            const response = await getAllCellsFromSelectedStorage(name)
            const uniqueCells = [...new Set(response.data)]
            setCells(uniqueCells);
        } catch (error) {
            handleError({ error: true, message: error.response.data.message });
        }
    }

    const onChange = event => {

        if (!event.target.value) return handleKeywords([])

        const inputKeywords = event.target.value.split(' ');
        handleKeywords(inputKeywords);
    };

    const getPaginatedData = async () => {
        handleLoading(true)
        try {
            const response = await getPaginatedArtworks(page, sortField, sortOrder, name);

            const { arts, artsCount } = await response.data;
            handleSearchResults(arts);
            setPaginationDisabled(false)
            setPagesCount(Math.ceil(artsCount / 25));
            setTotalCount(artsCount);
        } catch(error) {
            handleError({ error: true, message: error.response.data.message });
        } finally {
            handleLoading(false);
        }
    }

    const filterData = async () => {
        handleLoading(true)
        try {

            const response = await filterAllArtworks(keywords, selectedArtist, selectedCell, sortField, sortOrder)
            handleSearchResults(response.data.arts);
            setPaginationDisabled(true)
        } catch(error) {
            handleError({ error: true, message: error.response.data.message });
        } finally {
            handleLoading(false);
        } 
    }

    const triggerSearchWithEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    useEffect(() => {
        getArtists()
        getCells()
    },[])

    useEffect(() => {
        let filterTimeOut = null;
        if (!selectedArtist && !selectedCell && !keywords.length) {
            getPaginatedData()
        }
        else {
            filterTimeOut = setTimeout(() => {
                filterData()
            }, 500)
        }

        return () =>  clearTimeout(filterTimeOut)
    }, [page, sortField, sortOrder, isDeleting, locationChanged, selectedArtist, selectedCell, keywords]);
  
    return <>
        <div className={!isSmallDevice ?
            'search-filters-container' :
            null
        }>

            <div className={!isSmallDevice ? 'filters-container' : null }>
                <Autocomplete
                    className={isSmallDevice ? 'mobile-filter-input' :
                        'filter-input filter-item'}
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
                        'filter-input filter-item'}
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
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
      
    </>
}

export default SearchAndFiltersBar