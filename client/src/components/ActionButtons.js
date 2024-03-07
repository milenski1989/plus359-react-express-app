import React, { useContext, useState } from 'react'
import { ImageContext } from './contexts/ImageContext';
import { saveAs } from "file-saver";
import axios from "axios";
import PdfIcon from '../components/assets/pdf-solid-small.svg'
import DownloadIcon from '../components/assets/download-solid.svg'
import EditIcon from '../components/assets/edit-solid.svg'
import DeleteIcon from '../components/assets/delete-solid.svg'
import CancelIcon from '../components/assets/cancel-solid.svg'
import SaveIcon from '../components/assets/save-solid.svg'
import ReplaceIcon from '../components/assets/replace-solid.svg'
import { useMediaQuery } from "@mui/material";

import './ActionButtons.css'
import Message from './Message';
import CustomDialog from './CustomDialog';
import { TextField } from '@mui/material';

const ActionButtons = ({art, handleDialogOpen, searchResults, handleSearchResults, className = ''}) => {

    const {
        currentImages,
        setCurrentImages,
        updatedEntry,
        setUpdatedEntry,
        setIsEditMode,
        isEditMode,
    } = useContext(ImageContext);

    const myStorage = window.localStorage;
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
            storageLocation,
            cell,
            position,
            image_url,
            download_url
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
        myStorage.removeItem("image");
        setCurrentImages([])
    };

    
    // const getAllData = useCallback(async () => {
    //     handleLoading(true);
    //     try {
    //         const data = await getAllEntries(name, page, sortField, sortOrder);
    //         const { arts, artsCount } = data;
    //         handleSearchResults(arts);
    //         handlePagesCount(Math.ceil(artsCount / 25));
    //         handleTotalCount(artsCount);
    //     } catch (error) {
    //         handleError({ error: true, message: error.message });
    //     } finally {
    //         handleLoading(false);
    //     }
    // }, [name, page, sortField, sortOrder]); 

    const updateEntry = async (id) => {
        const response = await axios.put(
            `http://localhost:5000/artworks/artwork/${id}`,
            updatedEntry
        );

        if (response.status === 200) {
            setIsEditMode(false);
            setUpdatedEntry({});
       
            //getAllData()
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
    
            const res = await axios.post("http://localhost:5000/s3/replace", data, {
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
                {!isEditMode || currentImages.length && currentImages[0].id !== art.id ?
                    <img 
                        src={DownloadIcon} 
                        className='icon'
                        onClick={() => downloadOriginalImage(art.download_url, art.download_key)}/>
                    :
                    <></>
                }
                {isEditMode && currentImages.length && currentImages[0].id === art.id ?
                    <>
                        <img src={CancelIcon} className='icon' onClick={cancelEditing}/>
                        <img src={ReplaceIcon} className='icon' onClick={() => setImageReplaceDialogisOpen(true)}/>
                        <img src={SaveIcon} className='icon' onClick={() => saveUpdatedEntry(art.id)}/>
                    </>
                    :
                    <></>}
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
                <img 
                    src={DeleteIcon}
                    className='icon'
                    onClick={() => {
                        setCurrentImages([art])
                        handleDialogOpen()
                    } }/>
            </>
            
        </div>
      
    </>
}

export default ActionButtons