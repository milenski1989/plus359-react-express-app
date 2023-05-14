import { useState } from "react";
import "./Upload.css";
import {CircularProgress} from "@mui/material";
import "./App.css";
import Message from "./Message";
import SecondaryNavbar from "./SecondaryNavbar";
import axios from "axios";
import CascadingDropdowns from "./CascadingDropdowns";
import InvalidInputText from "./InvalidInputText";

const Upload = () => {

    let myStorage = window.localStorage
    let user = JSON.parse(myStorage.getItem('user'));

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

    const imageSelectHandler = (e) => {
        const file = e.target.files[0];
        setFile(file);
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
            data.append("artist", inputsData.artist);
            data.append("title", inputsData.title);
            data.append("technique", inputsData.technique);
            data.append("dimensions", inputsData.dimensions);
            data.append("price", inputsData.price);
            data.append("notes", inputsData.notes);
            data.append("storageLocation", formControlData.storageLocation);
            data.append("cell", formControlData.cell);
            data.append("position", formControlData.position)
            data.append("by_user", user.userName)
    
            await axios.post("http://localhost:5000/api/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress
            });
            
        } catch (error) {
            console.log(error)
        }

        setProgress(0)
        setUploading(false);
        setUploadSuccessful(true);
        // setInputsData({
        //     artist: "",
        //     title: "",
        //     technique: "",
        //     dimensions: "",
        //     price: 0,
        //     notes: "",
        //     onWall: 0,
        //     inExhibition: 0
        // })
    
        // setFormControlData({
        //     storageLocation: "",
        //     cell: "",
        //     position: 0
        // })
        setInputTouched(false)
    };
 
    return <>
        <Message
            open={uploadingError.error}
            handleClose={() => setUploadingError({ error: false, message: "" })}
            message={uploadingError.message}
            severity="error" /><Message
            open={uploadSuccessful}
            handleClose={() => setUploadSuccessful(false)}
            message="Entry uploaded successfully!"
            severity="success" />
        <SecondaryNavbar />

        {uploading ? 
            <CircularProgress variant="determinate" value={progress} className="loader" color="primary" />
            : 

            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                </div>

                <div className="mt-10 w-2/5 sm:mx-auto max-sm:w-4/5 max-sm:mr-auto max-sm:ml-auto">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <div className="flex items-center justify-between">
                            </div>
                            <div className="mt-2">
                                <input
                                    onChange={imageSelectHandler} id="textField" type="file" autoComplete="current-password" required className="peer cursor-pointer block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                <InvalidInputText
                                    text='Please upload an image'
                                />
                            </div>
                        </div>

                        {Object.entries(inputsData).map(([key, value]) => {
                            return (
                                <div key={key}>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="textField" className="block text-sm font-medium leading-6 text-gray-900">{key === 'artist' || key === 'technique' ? `*${key}` : key}</label>
                                    </div>
                                    <div className="mt-1">
                                        <input value={value} 
                                            onChange={(event) =>
                                                setInputsData((prevState) => ({
                                                    ...prevState,
                                                    [key]: event.target.value,
                                                }))
                                            } id="textField" name={key} type="text" autoComplete="current-password" required={key === 'artist' || key === "technique"} className="peer block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                        <InvalidInputText
                                            text= {`Please enter ${key}`}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        <CascadingDropdowns
                            formControlData={formControlData}
                            setFormControlData={setFormControlData}
                            inputTouched={inputTouched}
                            setInputTouched={setInputTouched}
                        />

                        <div>
                            <button type="submit" disabled={!file || !inputsData.artist || !inputsData.technique || !formControlData.storageLocation} className={!file || !inputsData.artist || !inputsData.technique || !formControlData.storageLocation ? "flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm leading-6 text-grey shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" : "flex w-full justify-center rounded-md bg-main px-3 py-1.5 text-sm leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"}>Upload</button>
                        </div>
                    </form>
                </div>
            </div>}
    </>          
};

export default Upload;
