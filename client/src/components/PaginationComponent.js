import React, { useContext } from 'react'
import { Pagination } from '@mui/material';
import './PaginationComponent.css'
import { ImageContext } from './contexts/ImageContext';

const PaginationComponent = ({handlePage, pagesCount, totalCount}) => {

    const {
        page,
    } = useContext(ImageContext);
    const noNextPage = () => {
        const currentPage = page + 1;
        const lastPage = Math.ceil(totalCount / 25);
        if (currentPage === lastPage) return true;
    };

    const isTherePrevPage = () => {
        return page !== 0;
    };

    return  <Pagination
        count={pagesCount && pagesCount}
        page={page}
        variant="outlined"
        color="primary"
        className="pagination-container"
        onChange={(event, page) => handlePage(page)}
        showFirstButton={isTherePrevPage && true}
        showLastButton={noNextPage && true}
        siblingCount={3}
        boundaryCount={2} />
}

export default PaginationComponent