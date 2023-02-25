import { useState } from "react";
import "./Upload.css";
import {
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
} from "@mui/material";
import "./App.css";
import Message from "./Message";
import SecondaryNavbar from "./SecondaryNavbar";
import axios from "axios";
import LocationsDropdowns from "./LocationsDropdowns";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { yellow } from '@mui/material/colors';

const Upload = () => {

    let myStorage = window.localStorage
    let user = JSON.parse(myStorage.getItem('user'));

    const [inputsData, setInputsData] = useState({
        artist: "",
        title: "",
        technique: "",
        dimensions: "",
        price: 0,
        notes: "",
        onWall: 0,
        inExhibition: 0
    });

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: 0
    });

    const [uploadingError, setUploadingError] = useState({
        error: false,
        message: "",
    });

    const [progress, setProgress] = useState(0)
    const [inputTouched, setInputTouched] = useState(false)
    const [file, setFile] = useState();
    const [uploading, setUploading] = useState(false);
    const [uploadSuccessful, setUploadSuccessful] = useState(false);

    const disableUploadButton = () => {
        let disabled;
        if (
            inputsData.artist === "" || 
            inputsData.dimensions === "" || 
            formControlData.storageLocation === "" ||
            !file
        ) {
            disabled = true
        }

        return disabled
    }

    const setRequiredFields = (label) => {
        let required;
        if (label === "artist" || label === "dimensions") {
            required = true
        }
        return required
    }

    const imageSelectHandler = (e) => {
        const file = e.target.files[0];
        setFile(file);
    }

    const uploadFile = async () => {
        try {
            const onUploadProgress = (event) => {
                const percentage = Math.round((100 * event.loaded) / event.total);
                setProgress(percentage)
            };
            setUploading(true);
            const data = new FormData();
            data.append("file", file);
            data.append("artist", inputsData.artist);
            data.append("title", inputsData.title);
            data.append("technique", inputsData.technique);
            data.append("dimensions", inputsData.dimensions);
            data.append("price", inputsData.price);
            data.append("notes", inputsData.notes);
            data.append("onWall", inputsData.onWall);
            data.append("inExhibition", inputsData.inExhibition);
            data.append("storageLocation", formControlData.storageLocation.name);
            data.append("cell", formControlData.cell);
            data.append("position", formControlData.position)
            data.append("by_user", user.userName)
    
            await axios.post("http://localhost:5000/api/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress
            });
    
            setProgress(0)
            setUploading(false);
            setUploadSuccessful(true);
            setInputsData({
                artist: "",
                title: "",
                technique: "",
                dimensions: "",
                price: 0,
                notes: "",
                onWall: 0,
                inExhibition: 0
            })
    
            setFormControlData({
                storageLocation: "",
                cell: "",
                position: 0
            })
            setInputTouched(false)
            
        } catch (error) {
            setProgress(0)
            setUploading(false);
            setUploadingError({ error: true, message: error.message});
            setInputsData({
                artist: "",
                title: "",
                technique: "",
                dimensions: "",
                price: 0,
                notes: "",
                onWall: 0,
                inExhibition: 0
            })
    
            setFormControlData({
                storageLocation: "",
                cell: "",
                position: 0
            })
            setInputTouched(false)
        }
    };
 
    return (
        <>
            <Message
                open={uploadingError.error}
                handleClose={() => setUploadingError({ error: false, message: "" })}
                message={uploadingError.message}
                severity="error"
            />
            
            <Message
                open={uploadSuccessful}
                handleClose={() => setUploadSuccessful(false)}
                message="Entry uploaded successfully!"
                severity="success"
            />
            
            <SecondaryNavbar />

            
            
            {uploading ? (
                <CircularProgress variant="determinate" value={progress} className="loader" color="primary" />
            ) : (
                <section className="flexContainer mainSection">
                           
                    <TextField
                        sx={{
                            boxShadow: 1
                        }}                          
                        type="file"
                        onChange={imageSelectHandler}
                    />

                    {Object.entries(inputsData).map(([key, value]) => {
                        return (
                            key !== "onWall" && key !== "inExhibition" &&
                            <TextField
                                key={key}
                                onBlur={() => key === "artist" || key === "dimensions" && setInputTouched(true)}
                                value={value || ""}
                                error={(key === "artist" || key === "dimensions") && inputTouched && !value}
                                label={key}
                                InputProps={key === "notes" ? {endAdornment: <><InputAdornment position="end">
                                    <Tooltip title="on a wall" placement="top">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>  
                                                setInputsData((prevState) => ({
                                                    ...prevState,
                                                    onWall: 1,
                                                }))}
                                            edge="end"
                                        >
                                            <CheckCircleIcon sx={{ color: yellow[500]}} />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                                <InputAdornment position="end">
                                    <Tooltip title="in exhibition" placement="top">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>  
                                                setInputsData((prevState) => ({
                                                    ...prevState,
                                                    inExhibition: 1,
                                                }))}
                                            edge="end"
                                        >
                                            <CheckCircleIcon color="success" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment></>} : null}
                                required={setRequiredFields(key)}
                                variant="outlined"
                                margin="normal"
                                type="text"
                                sx={{
                                    boxShadow: 1
                                }}
                                onChange={(event) =>
                                    setInputsData((prevState) => ({
                                        ...prevState,
                                        [key]: event.target.value,
                                    }))
                                }
                            />
                        );
                    })}

                    <LocationsDropdowns
                        formControlData={formControlData}
                        setFormControlData={setFormControlData}
                        inputTouched={inputTouched}
                        setInputTouched={setInputTouched}
                    />

                    <Button
                        disabled={disableUploadButton()}
                        children="Upload"
                        variant="outlined"
                        onClick={uploadFile}
                        sx={{ width: "100px", padding: "0.5rem", marginTop: "0.75rem", boxShadow: 1, marginLeft: "auto", marginRight: "auto"}}
                    />
                </section>
            )}
          
        </>
    );
};

export default Upload;
