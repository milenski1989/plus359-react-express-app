import React, { useContext, useState } from 'react'
import { ImageContext } from './contexts/ImageContext';
import CascadingDropdowns from './CascadingDropdowns'
import './EditableContainer.css'

function EditableContainer({art}) {

    const {
        currentImages,
        updatedEntry,
        setUpdatedEntry,
        isEditMode,
    } = useContext(ImageContext);

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: "",
    });

    const onChangeEditableInput = (event) => {
        const { name, value } = event.target;
        setUpdatedEntry((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div>
            <p className="px-4 mb-4">
                {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                    <div>
                        <label className='input-label' htmlFor="artist">Artist:</label>
                        <input
                            name="artist"
                            onChange={(event) => onChangeEditableInput(event)}
                            className="text-lg editable"
                            disabled={!isEditMode}
                            value={isEditMode ?  updatedEntry.artist : currentImages[0].artist} />
                        <label className='input-label' htmlFor="title">Title:</label>
                        <input
                            name="title"
                            onChange={(event) => onChangeEditableInput(event)}
                            className="text-lg editable"
                            disabled={!isEditMode}
                            value={isEditMode ? updatedEntry.title : currentImages[0].title} />
                        <label className='input-label' htmlFor="technique">Technique:</label>
                        <input
                            name="technique"
                            onChange={(event) => onChangeEditableInput(event)}
                            className="text-lg editable"
                            disabled={!isEditMode}
                            value={updatedEntry.technique || currentImages[0].technique} />
                        <label className='input-label' htmlFor="dimensions">Dimensions:</label>
                        <input
                            name="dimensions"
                            onChange={(event) => onChangeEditableInput(event)}
                            className="text-lg editable"
                            disabled={!isEditMode}
                            value={updatedEntry.dimensions || currentImages[0].dimensions} />
                        <label className='input-label' htmlFor="price">Price:</label>
                        <input
                            name="price"
                            onChange={(event) => onChangeEditableInput(event)}
                            className="text-lg editable"
                            disabled={!isEditMode}
                            value={updatedEntry.price || currentImages[0].price} />
                        <label className='input-label' htmlFor="notes">Notes:</label>
                        <input
                            name="notes"
                            onChange={(event) => onChangeEditableInput(event)}
                            className="text-lg editable"
                            disabled={!isEditMode}
                            value={updatedEntry.notes || currentImages[0].notes} />
                    </div>
                ) : (
                    <>
                        <p>{`Title: ${art.title ? art.title : "No title"}`}</p>
                        <p>{`Technique: ${art.technique}`}</p>
                        <p>{`Dimensions: ${art.dimensions}`}</p>
                        <p>{`Price: ${art.price}EU`}</p>
                        <p>{`Notes: ${art.notes}`}</p>
                    </>
                )}
                {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                    <CascadingDropdowns
                        formControlData={formControlData}
                        setFormControlData={setFormControlData} />
                ) : (
                    <>
                        <p>{`Storage: ${art.storageLocation} 
                         Cell: ${art.cell} 
                         Position: ${art.position}`}</p>
                    </>
                )}
            </p>
        </div>
    )
}

export default EditableContainer