import { useEffect, useState } from "react";
import "./Upload.css";
import {Autocomplete, Box, Button, CircularProgress, TextField} from "@mui/material";
import "./App.css";
import Message from "./Message";
import Navbar from "./Navbar";
import axios from "axios";
import CascadingDropdowns from "./CascadingDropdowns";

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
        const res = await fetch(`https://artworks-management-app.vercel.app/artists/relatedToEntries`)
        const data = await res.json()
        setArtists(data)
    }

    useEffect(() => {
        getArtists()
    },[])

    const imageSelectHandler = (e) => {
        const _file = e.target.files[0];
        setFile(_file);
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
    
            await axios.post("https://artworks-management-app.vercel.app/s3/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress
            });
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
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: '3rem auto',
                    marginTop: '4rem',
                    width: "60vw",
                }}
            >
                <TextField
                    onChange={imageSelectHandler} 
                    id="textField" type="file" 
                    autoComplete="current-password" 
                    required 
                    className="peer cursor-pointer block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                <p className="invisible peer-invalid:visible text-red-400 mt-0">
                                    Please upload an image
                </p>
                <Autocomplete
                    disablePortal
                    options={artists}
                    renderInput={(params) => <TextField {...params} label="Artists" />}
                    onChange={(event, newValue) => handleChangeArtistFromDropDown(newValue)}
                    required
                    sx={{marginBottom: '1rem'}}
                />
                <TextField
                    label="Add a new artist"
                    value={newArtistFromInput}
                    disabled={isArtistFromDropdown}
                    onChange={(e) => handleChangeNewArtist(e)}
                    sx={{ marginBottom: "1rem", width: '60vw' }}
                />
                {Object.entries(inputsData).map(([key, value]) => {
                    return (
                        <div key={key}>
                            <div className="flex items-center justify-between">
                            </div>
                            <TextField 
                                label={key}
                                value={value} 
                                onChange={(event) => handleInputChange(key, event)} 
                                id="textField" name={key} required={key === 'technique' || key === 'title'}
                                sx={{marginBottom: '1rem', width: '60vw'}}
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
