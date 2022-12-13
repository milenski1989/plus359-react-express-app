import { Dialog, DialogContent, IconButton, TextField, Tooltip } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import './MyDialog.css'

const MyDialog = ({isModalOpen, handleCloseModal, children, image, editMode, updatedEntry, handleChangeEditableField}) => {
    if (image) {
        const imageCopy = {...image}
        delete imageCopy.download_url
        delete imageCopy.download_key
        delete imageCopy.image_url
        delete imageCopy.image_key
        delete imageCopy.id
   
        return (
            <Dialog open={isModalOpen}>
                <DialogContent>
                    {children}
                    <div className="infoContainer">
                        {Object.entries(imageCopy).map(([key, value]) =>
                            (
                                <div className="infoTextField" key={key}>
                                    <TextField 
                                        value={
                                            editMode && 
                                            image.id === updatedEntry.id
                                                ? updatedEntry[key]
                                                : value
                                        }
                                        label={key}
                                        variant={editMode ? "outlined" : "standard"}
                                        margin="normal"
                                        type="text"
                                        name={key}
                                        disabled={image.id !== updatedEntry.id || 
                                            !editMode || key === "id" || 
                                            key === "storageLocation" ||
                                        key === "cell" ||
                                        key === "position"}
                                        onChange={(event) => handleChangeEditableField(event)}
                                    />
                                </div>
                              
                            ))}
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