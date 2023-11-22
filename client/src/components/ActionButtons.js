import React, { useContext } from 'react'
import IconBxsDownload from './icons as components/IconBxsDownload';
import Icon277Exit from './icons as components/IconExit';
import IconEdit from './icons as components/IconEdit';
import IconDelete from './icons as components/IconDelete';
import IconSave from './icons as components/IconSave'
import { ImageContext } from './contexts/ImageContext';
import { saveAs } from "file-saver";
import axios from "axios";

function ActionButtons({art, handleMultiSelectMode, handleConfirmationDialog, searchResults, fetchData}) {

    const {
        currentImages,
        setCurrentImages,
        updatedEntry,
        setUpdatedEntry,
        setIsEditMode,
        isEditMode,
    } = useContext(ImageContext);

    const myStorage = window.localStorage;

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
            position
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
            position
        });
    };

    const cancelEditing = () => {
        setIsEditMode(false);
        setCurrentImages([])
    };

    const saveUpdatedEntry = (id) => {
        updateEntry(id);
        myStorage.removeItem("image");
        setCurrentImages([])
        handleMultiSelectMode(false)
    };

    const updateEntry = async (id) => {
        const response = await axios.put(
            `https://app.plus359gallery.com/artworks/artwork/${id}`,
            updatedEntry
        );

        if (response.status === 200) {
            setIsEditMode(false);
            setUpdatedEntry({});
            await fetchData()
        } else {
            setIsEditMode(false);
            setUpdatedEntry({});
        }
    };


    return (
        <div className="flex justify-around mt-4 mb-4">
            <IconBxsDownload
                onClick={() => downloadOriginalImage(art.download_url, art.download_key)} />
            {isEditMode && currentImages.length && currentImages[0].id === art.id &&
        <>
            <Icon277Exit onClick={cancelEditing} />
            <IconSave onClick={() => saveUpdatedEntry(art.id)} />
        </>}

         
            <IconEdit
                onClick={() => {
                    setCurrentImages([art]);
                    setIsEditMode(true);
                    prefillEditableFields(art.id);
                } } />

          
            <IconDelete
                onClick={() => {
                    setCurrentImages([art]);
                    handleConfirmationDialog(true);
                } } />
        </div>
    )
}

export default ActionButtons