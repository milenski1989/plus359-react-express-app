import { Dialog, DialogContent, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import './MyDialog.css'
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { yellow, green } from '@mui/material/colors';

const MyDialog = ({isModalOpen, handleCloseModal, children, image, editMode, updatedEntry, handleChangeEditableField}) => {
    if (image) {
        const imageCopy = {...image}
        delete imageCopy.download_url
        delete imageCopy.download_key
        delete imageCopy.image_key
        delete imageCopy.id

        const [viewPrice, setViewPrice] = useState(false)

        const handleViewPrice = () => {
            setViewPrice(!viewPrice)
        }
   
        return (
            <Dialog open={isModalOpen}>
                <DialogContent>
                    {children}
                   
                    <img className="infoDialogImage" src={imageCopy.image_url}/>
                
                    <div className="infoContainer">
                        {Object.entries(imageCopy).map(([key, value]) =>
                            (
                                key !== "image_url" && key !== "onWall" && key !== "inExhibition" &&
                                <div className="infoTextField" key={key}>
                                    {key === "price" ?
                                        <>
                                            <TextField
                                                type={viewPrice ? 'text' : 'password'}
                                                sx={{position: "relative", top: 16}}
                                                variant={editMode ? "outlined" : "standard"}
                                                value={
                                                    editMode && 
                                                image.id === updatedEntry.id
                                                        ? updatedEntry[key]
                                                        : value
                                                }
                                                disabled={image.id !== updatedEntry.id ||
                                            !editMode || key === "id"}
                                                onChange={(event) => handleChangeEditableField(event)}
                                                name={key}
                                                InputProps={{endAdornment: <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleViewPrice}
                                                        edge="end"
                                                    >
                                                        {viewPrice ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>}}
                                                label={key} />
                                        </>
                                        :

                                        <TextField 
                                            value={
                                                editMode && 
                                            image.id === updatedEntry.id
                                                    ? updatedEntry[key]
                                                    : value
                                            }
                                            label={key === "storageLocation" ? "location" : key}
                                            InputProps={key === "notes" && editMode && {endAdornment: 

                                                <InputAdornment position="end">
                                                    <Tooltip title={imageCopy.onWall && "change to: in exhibition" || imageCopy.inExhibition && "change to: on a wall"} placement="top">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            edge="end"
                                                        >
                                                            <CheckCircleIcon sx={{ color: imageCopy.onWall ? green[500] : yellow[500]}} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                             
                                             || 
                                                 <>
                                                     <InputAdornment position="end">
                                                         <Tooltip title="on a wall" placement="top">
                                                             <IconButton
                                                                 aria-label="toggle password visibility"
                                                                 edge="end"
                                                             >
                                                                 <CheckCircleIcon sx={{color: yellow[500]}} />
                                                             </IconButton>
                                                         </Tooltip>
                                                     </InputAdornment>
                                                     <InputAdornment position="end">
                                                         <Tooltip title="in exhibition" placement="top">
                                                             <IconButton
                                                                 aria-label="toggle password visibility"
                                                                 edge="end"
                                                             >
                                                                 <CheckCircleIcon sx={{color: green[500]}} />
                                                             </IconButton>
                                                         </Tooltip>
                                                     </InputAdornment>
                                                 </>}}
                                            variant={editMode ? "outlined" : "standard"}
                                            margin="normal"
                                            type="text"
                                            name={key}
                                            disabled={image.id !== updatedEntry.id || 
                                            !editMode || key === "id"}
                                            onChange={(event) => handleChangeEditableField(event)}
                                        />
                                    }
                                    
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