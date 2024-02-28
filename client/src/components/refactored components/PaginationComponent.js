import React from 'react'
import { Pagination } from '@mui/material';

const PaginationComponent = ({page, handlePage, pagesCount, totalCount}) => {

    
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
        sx={{ margin: "5rem" }}
        onChange={(event, page) => handlePage(page)}
        showFirstButton={isTherePrevPage && true}
        showLastButton={noNextPage && true}
        siblingCount={3}
        boundaryCount={2} />
}

export default PaginationComponent