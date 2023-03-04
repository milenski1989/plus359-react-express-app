/* eslint-disable react/jsx-key */
import { Dialog, DialogContent, IconButton, TextField, Tooltip, InputAdornment } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import './MyDialog.css'
import LocationsDropdowns from "./LocationsDropdowns";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { yellow, green } from '@mui/material/colors';



const MyDialog = ({isModalOpen, handleCloseModal, children, image, editMode, updatedEntry, setUpdatedEntry, handleChangeEditableField}) => {
    if (image) {

        const {artist, title, technique, dimensions, price, storageLocation, cell, position, notes, image_url: url} = image

        const textfields = Object.assign({}, {artist, title, technique, dimensions, price, notes})
        const dropdowns = Object.assign({}, {storageLocation, cell, position})

        const allFields = Object.assign({}, {...textfields, ...dropdowns})

        const [viewPrice, setViewPrice] = useState(false)

        const [formControlData, setFormControlData] = useState({
            storageLocation: "",
            cell: "",
            position: 0
        });

        const renderInputProps = (key) => {
            let inputProps;
            if (key === "price") {
                inputProps = {
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleViewPrice}
                            edge="end"
                        >
                            {viewPrice ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }

                return inputProps
            }
        }

        const renderTextFieldType = (key) => {
            let type;
            if (key === "price") {
                if (viewPrice) {
                    type = "text"
                    return type
                } else {
                    type = "password"
                    return type
                }
            } else {
                type = "text"
                return type
            }
        }

        const renderNonEditableFields = () => {

            return Object.entries(allFields).map(([key, value]) => (
                <div className="infoTextField" key={key}>
                    <TextField
                        type={renderTextFieldType(key)}
                        InputProps={renderInputProps(key)}
                        variant="standard"
                        value={value}
                        disabled={!editMode}
                        name={key}
                        label={key} />
                </div>
            ))
        }
        
        const renderEditableFields = () => {

            return (

                Object.entries(textfields).map(([key, ]) => (
                    <div className="infoTextField" key={key}>
                        <TextField
                            type="text"
                            variant="standard"
                            value={image.id === updatedEntry.id
                            && updatedEntry[key]}
                            disabled={!editMode}
                            onChange={(event) => handleChangeEditableField(event)}
                            name={key}
                            label={key}
                        />

                    </div>
                ))
            )
        }

        const handleViewPrice = () => {
            setViewPrice(!viewPrice)
        }
   
        return (
            <Dialog open={isModalOpen}>
                <DialogContent>
                    {children}
                    <img className="infoDialogImage" src={url}/>
                
                    <div className="infoContainer">
                        {!editMode ?
                            renderNonEditableFields() :

                            [renderEditableFields(),
                                <LocationsDropdowns
                                    formControlData={formControlData}
                                    setFormControlData={setFormControlData}
                                    setUpdatedEntry={setUpdatedEntry}
                                />]
                        }
                    </div>
                </DialogContent>
                <Tooltip title="Close" placement="top">
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            right: 5,
                            top: 5,
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