import { useEffect, useState } from "react";
import "./Upload.css";
import {Autocomplete, Box, Button, CircularProgress, TextField} from "@mui/material";
import "./App.css";
import Message from "./Message";
import Navbar from "./Navbar";
import CascadingDropdowns from "./CascadingDropdowns";
import { uploadImageWithData } from "../api/s3Service";
import { getAllArtistsRelatedToAllEntries } from "../api/artistsService";
import CustomDropZone from "./CustomDropZone";
import DeleteIcon from '../components/assets/delete-solid.svg'

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

    const handleChangeArtistFromDropDown = async (newValue) => {
        if (!newValue) {
            setIsArtistFromDropDown(false)
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

    const handleChangeNewArtist = (e) => {
        setIsArtistFromDropDown(false)
        setNewArtistFromInput(e.target.value)
        setFormControlData((prevState) => ({
            ...prevState,
            artist: e.target.value,
        }))
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
            
        <Navbar />

        {uploading ? 
            <CircularProgress variant="determinate" value={progress} className="loader" color="primary" />
            : 
            <Box
                component="section"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                margin="2rem"
            >

                <CustomDropZone 
                    handleOndrop={handleOnDrop} 
                    acceptedFormats={{'image/jpeg': ['.jpeg', '.png']}} 
                    isRequired={true}
                    files={[file]}
                />
               
                <div style={{display: 'flex', marginBottom: '1rem', alignItems: 'center'}}>
                    <span className={file ? 'attached' : 'dot'}>
                    </span>
                    <span>{file ? `${file.name.slice(0, 24)}...` : 'Please attach an image!'}</span>
                    {file ? <img
                        src={DeleteIcon}
                        style={{marginLeft: '1rem'}}
                        className='icon'
                        onClick={() => setFile()} /> : <></>}
                </div>
               
                <Autocomplete
                    disablePortal
                    sx={{width: '50vw', marginBottom: '1rem'}}
                    options={artists}
                    renderInput={(params) => <TextField {...params} label="Artists" />}
                    onChange={(event, newValue) => handleChangeArtistFromDropDown(newValue)}
                    required
                />
                <TextField
                    label="Add a new artist"
                    sx={{width: '50vw', marginBottom: '1rem'}}
                    value={newArtistFromInput}
                    disabled={isArtistFromDropdown}
                    onChange={(e) => handleChangeNewArtist(e)}
                />
                {Object.entries(inputsData).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between">
                            </div>
                            <TextField 
                                label={key}
                                sx={{width: '50vw', marginBottom: '1rem'}}
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
                    disabled={!file || !inputsData.technique || !inputsData.title || !formControlData.artist || !formControlData.storageLocation}>
                                    Upload
                </Button>
            </Box>
        }
    </>          
};

export default Upload;
