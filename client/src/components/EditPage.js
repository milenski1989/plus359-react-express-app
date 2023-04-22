import { TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useRef } from 'react'
import { ImageContext } from './App'
import SecondaryNavbar from './SecondaryNavbar'
import "./App.css"
import "./EditPage.css"
import { useState } from 'react'
import LocationsDropdowns from './LocationsDropdowns'
import { useHistory, useLocation } from "react-router-dom";
import ActionButton from './ActionButton'

const EditPage = () => {

    const myStorage = window.localStorage

    const {updatedEntry, setUpdatedEntry, setIsEditMode, setIsInfoModalOpen} = useContext(ImageContext)
    // eslint-disable-next-line no-unused-vars
    const selectedImage = useRef(JSON.parse(myStorage.getItem('image')))
  
    const textfields = Object.assign({}, 
        {artist: selectedImage.current.artist,
            title: selectedImage.current.title ,
            technique: selectedImage.current.technique, 
            dimensions: selectedImage.current.dimensions,
            price: selectedImage.current.price, 
            notes: selectedImage.current.notes})

    const history = useHistory()
    const location = useLocation()
    let { from } = location.state || { from: { pathname: '/artworks' } }

    const [formControlData, setFormControlData] = useState({
        storageLocation: selectedImage.current.storageLocation,
        cell: selectedImage.current.cell,
        position: selectedImage.current.position
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
        myStorage.removeItem('image')
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
               
                <img className='edit-page-image-preview' src={selectedImage.current.thumbnail}/>
               
                <div className="flex-container">
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
                                value={updatedEntry[key] || selectedImage.current[key]}
                                onChange={(event) => onChange(event)}
                                name={key}
                                label={key}
                                defaultValue={selectedImage.current[key]}
                            />      
                        )
                    })}

                    <LocationsDropdowns
                        formControlData={formControlData}
                        setFormControlData={setFormControlData}
                    />
                    
                    <div className='buttons-flexContainer'>
                        <ActionButton
                            children="save"                    
                            handleOnclick={() => saveUpdatedEntry(selectedImage.current.id)}
                        />
                        <ActionButton
                            children="go back"               
                            handleOnclick={cancelEditing}
                        />

                        <ActionButton
                            children="pdf"                    
                            handleOnclick={() => console.log('pdf')}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

export default EditPage