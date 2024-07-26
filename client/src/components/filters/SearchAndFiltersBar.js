import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import './SearchAndFiltersBar.css'
import { useParams } from 'react-router-dom';
import { filterAllArtworks, getPaginatedArtworks } from '../../api/artworksService';
import { getAllCellsFromSelectedStorage } from '../../api/storageService';
import { getAllArtistsRelatedToEntriesInSelectedStorage } from '../../api/artistsService';
import { ImageContext } from '../contexts/ImageContext';
import Sort from './Sort';
import ViewModeIcons from './ViewModeIcons';
const countPerPageOptions = [25, 50, 100, 150, 200]

function SearchAndFiltersBar({
  
    setPaginationDisabled,
    handleError, 
    handleSearchResults,
    isDeleting,
    locationChanged,
    setTotalCount,
    setPagesCount,
    countPerPage,
    handleCountPerPage,
    viewMode,
    handleViewMode,
}) {

    const [artists, setArtists] = useState([])
    const [cells, setCells] = useState([])
    const [selectedArtist, setSelectedArtist] = useState()
    const [selectedCell, setSelectedCell] = useState()
    const [sortField, setSortField] = useState('id')
    const [sortOrder, setSortOrder] = useState('desc')
    const [keywords, setKeywords] = useState([]);

    const {name} = useParams()

    const {
        page,
        setPage,
    } = useContext(ImageContext);

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

        if (!event.target.value) return setKeywords([])

        const inputKeywords = event.target.value.split(' ');
        setKeywords(inputKeywords);
    };

    const getPaginatedData = async () => {
        try {
            const response = await getPaginatedArtworks(page, countPerPage, sortField, sortOrder, name);

            const { arts, artsCount } = await response.data;
            handleSearchResults(arts);
            setPaginationDisabled(false)
            setPagesCount(Math.ceil(artsCount / countPerPage));
            setTotalCount(artsCount);
        } catch(error) {
            handleError({ error: true, message: error.response.data.message });
        }
    }

    const filterData = async () => {
        try {

            const response = await filterAllArtworks(keywords, selectedArtist, selectedCell, sortField, sortOrder)
            handleSearchResults(response.data.arts);
            setPaginationDisabled(true)
        } catch(error) {
            handleError({ error: true, message: error.response.data.message });
        }
    }

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
    }, [page, sortField, sortOrder, isDeleting, locationChanged, selectedArtist, selectedCell, keywords, countPerPage]);

    
    const handleCountPerPageChange = (event) => {
        setPage(1)
        handleCountPerPage(event.target.value)
    }

    return <>
        <div className="filters-container">
            <FormControl
                sx={{ 
                    '& label': {
                        '&:hover': {
                            color: 'rgba(0,0,0,0.6)'
                        },
                        '&.Mui-focused': {
                            color: 'rgba(0,0,0,0.6)'
                        }
                    }
                }}
            >
                <InputLabel id="demo-simple-select-label">Show</InputLabel>
                <Select
                    className="filter-input"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={countPerPage}
                    label="Show"
                    onChange={handleCountPerPageChange}
                >
                    {countPerPageOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                    ))}
        
                </Select>
            </FormControl>
            <Sort
                sortField={sortField}
                handleSortField={setSortField}
                sortOrder={sortOrder}
                handleSortOrder={setSortOrder}
            />
            <Autocomplete
                className="filter-input"
                disablePortal
                options={artists}
                renderInput={(params) => <TextField {...params} label="Select artist" />}
                onChange={(event, newValue) => setSelectedArtist(newValue)} />
            <Autocomplete
                className="filter-input"
                disablePortal
                options={cells}
                renderInput={(params) => <TextField {...params} label="Select cell" />}
                onChange={(event, newValue) => setSelectedCell(newValue)} />
            <TextField 
                className="filter-input"
                id="outlined-basic" 
                label="Search..." 
                variant="outlined"
                onChange={onChange}
            />
            <ViewModeIcons viewMode={viewMode} handleViewMode={handleViewMode} />
        </div>
    </>
}

export default SearchAndFiltersBar