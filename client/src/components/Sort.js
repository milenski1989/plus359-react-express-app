import React from 'react';
import IconSortDesc from './icons as components/IconSortDesc';
import IconSortAsc from './icons as components/IconSortAsc';

const Sort = ({ sortField, handleSortField, sortOrder, handleSortOrder }) => {

    const handleSortClick = (field) => {
        handleSortField(field);
        handleSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    };

    return (
        <div className='sortButtonsContainer'>

            <div className='sortButtonAndIconContainer'>
                <p>Sort by date</p>
                <button onClick={() => handleSortClick('id')}>
                    { sortField === 'id' && 
                    sortOrder === 'asc' ? 
                        <IconSortDesc className='sortIcon' /> : 
                        <IconSortAsc className='sortIcon' /> }
                </button>
            </div>

            <div className='sortButtonAndIconContainer'>
                <p>Sort by position</p>
                <button onClick={() => handleSortClick('position')}>
                    { sortField === 'position' &&
                     sortOrder === 'asc' ? 
                        <IconSortDesc className='sortIcon' /> : 
                        <IconSortAsc className='sortIcon' /> }
                </button>
            </div>
        </div>
    );
};

export default Sort;