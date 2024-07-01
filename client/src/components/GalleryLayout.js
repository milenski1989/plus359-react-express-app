import React, { useState } from 'react'
import SearchAndFiltersBar from './SearchAndFiltersBar'
import { Outlet } from 'react-router-dom'
import PaginationComponent from './PaginationComponent'
import Sort from './Sort'

function GalleryLayout() {

    const [searchResults, setSearchResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pagesCount, setPagesCount] = useState(0);
    const [locationChanged, setLocationChanged] = useState(false)
    const [page, setPage] = useState(1);
    const [paginationDisabled, setPaginationDisabled] = useState(false);
    const [sortField, setSortField] = useState('id')
    const [sortOrder, setSortOrder] = useState('desc')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLocationChangeDialogOpen, setIsLocationChangeDialogOpen] = useState(false)

    const outletContext = {
        searchResults,
        setSearchResults,
        locationChanged,
        setLocationChanged,
        page,
        setPage,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isLocationChangeDialogOpen,
        setIsLocationChangeDialogOpen
    }

    const handlePage = (newPage) => {
        setPage(newPage)
    }

    return (
        <>
            <div className="search-and-sort-container">
                <SearchAndFiltersBar 
                    handleSearchResults={setSearchResults}
                    handlePagesCount={setPagesCount}
                    handleTotalCount={setTotalCount}
                    locationChanged={locationChanged}
                    page={page}
                    paginationDisabled={paginationDisabled}
                    handlePaginationDisabled={setPaginationDisabled}
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
                <Sort 
                    sortField={sortField}
                    handleSortField={setSortField}
                    sortOrder={sortOrder}
                    handleSortOrder={setSortOrder}
                />
            </div>
            <Outlet context={outletContext}/>
            {searchResults && !paginationDisabled ? (
                <PaginationComponent 
                    page={page}
                    handlePage={handlePage}
                    pagesCount={pagesCount}
                    totalCount={totalCount}
                />
            ) : (
                <></>
            )}
        </>
    )
}

export default GalleryLayout