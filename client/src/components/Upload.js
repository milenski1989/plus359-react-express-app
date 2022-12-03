/* eslint-disable react/no-children-prop */
import { useState } from "react";
import "./Upload.css";
import {
    Button,
    CircularProgress,
    TextField,
} from "@mui/material";
import "./App.css";
import Message from "./Message";
import SecondaryNavbar from "./SecondaryNavbar";
import axios from "axios";
import LocationsDropdowns from "./LocationsDropdowns";

const Upload = () => {

    const [inputsData, setInputsData] = useState({
        artist: "",
        title: "",
        technique: "",
        dimensions: "",
        price: 0,
        notes: ""
    });

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: ""
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
        if (inputsData.artist === "" || inputsData.title === "" || inputsData.dimensions === "" || formControlData.storageLocation === "" || formControlData.cell === "" || !file) {
            disabled = true
        }

        return disabled
    }

    const setRequiredFields = (label) => {
        let required;
        if (label === "artist" || label === "title" || label === "dimensions") {
            required = true
        }
        return required
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
            data.append("storageLocation", formControlData.storageLocation.name);
            data.append("cell", formControlData.cell);
            data.append("position", formControlData.position)
    
            await axios.post("https://app.plus359gallery.eu/api/upload", data, {
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
            })
    
            setFormControlData({
                storageLocation: "",
                cell: "",
                position: ""
            })
            setInputTouched(false)
            
        } catch (error) {
            setProgress(0)
            setUploading(false);
            setUploadingError({ error: true, message: error.message});
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

            <section className="uploadSection mainSection">
            
                {uploading ? (
                    <CircularProgress variant="determinate" value={progress} className="loader" color="primary" />
                ) : (
                    <div className="flexContainer">
                           
                        <TextField
                            sx={{
                                boxShadow: 1
                            }}                           
                            accept="image/*"
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                        />

                        {Object.entries(inputsData).map(([key, value]) => {
                            return (
                                <TextField
                                    key={key}
                                    onBlur={() => key === "artist" || key === "title" || key === "dimensions" && setInputTouched(true)}
                                    value={value || ""}
                                    error={(key === "artist" || key === "title" || key === "dimensions") && inputTouched && !value}
                                    label={key}
                                    required={setRequiredFields(key)}
                                    variant="outlined"
                                    margin="normal"
                                    type={typeof value === "string" ? "text" : "number"}
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
                            sx={{ width: 100, padding: 0.5, marginTop: 0.75, boxShadow: 1 }}
                        />
                    </div>
                )}
            </section>
        </>
    );
};

export default Upload;
