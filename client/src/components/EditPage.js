import { Button, TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext } from 'react'
import { ImageContext } from './App'
import SecondaryNavbar from './SecondaryNavbar'
import "./App.css"
import "./EditPage.css"
import { useState } from 'react'
import LocationsDropdowns from './LocationsDropdowns'
import { useHistory, useLocation } from "react-router-dom";

const EditPage = () => {
    
    const {currentImage, updatedEntry, setUpdatedEntry, setIsEditMode, setIsInfoModalOpen} = useContext(ImageContext)
    const {artist, title, technique, dimensions, price, notes, storageLocation, cell, position} = currentImage
    const textfields = Object.assign({}, {artist, title, technique, dimensions, price, notes})
    
    const history = useHistory()
    const location = useLocation()
    let { from } = location.state || { from: { pathname: '/artworks' } }

    const [formControlData, setFormControlData] = useState({
        storageLocation: storageLocation,
        cell: cell,
        position: position
    });
    
    const onChange = (event) => {
        const { name, value } = event.target;
        setUpdatedEntry(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const saveUpdatedEntry = (id) => {
        updateEntry(id);
    };

    
    const cancelEditing = () => {
        setIsEditMode(false);
        setIsInfoModalOpen(true)
        history.replace(from)
    };

    const updateEntry = async (id) => {
        const response = await axios.put(
            `http://localhost:5000/api/artworks/${id}`,
            updatedEntry
        );
        if (response.status === 200) {
            setIsEditMode(false);
            setUpdatedEntry({});
            history.replace(from)
        } else {
            setIsEditMode(false);
            setUpdatedEntry({});
        }
    };

    return (
        <>
            <SecondaryNavbar />

            <section className="mainSection">
                <div className="flexContainer">
                    {Object.entries(textfields).map(([key, ]) => {
                        return (
                            <TextField
                                key={key}
                                margin="normal"
                                type="text"
                                sx={{
                                    boxShadow: 1
                                }}
                                variant="outlined"
                                value={currentImage.id === updatedEntry.id
                                        && updatedEntry[key]}
                                onChange={(event) => onChange(event)}
                                name={key}
                                label={key}
                            />      
                        )
                    })}

                    <LocationsDropdowns
                        formControlData={formControlData}
                        setFormControlData={setFormControlData}
                    />
                    
                    <div className='buttonsFlexContainer'>
                        <Button
                            variant="outlined"
                            sx={{ width: "100px", padding: "0.5rem", marginTop: "0.75rem", boxShadow: 1, marginLeft: "auto", marginRight: "auto"}}
                            onClick={() => saveUpdatedEntry(currentImage.id)}>
                            Save & go back
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ width: "100px", padding: "0.5rem", marginTop: "0.75rem", boxShadow: 1, marginLeft: "auto", marginRight: "auto"}}
                            onClick={cancelEditing}>
                            Cancel
                        </Button>

                    </div>
                </div>
            </section>
        </>
    )
}

export default EditPage