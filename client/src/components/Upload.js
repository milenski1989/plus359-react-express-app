/* eslint-disable react/no-children-prop */
import { useState } from "react";
import "./Upload.css";
import { Button, IconButton, TextField } from "@mui/material";
import "./App.css";
import Message from "./Message";
import SecondaryNavbar from "./SecondaryNavbar";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import Loader from "./Loader";

const Upload = () => {
    const [artFormData, setArtFormData] = useState({
        author: "",
        title: "",
        technique: "",
        storageLocation: 1,
        height: 0,
        width: 0,
    });

    const [file, setFile] = useState();
    const [uploading, setUploading] = useState(false);
    const [uploadSuccessful, setUploadSuccessful] = useState(false);
    const [uploadingError, setUploadingError] = useState({
        error: false,
        message: "",
    });

    const uploadFile = async () => {
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("author", artFormData.author)
        data.append("title", artFormData.title);
        data.append("technique", artFormData.technique)
        data.append("storageLocation", artFormData.storageLocation)
        data.append("width", artFormData.width);
        data.append("height", artFormData.height);

        const res = await axios.post("http://localhost:5000/api/upload", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (res.status === 200 || res.status === 201) {
            console.log(res)
            setUploading(false);
            setUploadSuccessful(true)
        } else {
            setUploading(false);
            setUploadingError({ error: true, message: res.error.message })
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
                    <Loader/>
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
                        <TextField
                            value={artFormData.author || ""}
                            label="Artist"
                            variant="outlined"
                            margin="normal"
                            type="text"
                            onChange={(event) =>
                                setArtFormData((prevState) => ({
                                    ...prevState,
                                    author: event.target.value,
                                }))
                            }
                        />
                        <TextField
                            value={artFormData.title || ""}
                            multiline={true}
                            label="Title"
                            variant="outlined"
                            margin="normal"
                            type="text"
                            onChange={(event) =>
                                setArtFormData((prevState) => ({
                                    ...prevState,
                                    title: event.target.value,
                                }))
                            }
                        />
                        <TextField
                            value={artFormData.technique || ""}
                            multiline={true}
                            label="Technique"
                            variant="outlined"
                            margin="normal"
                            type="text"
                            onChange={(event) =>
                                setArtFormData((prevState) => ({
                                    ...prevState,
                                    technique: event.target.value,
                                }))
                            }
                        />
                        <TextField
                            value={artFormData.storageLocation || 1}
                            label="Location"
                            variant="outlined"
                            margin="normal"
                            type="text"
                            onChange={(event) => {console.log(event.target.value); return setArtFormData((prevState) => ({
                                ...prevState,
                                storageLocation: event.target.value,
                            }))}
                            
                            }
                        />
                        <TextField
                            value={artFormData.height || 0}
                            label="Height(cm)"
                            variant="outlined"
                            margin="normal"
                            type="number"
                            pattern="[0-9]*"
                            onChange={(event) =>
                                setArtFormData((prevState) => ({
                                    ...prevState,
                                    height: event.target.value,
                                }))
                            }
                        />
                        <TextField
                            value={artFormData.width || 0}
                            label="Width(cm)"
                            variant="outlined"
                            margin="normal"
                            type="number"
                            pattern="[0-9]*"
                            onChange={(event) =>
                                setArtFormData((prevState) => ({
                                    ...prevState,
                                    width: event.target.value,
                                }))
                            }
                        />
                        <Button
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
