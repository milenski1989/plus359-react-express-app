import { useEffect, useState } from "react";
import "./Upload.css";
import {Autocomplete, Button, CircularProgress, TextField} from "@mui/material";
import Message from "../reusable/Message";
import CascadingDropdowns from "../reusable/CascadingDropdowns";
import { uploadImageWithData } from "../../api/s3Service";
import { getAllArtistsRelatedToAllEntries } from "../../api/artistsService";
import CustomDropZone from "./CustomDropZone";
import DeleteIcon from '../assets/delete-solid.svg'

const Upload = () => {

    let myStorage = window.localStorage
    let user = JSON.parse(myStorage.getItem('user'));

    const [inputsData, setInputsData] = useState({
        title: "",
        technique: "",
        dimensions: "",
        price: 0,
        notes: ""
    });

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: 0,
        artist: ""
    });

    const [uploadingError, setUploadingError] = useState({
        error: false,
        message: "",
    });

    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState()
    const [uploading, setUploading] = useState(false)
    const [uploadSuccessful, setUploadSuccessful] = useState(false)
    const [artists, setArtists] = useState([])
    
    const [newArtistFromInput, setNewArtistFromInput] = useState("")
    const [isArtistFromDropdown, setIsArtistFromDropDown] = useState(false)

    const getArtists = async () => {
        const response = await getAllArtistsRelatedToAllEntries()
        setArtists(response.data)
    }

    useEffect(() => {
        getArtists()
    },[])

    const handleOnDrop = (files) => {
        setFile(files[0]);
    }

    const handleSubmit = async () => {
        try {
            const onUploadProgress = (event) => {
                const percentage = Math.round((100 * event.loaded) / event.total);
                setProgress(percentage)
            };
            setUploading(true);
            const data = new FormData();
            data.append("file", file);
            data.append("artist", inputsData.artist || formControlData.artist);
            data.append("title", inputsData.title);
            data.append("technique", inputsData.technique);
            data.append("dimensions", inputsData.dimensions);
            data.append("price", inputsData.price);
            data.append("notes", inputsData.notes);
            data.append("storageLocation", formControlData.storageLocation);
            data.append("cell", formControlData.cell);
            data.append("position", formControlData.position)
            data.append("by_user", user.userName)

            await uploadImageWithData(data, onUploadProgress)

            getArtists()
            setNewArtistFromInput("")

            setProgress(0)

            setUploading(false);
            setUploadSuccessful(true);
            setInputsData({
                title: "",
                technique: "",
                dimensions: "",
                price: 0,
                notes: ""
            })

            setFormControlData({
                storageLocation: "",
                cell: "",
                position: 0
            })
            
        } catch (error) {
            setProgress(0)
            setUploading(false);
            setUploadSuccessful(false);
            setUploadingError({error: true, message: error.response.data.error})
        }
    };

    const handleInputChange = (key, event) => {
        setInputsData((prevState) => ({
            ...prevState,
            [key]: event.target.value,
        }))
    }

    const handleSelectArtist = async (newValue) => {
        if (!newValue) {
            setIsArtistFromDropDown(false)
            setFormControlData((prevState) => ({
                ...prevState,
                artist: "",
            }));
            return
        } else {
            setNewArtistFromInput("")
            setIsArtistFromDropDown(true)
            setFormControlData((prevState) => ({
                ...prevState,
                artist: newValue,
            }));
        }
    }

    const handleAddNewArtist = (e) => {
        setIsArtistFromDropDown(false)
        setNewArtistFromInput(e.target.value)
        setFormControlData((prevState) => ({
            ...prevState,
            artist: e.target.value,
        }))
    }

    const isUploadButtonDisabled = () => {
        return !file ||
         !inputsData.technique || 
         !inputsData.title || 
         !formControlData.artist|| 
         !formControlData.storageLocation
    }
 
    return <>
        <Message
            open={uploadingError.error}
            handleClose={() => setUploadingError({ error: false, message: "" })}
            message={uploadingError.message}
            severity="error" />

        <Message
            open={uploadSuccessful}
            handleClose={() => setUploadSuccessful(false)}
            message="Entry uploaded successfully!"
            severity="success" />

        {uploading ? 
            <CircularProgress variant="determinate" value={progress} className="loader" color="primary" />
            : 
            <div className="upload-section">
                <CustomDropZone 
                    handleOndrop={handleOnDrop} 
                    acceptedFormats={{'image/jpeg': ['.jpeg', '.png']}} 
                    isRequired={true}
                    files={[file]}
                />
               
                <div className="upload-filezone">
                    <span className={file ? 'upload-file-attached' : 'upload-file-not-attached'}>
                    </span>
                    <span>{file ? `${file.name.slice(0, 24)}...` : 'Please attach an image!'}</span>
                    {file ? <img
                        src={DeleteIcon}
                        className='icon'
                        onClick={() => setFile()} /> : <></>}
                </div>
               
                <Autocomplete
                    className="upload-select-artist-autocomplete"
                    disablePortal
                    options={artists}
                    renderInput={(params) => <TextField {...params} label="Artists" />}
                    onChange={(event, newValue) => handleSelectArtist(newValue)}
                />
                <TextField
                    label="Artist - add or select from the list"
                    className="upload-textfield"
                    value={newArtistFromInput}
                    disabled={isArtistFromDropdown}
                    onChange={(e) => handleAddNewArtist(e)}
                    required={isArtistFromDropdown ? false : true}
                />
                {Object.entries(inputsData).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between">
                            </div>
                            <TextField 
                                label={key}
                                className="upload-textfield"
                                value={value} 
                                onChange={(event) => handleInputChange(key, event)} 
                                id="textField" name={key} required={key === 'technique' || key === 'title'}
                            />
                        </div>
                    )
                })}
                <CascadingDropdowns
                    setFormControlData={setFormControlData}
                />
                <Button 
                    onClick={handleSubmit}
                    sx={{mt: 2}}
                    type="submit"
                    variant="contained"
                    disabled={isUploadButtonDisabled()}>
                                    Upload
                </Button>
            </div>
        }
    </>          
};

export default Upload;
