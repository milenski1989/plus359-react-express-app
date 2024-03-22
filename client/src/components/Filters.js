import React, { useEffect, useState } from 'react'
import { Autocomplete, TextField, useMediaQuery } from '@mui/material'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const boxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'

const Filters = ({
    selectedCell,
    setSelectedCell,
    selectedArtist,
    setSelectedArtist,
    handleError,
    setPaginationDisabled,
    setPage,
    handleSearchResults
}) => {
    const [artists, setArtists] = useState([])
    const [cells, setCells] = useState([])

    const {name} = useParams()
    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
   
    useEffect(() => {
        getArtists()
        getCells()
    },[])

    useEffect(() => {
        filterByArtistAndCellInCurrentLocation();
    }, [selectedCell, selectedArtist]);

    const getArtists = async () => {
        try {
            const res = await fetch(`http://localhost:5000/artists/relatedToEntriesInStorage/${name.split(':')[1]}`)
            const data = await res.json()
    
            const normalizedArtists = data.map(artist => artist.toLowerCase().trim());
            const uniqueNormalizedArtists = [...new Set(normalizedArtists)];
            const uniqueArtists = uniqueNormalizedArtists.map(normalizedArtist => {
                return data.find(artist => artist.toLowerCase().trim() === normalizedArtist);
            });
    
            setArtists(uniqueArtists);
        } catch (error) {
            handleError({ error: true, message: error.message });
        }
    }

    const getCells = async () => {
        try {
            const res = await fetch(`http://localhost:5000/storage/all/allCellsFromCurrentStorage/${name.split(':')[1]}`)
            const data = await res.json()
            const uniqueCells = [...new Set(data)]
            setCells(uniqueCells);
        } catch (error) {
            handleError({ error: true, message: error.message });
        }
    }

    const filterByArtistAndCellInCurrentLocation = async () => {
        try {
            if (!selectedArtist && selectedArtist !== "-" && !selectedCell) {
                setPaginationDisabled(false);
            } else {
                const response = await axios.get('http://localhost:5000/artworks/filterByArtistAndCell', {
                    params: {
                        cell: selectedCell,
                        artist: selectedArtist,
                        storage: name.split(':')[1]
                    },
                });
                handleSearchResults(response.data.artworks);
                setPaginationDisabled(true)
            }

            setPage(1)
        } catch (error) {
            handleError({ error: true, message: error.message });
        }
    };

    return <div className={!isSmallDevice ? 'filters-container' : null }>
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
}

export default Filters