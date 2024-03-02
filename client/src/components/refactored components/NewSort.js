import React from 'react';
import {Autocomplete, TextField} from '@mui/material';
import { useMediaQuery } from "@mui/material";
import './NewSort.css'
import SortIcon from '../assets/sort-solid.svg'

const sortOptions = [
    { label: 'Date', field: 'id' },
    { label: 'Position', field: 'position' },
    { label: 'Artist', field: 'artist' },
    { label: 'Title', field: 'title' },
];

const boxShadow = '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'

const NewSort = ({ sortField, sortOrder, handleSortField, handleSortOrder }) => {

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const handleSortChange = (_, newValue) => {
        if (newValue) {
            if (sortField === newValue.field) {
                handleSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
                handleSortField(newValue.field);
                handleSortOrder('asc');
            }
        } else {
            handleSortField('id');
            handleSortOrder('desc');
        }
    };

    return (
        <> 
            <div className={!isSmallDevice ? 'sort-container' :
                ''
            }>
                {!isSmallDevice ? <img src={SortIcon} style={{width: '39px', height: '39px'}}/> : <></>}
                <Autocomplete
                    className={isSmallDevice ? 'mobile-sort-input' :
                        'sort-input'}
                    sx={{
                        "& .MuiAutocomplete-root": {
                            height: '60px'
                        },
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
                    value={{ label: `${sortOptions.find(option => option.field === sortField).label} ${sortOrder}`, field: sortField, order: sortOrder }}
                    options={sortOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={handleSortChange}
                    renderInput={(params) => <TextField {...params} />}
                    renderOption={(props, option) => (
                        <li {...props} style={{ backgroundColor: props['aria-selected'] && 'white'}}>
                            {option.label}
                            {sortField === option.field && sortOrder === 'asc' && ' desc'}
                            {sortField === option.field && sortOrder === 'desc' && ' asc'}
                        </li>
                    )} />
            </div>
          
        </>
    );
};

export default NewSort;
