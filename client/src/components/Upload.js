/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react";
import "./Upload.css";
import {
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import "./App.css";
import Message from "./Message";
import SecondaryNavbar from "./SecondaryNavbar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import Loader from "./Loader";
import { locationCells, locations } from "./constants/constants";

const Upload = () => {
    const [inputsData, setInputsData] = useState({
        artist: "",
        title: "",
        technique: "",
        dimensions: "",
        price: 0,
        notes: "",
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
        if (inputsData.artist === "" || inputsData.title === "" || inputsData.dimensions === "" || formControlData.storageLocation === "" || formControlData.cell === "") {
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
        });

        if (res.status === 200 || res.status === 201) {
            setUploading(false);
            setUploadSuccessful(true);
        } else {
            setUploading(false);
            setUploadingError({ error: true, message: res.error.message });
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
                    <Loader />
                ) : (
                    <div className="flexContainer">
                        <Button variant="outlined" component="label">
              Upload
                            <input
                                hidden
                                accept="image/*"
                                multiple
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </Button>
                        <IconButton
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                        >
                            <input hidden accept="image/*" type="file" />
                            <PhotoCamera />
                        </IconButton>

                        {Object.entries(inputsData).map(([key, value]) => {
                            return (
                                <TextField
                                    key={key}
                                    value={value || ""}
                                    error={(key === "artist" || key === "title" || key === "dimensions") && !value}
                                    label={key}
                                    required={setRequiredFields(key)}
                                    variant="outlined"
                                    margin="normal"
                                    type={typeof value === "string" ? "text" : "number"}
                                    onChange={(event) =>
                                        setInputsData((prevState) => ({
                                            ...prevState,
                                            [key]: event.target.value,
                                        }))
                                    }
                                />
                            );
                        })}

                        <FormControl margin="normal" fullWidth error={!formControlData["storageLocation"]}>
                            <InputLabel required>locations</InputLabel>
                            <Select
                                value={formControlData.storageLocation.id || ""}
                                name="storageLocation"
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

                        <FormControl margin="normal" fullWidth error={!formControlData["cell"]}>
                            <InputLabel required>cells</InputLabel>
                            <Select
                                value={formControlData.cell}
                                name="cell"
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
                            sx={{ width: 100, padding: 0.5, marginTop: 0.75 }}
                        />
                    </div>
                )}
            </section>
        </>
    );
};

export default Upload;
