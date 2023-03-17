/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useContext, useEffect } from "react";
import { DialogTitle, Dialog, DialogContent, IconButton, TextField, InputAdornment, Slide} from "@mui/material"
import './InfoDialog.css'
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { yellow, green } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import SpeedDial from './SpeedDial'
import useMediaQuery from '@mui/material/useMediaQuery';
import {ImageContext} from "./App";
import { useHistory, useLocation } from "react-router-dom";

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})


const InfoDialog = ({searchResults, getAllEntries, setIsDeleteConfOpen}) => {
    const {currentImage, setCurrentImage, isEditMode, setIsEditMode, setIsInfoModalOpen, isInfoModalOpen} = useContext(ImageContext)

    const fullScreen = useMediaQuery('(max-width:400px)')

    const {artist, title, technique, dimensions, price, storageLocation, cell, position, notes, image_url: url} = currentImage
    const textfields = Object.assign({}, {artist, title, technique, dimensions, price, notes})
    
    const allFields = Object.assign({}, {...textfields, storageLocation, cell, position})
    
    const [viewPrice, setViewPrice] = useState(false)
    
    const [showMore, setShowMore] = useState(false)


    const history = useHistory()
    const location = useLocation()
    let { from } = location.state || { from: { pathname: '/edit' } }

    useEffect(() => {
        if (isEditMode) {
            history.replace(from)
            setIsInfoModalOpen(false)   
        }
    },[isEditMode])
        
    //handle close info modal
    const closeInfoDialog = (e) => {
            
        setIsInfoModalOpen(prev => !prev)
        setIsEditMode(false)
        setCurrentImage(null)
    } 
    
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
                    sx={{textDecoration: "none"}}
                    value={value}
                    disabled={!isEditMode}
                    name={key}
                    label={`${key}:`} />
            </div>
        ))
    }
    
    const handleViewPrice = () => {
        setViewPrice(!viewPrice)
    }
    
    
    return <>
    
        <Dialog classes={{paperFullScreen: "prePrint"}} TransitionComponent={Transition} fullScreen={fullScreen} open={isInfoModalOpen} onClose={closeInfoDialog} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title"
        >  
    
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
                   
            </DialogTitle>
                    
            <DialogContent>
                     
                <img className="imageInfoModal" src={url} alt="no preview" id="DialogPrint"/>
                <SpeedDial
                    showMore={showMore}
                    handleShowMore={setShowMore}
                    searchResults={searchResults} 
                    getAllEntries={getAllEntries}
                    setIsDeleteConfOpen={setIsDeleteConfOpen}
                    setIsInfoModalOpen={setIsInfoModalOpen}
                />
    
                <div id="DialogPrint" style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "0.3rem", marginTop: "1rem"}}>
                    {showMore && 
                                renderNonEditableFields()}
                </div>
    
            </DialogContent>
                      
                    
        </Dialog> 
    
    
    </>
                    
             
    

  
        
    
}

export default InfoDialog