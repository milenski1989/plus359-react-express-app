/* eslint-disable react/no-children-prop */
import { useState } from "react"
import './Upload.css'
import { Button, IconButton, TextField} from "@mui/material"
import './App.css'
import Message from "./Message"
import SecondaryNavbar from "./SecondaryNavbar"
import { ThreeDots } from "react-loader-spinner"
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import axios from "axios"

const Upload = () => {

    const [artFormData, setArtFormData] = useState({
        title: "",
        author: "",
        height: 0,
        width: 0,
        image: null
    
    })

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    const [uploading, setUploading] = useState(false)
    const [uploadSuccessful, setUploadSuccessful] = useState(false)
    const [uploadingError, setUploadingError] = useState({error: false, message: ""})

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const uploadFile = async () => {
        setUploading(true)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
      
        const res = await axios.post(
            "http://localhost:5000/api/upload",
            formData
        );
        console.log('RES',res);

        setUploading(false)
    };
    return <>
        {<Message open={uploadingError.error} handleClose={() => setUploadingError({error: false, message: ""})} message={uploadingError.message} severity="error"
        /> }
        <SecondaryNavbar/>
        <section className="uploadSection mainSection">
            {(uploading) ?
                <div className="loader">
                    <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#78FECF"
                        ariaLabel="three-dots-loading"
                        visible={true}
                    />
                </div>
                :
                <div className="flexContainer">
                    <Button variant="outlined" component="label">
                         Upload
                        <input hidden accept="image/*" multiple type="file"  onChange={saveFile}/>
                    </Button>
                    <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" />
                        <PhotoCamera />
                    </IconButton>
                    <TextField
                        value={artFormData.title}
                        multiline={true}
                        label="Artwork Name"
                        variant="outlined"
                        margin="normal"
                        type="text"
                        onChange={(event) => setArtFormData(prevState => ({ ...prevState, title: event.target.value }))} />

                    <TextField
                        value={artFormData.author}
                        label="Author Name"
                        variant="outlined"
                        margin="normal"
                        type="text"
                        required
                        onChange={(event) => setArtFormData(prevState => ({ ...prevState, author: event.target.value }))} />
                    <TextField
                        value={artFormData.height}
                        label="Height(cm)"
                        variant="outlined"
                        margin="normal"
                        type="number"
                        required
                        pattern="[0-9]*"
                        onChange={(event) => setArtFormData(prevState => ({ ...prevState, height: event.target.value }))} />
                    <TextField
                        value={artFormData.width}
                        label="Width(cm)"
                        variant="outlined"
                        margin="normal"
                        type="number"
                        required
                        pattern="[0-9]*"
                        onChange={(event) => setArtFormData(prevState => ({ ...prevState, width: event.target.value }))} />
                    <Button
                        children="Upload"
                        variant="outlined"
                        onClick={uploadFile}
                        sx={{ width: 100, padding: 0.5, marginTop: 0.75 }}
                    />
                </div>
            }
        </section>

        {
            <Message open={uploadSuccessful} handleClose={() => setUploadSuccessful(false)} message="Entry uploaded successfully!" severity="success"
            />}
    </>
}

export default Upload