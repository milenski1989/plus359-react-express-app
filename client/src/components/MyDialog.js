import { Dialog, DialogContent, IconButton, TextField, Tooltip } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";

const MyDialog = ({isModalOpen, handleCloseModal, children, image, editMode, updatedEntry, handleChangeEditableField}) => {
    if (image) {
   
        return (
            <Dialog open={isModalOpen}>
                <DialogContent>
                    {children}
                    <div className="infoContainer">
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.artist
                                    : image.artist
                            }
                            label="Artist"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="artist"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
    
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.title
                                    : image.title
                            }
                            label="Title"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="title"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />

                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.technique
                                    : image.technique
                            }
                            label="Technique"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="technique"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />

                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.storageLocation
                                    : image.storageLocation
                            }
                            //value={image.storageLocation}
                            label="Location"
                            variant={editMode ? "outlined" : "standard"}
                            //variant="standard"
                            margin="normal"
                            type="text"
                            name="storageLocation"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            //disabled
                            onChange={(event) => handleChangeEditableField(event)}
                        />

                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.cell
                                    : image.cell
                            }
                            label="Cell"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="cell"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />

                        
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.position
                                    : image.position
                            }
                            label="Position"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="position"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.dimensions
                                    : image.dimensions
                            }
                            label="Dimensions"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="dimensions"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
    
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.price
                                    : image.price
                            }
                            label="Price"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="number"
                            name="price"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />

                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.notes
                                    : image.notes
                            }
                            label="Notes"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            name="notes"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />

                    </div>
                </DialogContent>
                <Tooltip title="Close"  placement="top">
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
    
            </Dialog>
        )
    }
   
}

export default MyDialog