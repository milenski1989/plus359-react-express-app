import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, InputBase, Paper, TextField } from "@mui/material"
import SecondaryNavbar from "./SecondaryNavbar"
import SearchIcon from "@mui/icons-material/Search";
import './Search.css'
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const Search = () => {

    const [searchedItems, setSearchedItems] = useState([])
    const [params, setParams] = useState('')
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const deleteSingleArt = async (id) => {
        const response = await axios.delete(
            `http://localhost:5000/artworks/${id}`,
            { id: id }
        );
    
        if (response.status === 200) {
            setSearchedItems(searchedItems.filter((art) => art.id !== id));
            setDeleting(false);
        }
    };
    
    const hadleDelete = () => {
        setConfirmDelete(true);
    };
    
    const handleSearch = async (value) => {
        if (value === '') return
        const response = await fetch(`http://localhost:5000/search?author=${value}`);
        const data = await response.json();

        if (response.status === 200) {
            setSearchedItems(Object.values(data).length !== 0 ? data.results : [])
            console.log(data)
      
        } else {
            console.log('ERROR')
        }
    }

    const search = (params) => {
        handleSearch(params)
        setParams('')
    }

    return <>
        <SecondaryNavbar/>
        <section className="searchSection">
            <Paper
                component="form"
                sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search..."
                    inputProps={{ "aria-label": "search" }}
                    value={params}
                    onChange={(e) => setParams(e.target.value)}
                    name="param"
                />
                <IconButton type="button" name="author" onClick={() => search(params)} sx={{ p: "10px" }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            {deleting ? 
                <div className="loader">
                    <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#78FECF"
                        ariaLabel="three-dots-loading"
                        visible={true}
                    />
                </div>
                :
                <div className="search gridContainer">
                    {searchedItems.length !== 0 && searchedItems.map((item, id) => (
                        <>
                            <Dialog
                                key={id}
                                open={confirmDelete}
                                onClose={() => setConfirmDelete(false)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete the entry? This is
                      irreversible!
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setConfirmDelete(false)}>
                      Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setDeleting(true),
                                            deleteSingleArt(item.id, setConfirmDelete(false));
                                        }}
                                        autoFocus
                                    >
                      Delete
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <div className="gridItem">
                                <div className="imageContainer">
                                    <img
                                        src={item.image_url}
                                        alt="No Preview"
                                        className="artImage"
                                    />
                                </div>

                                <div className="buttonsContainer">
                                    <IconButton
                                        variant="outlined"
                                        onClick={hadleDelete}
                                        sx={{ marginTop: 0.75}}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
            
                                </div>
                
                                <div className="infoContainer">
                                    <TextField
                                        value={item.author}
                                        label="Author"
                                        variant="standard"
                                        margin="normal"
                                        disabled
                                        type="text"
                                    />

                                    <TextField
                                        value={item.title}
                                        label="Title"
                                        variant="standard"
                                        margin="normal"
                                        disabled
                                        type="text"
                                    />

                                    <TextField
                                        value={item.height}
                                        label="Height"
                                        variant="standard"
                                        margin="normal"
                                        disabled
                                        type="text"
                                    />

                                    <TextField
                                        value={item.width}
                                        label="Width"
                                        variant="standard"
                                        margin="normal"
                                        disabled
                                        type="text"
                                    />
                                </div>
                  
                            </div>
                        </>
                    ))}
                </div>
            }
        </section> 
    </>

}

export default Search