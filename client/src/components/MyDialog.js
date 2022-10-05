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
                                    ? updatedEntry.author
                                    : image.author
                            }
                            label="Author"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="text"
                            required={editMode}
                            name="author"
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
                                    ? updatedEntry.height
                                    : image.height
                            }
                            label="Height"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="number"
                            required={editMode}
                            pattern="[0-9]*"
                            name="height"
                            disabled={image.id !== updatedEntry.id || !editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                        />
    
                        <TextField
                            value={
                                editMode && image.id === updatedEntry.id
                                    ? updatedEntry.width
                                    : image.width
                            }
                            label="Width"
                            variant={editMode ? "outlined" : "standard"}
                            margin="normal"
                            type="number"
                            required={editMode}
                            pattern="[0-9]*"
                            name="width"
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