import React, { useContext, useState } from 'react'
import { ImageContext } from './contexts/ImageContext';
import { saveAs } from "file-saver";
import axios from "axios";
import PdfIcon from '../components/assets/pdf-solid-small.svg'
import DownloadIcon from '../components/assets/download-solid.svg'
import EditIcon from '../components/assets/edit-solid.svg'
import DeleteIcon from '../components/assets/delete-solid.svg'
import SaveIcon from '../components/assets/save-solid.svg'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useMediaQuery } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import './ActionButtons.css'
import Message from './Message';
import CustomDialog from './CustomDialog';
import { TextField } from '@mui/material';
import LocationIcon from '../components/assets/move-solid.svg'

const ActionButtons = ({art, handleDialogOpen, searchResults, handleSearchResults, className = '', setIsLocationChangeDialogOpen}) => {

    const {
        currentImages,
        setCurrentImages,
        updatedEntry,
        setUpdatedEntry,
        setIsEditMode,
        isEditMode,
    } = useContext(ImageContext);

    const user = JSON.parse(localStorage.getItem('user'))


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


    const downloadOriginalImage = (downloadUrl, name) => {
        saveAs(downloadUrl, name);
    };

    const prefillEditableFields = (id) => {
        setIsEditMode(true);
        let copyOfEntry;

        copyOfEntry = searchResults.find((art) => art.id === id);
        const {
            id: copyId,
            artist,
            title,
            technique,
            dimensions,
            price,
            notes,
            storage: { name: storageLocation },
            cell,
            position,
            image_url,
            download_url,
        } = copyOfEntry;
        setUpdatedEntry({
            id: copyId,
            artist,
            title,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cell,
            position,
            image_url,
            download_url
        });
    };

    const cancelEditing = () => {
        setIsEditMode(false);
        setCurrentImages([])
    };

    const saveUpdatedEntry = (id) => {
        updateEntry(id);
        const updatedResults = searchResults.map((entry) =>
            entry.id === id ? updatedEntry : entry
        );
        handleSearchResults(updatedResults);
        setCurrentImages([])
    };

    const updateEntry = async (id) => {
        const response = await axios.put(
            `artworks-management-app.vercel.app/artworks/updateOne/${id}`,
            updatedEntry
        );

        if (response.status === 200) {
            setIsEditMode(false);
            setUpdatedEntry({});
        } else {
            setIsEditMode(false);
            setUpdatedEntry({});
        }
    };

    const imageSelectHandler = (e) => {
        const file = e.target.files[0];
        setFile(file);
    }

    const handleSubmit = async () => {
        try {
            setUploading(true);
            const data = new FormData();
            data.append("file", file);
            data.append("id", updatedEntry.id)
            data.append("old_image_key", art.id === updatedEntry.id && art.image_key)
            data.append("old_download_key", art.id === updatedEntry.id && art.download_key)
    
            const res = await axios.post("artworks-management-app.vercel.app/s3/replace", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                setImageReplaceDialogisOpen(false)
            }

        } catch (error) {
            console.log(error)
        }

        setUploading(false);
        setUploadSuccessful(true);
    };

    const prepareImagesForLocationChange = async() => {
        setIsLocationChangeDialogOpen(true)
    }

    return <>
        <Message
            open={uploadingError.error}
            message={uploadingError.message}
            severity="error" /><Message
            open={uploadSuccessful}
            handleClose={() => setUploadSuccessful(false)}
            message="Image replaced successfully!"
            severity="success" />
  
        {imageReplaceDialogisOpen &&
                <CustomDialog
                    openModal={imageReplaceDialogisOpen}
                    setOpenModal={() => setImageReplaceDialogisOpen(false)}
                    title="Once you replace the image, the old one is deleted!"
                    handleClickYes={handleSubmit}
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
        <div className={isSmallDevice && !className ? 'mobile-icons-container' : 'icons-container'}>
            
            <>
                {!isEditMode && currentImages.length === 1 && currentImages[0].id === art.id ?
                    <img 
                        src={DownloadIcon} 
                        className='icon'
                        onClick={() => downloadOriginalImage(art.download_url, art.download_key)}/>
                    :
                    <></>
                }
                {isEditMode && currentImages.length && currentImages[0].id === art.id ?
                    <>
                        <CloseIcon className='icon' sx={{fontSize: "30px"}} onClick={cancelEditing}/>
                        {user.superUser ? <SwapHorizIcon className='icon' sx={{fontSize: "32px"}} onClick={() => setImageReplaceDialogisOpen(true)}/> : <></>}
                        <img src={SaveIcon} className='icon' onClick={() => saveUpdatedEntry(art.id)}/>
                    </>
                    :
                    <></>}
                {user.superUser && !isSmallDevice && isEditMode && currentImages.length && currentImages[0].id === art.id ?
                    <>
                        <img
                            src={LocationIcon}
                            style={{width: '32px'}}
                            className='icon'
                            onClick={prepareImagesForLocationChange} /></> : <></>  
                }
                {!isEditMode || currentImages.length && currentImages[0].id !== art.id ?
                    <img src={PdfIcon} className='icon'/>
                    :
                    <></>
                }
                {!isEditMode || currentImages.length && currentImages[0].id !== art.id ?
                    <img 
                        src={EditIcon} 
                        className='icon'
                        onClick={() => {
                            setCurrentImages([art]);
                            setIsEditMode(true);
                            prefillEditableFields(art.id);
                        } }/>
                    :
                    <></>
                }
                {user.superUser && !isEditMode || currentImages.length && currentImages[0].id !== art.id ? 
                    <img 
                        src={DeleteIcon}
                        className='icon'
                        onClick={() => {
                            if (!currentImages.length) {
                                setCurrentImages([art])   
                            }
                            handleDialogOpen(true)
                        } }/>
                    :
                    <></>
                }
             
            </>
            
        </div>
      
    </>
}

export default ActionButtons