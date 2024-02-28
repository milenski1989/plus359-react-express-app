import React, { useContext, useState } from 'react'
import CustomDialog from '../CustomDialog';
import { ImageContext } from '../contexts/ImageContext';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import Message from '../Message';

const DeleteDialog = ({isDialogOpen, handleDialogClose, isDeleting, handleIsDeleting}) => {

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
                `https://app.plus359gallery.com/artworks/artwork/${params}`,
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
        handleDialogClose()
        setIsDeleteSuccessful(true);
        setCurrentImages(prev => prev.filter(image => !currentImages.some(img => img.id === image.id)));
    };

    const handleDeleteMultiple = async () => {

        const deletePromises = currentImages.map(image =>
            deleteOne(image.download_key, image.image_key, image.id)
        );

        try {
            await Promise.all(deletePromises);
            handleIsDeleting(false);
            setIsDeleteSuccessful(true);
            setCurrentImages(prev => prev.filter(image => !currentImages.some(img => img.id === image.id)));
        } catch (error) {
            handleIsDeleting(false);
            setIsDeleteSuccessful(false);
        } finally {
            handleDialogClose()
        }
        
    }

    return <>
        {isDeleting && <CircularProgress className="loader" color="primary" />}
        <Message
            open={isDeleteSuccessful}
            onClose={() => setIsDeleteSuccessful(false)}
            message="Entry deleted successfully!"
            severity="success" />
        {isDialogOpen &&
                <CustomDialog
                    openModal={isDialogOpen}
                    setOpenModal={handleDialogClose}
                    title="Are you sure you want to delete the entry ?"
                    handleClickYes={() => {
                        if (currentImages.length > 1) {
                            handleDeleteMultiple(currentImages[0].download_key, currentImages[0].image_key, currentImages[0].id);
                        } else {
                            handleDeleteOne(currentImages[0].download_key, currentImages[0].image_key, currentImages[0].id);
                        }
                    } }
                    handleClickNo={() => {
                        if (currentImages.length === 1 && !isEditMode) setCurrentImages([])
                        handleDialogClose()
                    } } 
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                />}
    </>
}

export default DeleteDialog