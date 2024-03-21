import React, { useContext, useState } from 'react'
import CustomDialog from '../CustomDialog';
import { ImageContext } from '../contexts/ImageContext';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import Message from '../Message';

const DeleteDialog = ({isDialogOpen, handleDialogOpen, isDeleting, handleIsDeleting}) => {

    const {
        currentImages,
        setCurrentImages,
        isEditMode
    } = useContext(ImageContext);

    const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);

    const deleteOne = async (originalFilename, filename, id) => {
        handleIsDeleting(true);
        try {
            const params = {originalFilename, filename, id}
            await axios.delete(
                `http://localhost:5000/artworks/deleteOne/${params}`,
                { params }
            );
        } catch(error) {
            console.log(error)
        } finally {
            handleIsDeleting(false)
        }
    };

    const handleDeleteOne = async (originalName, filename, id) => {
        deleteOne(originalName, filename, id)
        handleDialogOpen(false)
        setIsDeleteSuccessful(true);
        setCurrentImages(prev => prev.filter(image => !currentImages.some(img => img.id === image.id)));
    };

    const handleDeleteMultiple = async () => {

        try {
            const deletePromises = currentImages.map(image =>
                deleteOne(image.download_key, image.image_key, image.id)
            );

            await Promise.allSettled(deletePromises);
            handleIsDeleting(false);
            setIsDeleteSuccessful(true);
            setCurrentImages([]);
        } catch (error) {
            handleIsDeleting(false);
            setIsDeleteSuccessful(false);
        } finally {
            handleDialogOpen(false)
        }
        
    }

    return <>
        {isDeleting && <CircularProgress className="loader" color="primary" />}
        <Message
            open={isDeleteSuccessful}
            handleClose={() => setIsDeleteSuccessful(false)}
            message="Entry deleted successfully!"
            severity="success" />
            
        {isDialogOpen &&
                <CustomDialog
                    openModal={isDialogOpen}
                    setOpenModal={() => handleDialogOpen(true)}
                    title={currentImages.length === 1 ? 
                        "Are you sure you want to delete the entry ?" :
                        "Are you sure you want to delete all selected entries ?"
                    }
                    handleClickYes={() => {
                        if (currentImages.length > 1) {
                            handleDeleteMultiple();
                        } else {
                            handleDeleteOne(currentImages[0].download_key, currentImages[0].image_key, currentImages[0].id);
                        }
                    } }
                    handleClickNo={() => {
                        if (currentImages.length === 1 && !isEditMode) setCurrentImages([])
                        handleDialogOpen(false)
                    } } 
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                    style={{padding: '0'}}
                />}
    </>
}

export default DeleteDialog