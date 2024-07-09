import { useContext, useEffect, useState } from "react";
import { ImageContext } from "./contexts/ImageContext";
import { generateBackGroundColor } from "./utils/helpers";
import { TextField, useMediaQuery } from "@mui/material";
import { updateOneArtwork } from "../api/artworksService";
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SaveIcon from '../components/assets/save-solid.svg'
import { useNavigate } from "react-router-dom";
import CustomDialog from "./CustomDialog";
import Message from "./Message";
import { replaceImage } from "../api/s3Service";

const keysToMap = ['Artist', 'Title', 'Technique', 'Dimensions', 'Price', 'Notes'];

function EditPage() {
    let myStorage = window.localStorage

    const storedImage = JSON.parse(myStorage.getItem('currentImage'));
    const user = JSON.parse(myStorage.getItem('user'))
    const navigate = useNavigate()
    const {
        updatedEntry,
        setUpdatedEntry,
        setCurrentImages
    } = useContext(ImageContext);

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const [imageReplaceDialogisOpen, setImageReplaceDialogisOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [file, setFile] = useState()
    const [uploadSuccessful, setUploadSuccessful] = useState(false)
    // eslint-disable-next-line no-unused-vars
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
        }
    };

    return <>
        <Message
            open={uploadingError.error}
            message={uploadingError.message}
            severity="error" />
        <Message
            open={uploadSuccessful}
            handleClose={() => setUploadSuccessful(false)}
            message="Image replaced successfully!"
            severity="success" />
        <div style={{marginTop: '2rem', marginLeft: '2rem'}}>
            {storedImage && storedImage.position !== 0 ? (
                <div
                    style={{
                        backgroundColor: generateBackGroundColor(storedImage.cell),
                        color: "white",
                        height: "auto",
                        width: '50px'
                    }}>
                    <p style={{ padding: "0.7rem"}}>{storedImage.position}</p>
                </div>
            ) : null}
        </div>
        <div style={isSmallDevice ? {width: '100vw', padding: '1rem', marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'} :{width: '50vw', marginTop: '1rem', marginLeft: '2rem', display: 'flex', alignItems: 'center'}}>
            <img
                src={storedImage && storedImage.image_url}
                alt="image"
                style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover'
                }}
            /> 
            <div style={ isSmallDevice ? {display: 'flex', flexDirection: 'column', marginTop: '2rem'} : {marginLeft: '3rem', display: 'flex',  flexDirection: 'column'}}>
                {keysToMap.map(key => (
                    <div key={key}>
                        <TextField 
                            sx={isSmallDevice ? {width: '100%', marginBottom: '0.5rem'} : {width: '30vw',  marginBottom: '0.5rem'}}
                            label={key}
                            name={key.toLowerCase()}
                            htmlFor={key.toLowerCase()}
                            onChange={(event) => onChangeEditableInput(event)}
                            value={updatedEntry ? updatedEntry[key.toLowerCase()] : storedImage[key.toLowerCase()]}
                        />
                    </div>
                ))}
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '2rem'}}>
                    <CloseIcon className='icon' sx={{fontSize: "30px"}} onClick={cancelEditing}/>
                    {user.superUser ? <SwapHorizIcon className='icon' sx={{fontSize: "32px"}} onClick={() => setImageReplaceDialogisOpen(true)}/> : <></>}
                    <img src={SaveIcon} style={{width: '20px'}} className='icon' onClick={() => saveUpdatedEntry(storedImage.id)}/>
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
                        <><TextField
                            onChange={imageSelectHandler}
                            id="textField" type="file"
                            autoComplete="current-password"
                            required
                            className="peer cursor-pointer block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                            sx={{marginBottom: "-1rem"}}
                        />
                        <p className="invisible peer-invalid:visible text-red-400 mt-0">
                                Please upload an image
                        </p></>}
                </CustomDialog>}
                </div>
            </div> 
        </div> :
        <></>
    </>
}

export default EditPage