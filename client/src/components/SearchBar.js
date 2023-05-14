import { IconButton, InputBase, Paper } from '@mui/material'
import React from 'react'
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({onChange, searchByKeyword, triggerSearchWithEnter}) {

  
    return (
        <div className="mt-16">
            <Paper
                component="form"
                sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "70vw",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
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
                    onClick={searchByKeyword}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
        </div>
    )
}

export default SearchBar