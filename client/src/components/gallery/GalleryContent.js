import React, { useContext, useState } from "react";
import Message from "../reusable/Message";
import "react-lazy-load-image-component/src/effects/blur.css";
import { ImageContext } from "../contexts/ImageContext";
import SearchAndFiltersBar from "../filters/SearchAndFiltersBar";
import ThumbnailView from "./ThumbnailView";
import DetailsView from "./DetailsView";
import ListView from "./ListView";
import DeleteDialog from "../reusable/DeleteDialog";
import LocationChangeDialog from "../LocationChangeDialog";
import PaginationComponent from "../PaginationComponent";
import Actions from "./Actions";


const NewGalleryContent = () => {

    const {
        page,
        setPage
    } = useContext(ImageContext);

    const [isDeleting, setIsDeleting] = useState(false);
    const [locationChanged, setLocationChanged] = useState(false)
    const [isLocationChangeDialogOpen, setIsLocationChangeDialogOpen] = useState(false)
    const [searchResults, setSearchResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pagesCount, setPagesCount] = useState(0);
    const [countPerPage, setCountPerPage] = useState(25)

    const [error, setError] = useState({
        error: false,
        message: "",
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState('details')
    const [paginationDisabled, setPaginationDisabled] = useState(false);

    const renderViewMode = () => {
        switch(viewMode) {
        case 'thumbnail':
            return  <ThumbnailView
                searchResults={searchResults}
            />
        case 'details':
            return <DetailsView
                handleDialogOpen={setIsDeleteDialogOpen}
                searchResults={searchResults}
                handleIsLocationChangeDialogOpen={setIsLocationChangeDialogOpen}
            />
        default: 
            return <ListView
                searchResults={searchResults}
                handleIsLocationChangeDialogOpen
            /> 
        }
    }

    const handleLocationChange = () => {
        setLocationChanged(prev => !prev)
    }

    const handlePage = (newPage) => {
        setPage(newPage)
    }
    
    return (
        <> 
            <Message
                open={error.error}
                handleClose={() => setError({ error: false, message: "" })}
                message={error.message}
                severity="error" />

            <LocationChangeDialog 
                isLocationChangeDialogOpen={isLocationChangeDialogOpen}
                handleIsLocationChangeDialogOpen={setIsLocationChangeDialogOpen}
                handleLocationChange = {handleLocationChange}
            />
            <DeleteDialog
                isDialogOpen={isDeleteDialogOpen}
                handleDialogOpen={setIsDeleteDialogOpen}
                isDeleting={isDeleting}
                handleIsDeleting={setIsDeleting}
                    
            />
            <div className="gallery-content-container">
                <Actions  
                    handleDialogOpen={setIsDeleteDialogOpen} 
                    viewMode={viewMode} searchResults={searchResults} 
                    handleIsLocationChangeDialogOpen={setIsLocationChangeDialogOpen} />
                
                <SearchAndFiltersBar
                    setPaginationDisabled={setPaginationDisabled}
                    handleError={setError}
                    handleSearchResults={setSearchResults}
                    isDeleting={isDeleting}
                    locationChanged={locationChanged}
                    setTotalCount={setTotalCount}
                    setPagesCount={setPagesCount}
                    page={page}
                    countPerPage={countPerPage}
                    handleCountPerPage={setCountPerPage}
                    viewMode={viewMode}
                    handleViewMode={setViewMode}
                />
            </div>
            {!searchResults.length && <div className="no-data-container">Nothing was found!</div>}
            {renderViewMode()}
            {searchResults.length && !paginationDisabled ?
                <PaginationComponent 
                    page={page}
                    handlePage={handlePage}
                    pagesCount={pagesCount}
                    totalCount={totalCount}
                /> :
                null
            }
        </>
    );
};
export default NewGalleryContent;
