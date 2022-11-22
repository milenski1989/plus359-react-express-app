/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react";
import "./Upload.css";
import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import "./App.css";
import Message from "./Message";
import SecondaryNavbar from "./SecondaryNavbar";
import axios from "axios";
import { locationCells, locations } from "./constants/constants";

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
    });

    const [cells, setCells] = useState([]);
    const [stores, setStores] = useState([]);
    const [file, setFile] = useState();
    const [uploading, setUploading] = useState(false);
    const [uploadSuccessful, setUploadSuccessful] = useState(false);
    const [uploadingError, setUploadingError] = useState({
        error: false,
        message: "",
    });
    const [progress, setProgress] = useState(0)

    const [inputTouched, setInputTouched] = useState(false)

    useEffect(() => {
        setStores(locations);
    }, []);

    const handleLocationSelect = (id) => {
        const filteredCells = locationCells.filter(
            (locationCell) => locationCell.locationNameId === id
        );
        setCells(filteredCells[0]);
    };

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

        const res = await axios.post("http://localhost:5000/api/upload", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress
        });

        if (res.status === 200 || res.status === 201) {
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
            })
            setInputTouched(false)
           
        } else {
            setProgress(0)
            setUploading(false);
            setUploadingError({ error: true, message: res.error.message });
            setInputTouched(false) 
        }
    };

    return (
        <>
            {
                <Message
                    open={uploadingError.error}
                    handleClose={() => setUploadingError({ error: false, message: "" })}
                    message={uploadingError.message}
                    severity="error"
                />
            }
            <SecondaryNavbar />

            <section className="uploadSection mainSection">
                {
                    <Message
                        open={uploadSuccessful}
                        handleClose={() => setUploadSuccessful(false)}
                        message="Entry uploaded successfully!"
                        severity="success"
                    />
                }
                {uploading ? (
                    <CircularProgress variant="determinate" value={progress} className="loader" color="primary" />
                ) : (
                    <div className="flexContainer">
                           
                        <TextField
                            sx={{
                                boxShadow: 1
                            }}                            accept="image/*"
                            multiple
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

                        <FormControl margin="normal" fullWidth>
                            <InputLabel required>locations</InputLabel>
                            <Select
                                sx={{
                                    boxShadow: 1
                                }}
                                value={formControlData.storageLocation.id || ""}
                                name="storageLocation"
                                onBlur={() => setInputTouched(true)}
                                error={inputTouched && !formControlData["storageLocation"] }
                                onChange={(event) => {
                                    const { value } = event.target;
                                    handleLocationSelect(value),
                                    setFormControlData((prevState) => ({
                                       
                                        ...prevState,
                                        storageLocation: {
                                            id: value,
                                            name: stores[value - 1].name,
                                        },
                                    }));
                                }}
                            >
                                {stores.length !== 0 &&
                  stores.map((store, index) => {
                      return (
                          <MenuItem key={index} value={store.id}>
                              {store.name}
                          </MenuItem>
                      );
                  })}
                            </Select>
                        </FormControl>

                        <FormControl margin="normal" fullWidth>
                            <InputLabel required>cells</InputLabel>
                            <Select
                                sx={{
                                    boxShadow: 1
                                }}
                                value={formControlData.cell}
                                name="cell"
                                onBlur={() => setInputTouched(true)}
                                error={inputTouched && !formControlData["cell"] }
                                onChange={(event) => {
                                    setFormControlData((prevState) => ({
                                        ...prevState,
                                        cell: event.target.value,
                                    }));
                                }}
                            >
                                {cells.length !== 0 &&
                  cells.cellNumbers.map((cell, index) => {
                      return (
                          <MenuItem key={index} value={cell}>
                              {cell}
                          </MenuItem>
                      );
                  })}
                            </Select>
                        </FormControl>

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
