import React, { useContext, useState } from 'react'
import { ImageContext } from './contexts/ImageContext';
import CascadingDropdowns from './CascadingDropdowns'
import './EditableContainer.css'

const keysToMap = ['Artist', 'Title', 'Technique', 'Dimensions', 'Price', 'Notes'];

const EditableContainer = ({art}) => {

    const {
        currentImages,
        updatedEntry,
        setUpdatedEntry,
        isEditMode,
    } = useContext(ImageContext);

    // eslint-disable-next-line no-unused-vars
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

    return <>
        <div className='editable-container'>
            <div className="px-4 mb-4">
                {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                    <div>
                        {keysToMap.map(key => (
                            <div className='editable-label-input' key={key}>
                                <label className='input-label' htmlFor={key.toLowerCase()}>{`${key}:`}</label>
                                <input
                                    name={key.toLowerCase()}
                                    onChange={(event) => onChangeEditableInput(event)}
                                    className="editable"
                                    disabled={!isEditMode}
                                    value={isEditMode ? updatedEntry[key.toLowerCase()] : currentImages[0][key.toLowerCase()]} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {keysToMap.slice(1, keysToMap.length).map(key => (
                            <p key={key}>
                                <span className='input-label'>{`${key}: `}</span>
                                {`${art[key.toLowerCase()] ? art[key.toLowerCase()] : `No ${key.toLowerCase()}`}`}
                            </p>
                        ))}
                    </div>     
                )}
                {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                    <CascadingDropdowns
                        setFormControlData={setFormControlData} />
                ) : (
                    <>
                        <p><span className='input-label'>Storage: </span>{`${art.storageLocation || art.location}`}</p>
                        <p><span className='input-label'>Cell: </span>{art.cell}</p> 
                        <p><span className='input-label'>Position: </span>{art.position}</p>
                    </>
                )}
            </div>
        </div>
    </>
   
}

export default EditableContainer