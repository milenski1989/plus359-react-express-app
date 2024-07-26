import React, { useContext, useState } from 'react';
import CustomDialog from './CustomDialog';
import { ImageContext } from '../contexts/ImageContext';
import { CircularProgress } from '@mui/material';
import Message from './Message';
import { deleteOneArtwork } from '../../api/artworksService';


const DeleteDialog = ({ isDialogOpen, handleDialogOpen, isDeleting, handleIsDeleting }) => {
    const { currentImages, setCurrentImages, isEditMode } = useContext(ImageContext);
    const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);

    const deleteArtworks = async (artworks) => {
        handleIsDeleting(true);
        try {
            if (Array.isArray(artworks)) {
                const deletePromises = artworks.map(({ download_key, image_key, id }) => 
                    deleteOneArtwork({ originalFilename: download_key, filename: image_key, id })
                );
                await Promise.allSettled(deletePromises);
                setCurrentImages([]);
            } else {
                const { download_key, image_key, id } = artworks;
                await deleteOneArtwork({ originalFilename: download_key, filename: image_key, id });
                setCurrentImages(prev => prev.filter(image => image.id !== id));
            }
            setIsDeleteSuccessful(true);
        } catch (error) {
            console.log(error);
            setIsDeleteSuccessful(false);
        } finally {
            handleIsDeleting(false);
            handleDialogOpen(false);
        }
    };

    const handleDelete = () => {
        if (currentImages.length > 1) {
            deleteArtworks(currentImages);
        } else if (currentImages.length === 1) {
            deleteArtworks(currentImages[0]);
        }
    };

    return (
        <>
            {isDeleting && <CircularProgress className="loader" color="primary" />}
            <Message
                open={isDeleteSuccessful}
                handleClose={() => setIsDeleteSuccessful(false)}
                message="Entry deleted successfully!"
                severity="success"
            />
            {isDialogOpen && (
                <CustomDialog
                    openModal={isDialogOpen}
                    setOpenModal={() => handleDialogOpen(true)}
                    title={
                        currentImages.length === 1
                            ? "Are you sure you want to delete the entry?"
                            : `Are you sure you want to delete ${currentImages.length} selected entries?`
                    }
                    handleClickYes={handleDelete}
                    handleClickNo={() => {
                        if (currentImages.length === 1 && !isEditMode) setCurrentImages([]);
                        handleDialogOpen(false);
                    }}
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                    style={{ padding: '0' }}
                />
            )}
        </>
    );
};

export default DeleteDialog;
