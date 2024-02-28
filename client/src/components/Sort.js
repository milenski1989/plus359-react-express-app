import React from 'react';
import IconSortDesc from './icons as components/IconSortDesc';
import IconSortAsc from './icons as components/IconSortAsc';
import './Sort.css'

const Sort = ({sortField, sortOrder, handleSortField, handleSortOrder}) => {

    const handleSortClick = (field) => {
        handleSortField(field);
        handleSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    return (
        <div className='sort-buttons-container'>
            <p style={{marginRight: '0.5rem'}}>Sort by:</p>
            <div className='sort-button-and-icon-container'>
                <p>Date</p>
                <button onClick={() => handleSortClick('id')}>
                    { sortField === 'id' && 
                    sortOrder === 'asc' ? 
                        <IconSortDesc className='sort-icon' /> : 
                        <IconSortAsc className='sort-icon' /> }
                </button>
            </div>

            <div className='sort-button-and-icon-container'>
                <p>Position</p>
                <button style={{marginLeft: '0.5rem'}} onClick={() => handleSortClick('position')}>
                    { sortField === 'position' &&
                     sortOrder === 'asc' ? 
                        <IconSortDesc className='sortIcon' /> : 
                        <IconSortAsc className='sortIcon' /> }
                </button>
            </div>

            <div className='sort-button-and-icon-container'>
                <p>Artist</p>
                <button style={{marginLeft: '0.5rem'}} onClick={() => handleSortClick('artist')}>
                    { sortField === 'artist' &&
                     sortOrder === 'asc' ? 
                        <IconSortDesc className='sortIcon' /> : 
                        <IconSortAsc className='sortIcon' /> }
                </button>
            </div>
            <div className='sort-button-and-icon-container'>
                <p>Title</p>
                <button style={{marginLeft: '0.5rem'}} onClick={() => handleSortClick('title')}>
                    { sortField === 'title' &&
                     sortOrder === 'asc' ? 
                        <IconSortDesc className='sortIcon' /> : 
                        <IconSortAsc className='sortIcon' /> }
                </button>
            </div>
        </div>

        
    );
};

export default Sort;