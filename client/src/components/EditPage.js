import { useContext, useEffect, useState } from "react";
import { ImageContext } from "./contexts/ImageContext";
import { generateBackGroundColor } from "./utils/helpers";
import { TextField } from "@mui/material";
import { updateOneArtwork } from "../api/artworksService";
import CancelIcon from '@mui/icons-material/Cancel';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from "react-router-dom";
import CustomDialog from "./reusable/CustomDialog";
import Message from "./reusable/Message";
import { replaceImage } from "../api/s3Service";
import './EditPage.css';

const keysToMap = ['Artist', 'Title', 'Technique', 'Dimensions', 'Price', 'Notes'];

function EditPage() {
    let myStorage = window.localStorage

    const storedImage = JSON.parse(myStorage.getItem('currentImage'));
    const user = JSON.parse(myStorage.getItem('user'))
    const navigate = useNavigate()
    const {
        setIsEditMode,
        updatedEntry,
        setUpdatedEntry,
        setCurrentImages
    } = useContext(ImageContext);

    const [imageReplaceDialogisOpen, setImageReplaceDialogisOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [file, setFile] = useState()
    const [uploadSuccessful, setUploadSuccessful] = useState(false)
    const [uploadingError, setUploadingError] = useState({
        error: false,
        message: "",
    });

    useEffect(() => {
        if (storedImage) {
            setUpdatedEntry(storedImage)
        }
    },[])

    const onChangeEditableInput = (event) => {
        const { name, value } = event.target;
       
        setUpdatedEntry((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const saveUpdatedEntry = (id) => {
        handleUpdateEntry(id);
    };

    const handleUpdateEntry = async (id) => {
        try {
            await updateOneArtwork(updatedEntry, id)
            setUpdatedEntry({});
            navigate(-1)
        } catch (error) {

            setUpdatedEntry({});
        }
    };

    const cancelEditing = () => {
        myStorage.removeItem('currentImage')
        setIsEditMode(false)
        setCurrentImages([])
        navigate(-1)
    }

    const imageSelectHandler = (e) => {
        const file = e.target.files[0];
        setFile(file);
    }

    const handleReplaceImage = async () => {
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("id", updatedEntry.id)
        data.append("old_image_key", storedImage.id === updatedEntry.id && storedImage.image_key)
        data.append("old_download_key", storedImage.id === updatedEntry.id && storedImage.download_key)

        try {
            await replaceImage(data)
            setImageReplaceDialogisOpen(false)
            setUploading(false);
            setUploadSuccessful(true);
        } catch(error) {
            setUploading(false);
            setUploadSuccessful(false);
            setUploadingError({error: true, message: error.response.data.error})
        }
    };

    return (
        <div className="edit-page-main-section">
            <Message
                open={uploadingError.error}
                message={uploadingError.message}
                severity="error" /><Message
                open={uploadSuccessful}
                handleClose={() => setUploadSuccessful(false)}
                message="Image replaced successfully!"
                severity="success" />
            <div className="edit-page-position-container">
                {storedImage && storedImage.position !== 0 ? (
                    <div className="edit-page-position-container"
                        style={{
                            backgroundColor: generateBackGroundColor(storedImage.cell)
                        }}>
                        <p style={{ padding: "0.7rem" }}>{storedImage.position}</p>
                    </div>
                ) : null}
            </div>
            <>
                <div className="edit-page-image-inputs-container">
                    <img className="edit-page-image"
                        src={storedImage && storedImage.image_url}
                        alt="image for edit"/>
                    <div className="edit-page-inputs-actions-container">
                        {keysToMap.map(key => (
                            <TextField
                                className="edit-page-input"
                                key={key}
                                label={key}
                                name={key.toLowerCase()}
                                htmlFor={key.toLowerCase()}
                                onChange={(event) => onChangeEditableInput(event)}
                                value={updatedEntry ? updatedEntry[key.toLowerCase()] : storedImage[key.toLowerCase()]} />
                        ))}
                        <div className="edit-page-actions-container">
                            <CancelIcon fontSize="large" onClick={cancelEditing} />
                            {user.superUser ? <CameraswitchIcon fontSize="large" onClick={() => setImageReplaceDialogisOpen(true)} /> : <></>}
                            <SaveIcon fontSize="large" onClick={() => saveUpdatedEntry(storedImage.id)}/>
                            {imageReplaceDialogisOpen &&
                                <CustomDialog
                                    openModal={imageReplaceDialogisOpen}
                                    setOpenModal={() => setImageReplaceDialogisOpen(false)}
                                    title="Once you replace the image, the old one is deleted!"
                                    handleClickYes={handleReplaceImage}
                                    handleClickNo={() => setImageReplaceDialogisOpen(false)}
                                    confirmButtonText="Replace"
                                    cancelButtonText="Cancel"
                                    disabledConfirmButton={!file || uploading}
                                >
                                    {uploading ?
                                        <p>Please wait...</p>
                                        :
                                        <TextField
                                            onChange={imageSelectHandler}
                                            id="textField" type="file"
                                            autoComplete="current-password"
                                            required/>
                                    }
                                </CustomDialog>}
                        </div>
                    </div>
                </div>
            </>
        </div>
    ) 
}

export default EditPage