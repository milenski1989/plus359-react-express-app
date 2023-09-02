import { useContext, useEffect, useRef, useState } from "react";
import CascadingDropdowns from "./CascadingDropdowns";
import { ImageContext } from "./App";
import IconBxsDownload from "./icons as components/IconBxsDownload";
import Icon277Exit from "./icons as components/IconExit";
import IconSave from "./icons as components/IconSave";
import IconEdit from "./icons as components/IconEdit";
import IconMoreHorizontal from "./icons as components/IconMoreHorizontal";
import { blue } from '@mui/material/colors';
import { saveAs } from "file-saver";
import axios from "axios";
import { Checkbox } from "@mui/material";
import IconDelete from "./icons as components/IconDelete";


const ListView = ({searchResults, handleThumbnailView, handleMultiSelectMode, multiSelectMode, getAll, selectedImageIndex, handleConfirmationDialog}) => {

    const {
        currentImages,
        setCurrentImages,
        updatedEntry,
        setUpdatedEntry,
        setIsEditMode,
        isEditMode,
    } = useContext(ImageContext);

    const myStorage = window.localStorage;

    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: "",
    });

    const listRef = useRef(null);


    useEffect(() => {
        if (selectedImageIndex != null && listRef.current) {
            listRef.current.children[selectedImageIndex].scrollIntoView({
                
                block: 'center',
            });
        }
    }, [selectedImageIndex]);

    const checkBoxHandler = (e, id) => {
        const index = searchResults.findIndex(art => art.id === id)
        if (e.target.checked) {
           
            setCurrentImages(prev => [...new Set(prev).add(searchResults[index])])
        } else {
            setCurrentImages(prev => [...prev.filter(image => image.id !== id )])
        }
    }

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
            `http://localhost:5000/artworks/artwork/${id}`,
            updatedEntry
        );

        if (response.status === 200) {
            setIsEditMode(false);
            setUpdatedEntry({});
            await getAll();
        } else {
            setIsEditMode(false);
            setUpdatedEntry({});
        }
    };

    const downloadOriginalImage = (downloadUrl, name) => {
        saveAs(downloadUrl, name);
    };

    const onChangeEditableInput = (event) => {
        const { name, value } = event.target;
        setUpdatedEntry((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    return <>
        <div>

        </div>
        <div  ref={listRef} className="gallery grid grid-cols-4 gap-x-3 max-sm:grid-cols-1 max-sm:p-0 p-20">
            {searchResults.map((art, id) => (

                <><div
                    key={id}
                    className="bg-white my-7 border border shadow-lg shadow-grey rounded-md h-max max-2xl:w-3/4">
                    <div className="flex items-center p-4">

                        <p className="flex-1 text-sm font-semibold">{art.artist}</p>
                        <IconMoreHorizontal className="h-5" />
                    </div>

                    {multiSelectMode &&
                            <Checkbox
                                style={{ position: "absolute" }} onChange={(e) => checkBoxHandler(e, art.id)}
                                sx={{
                                    color: blue[400],
                                    '&.Mui-checked': {
                                        color: blue[600],
                                    }
                                }} />}
                    <img
                        onClick={() => handleThumbnailView(true)}
                        className="w-full" src={art.image_url} />
                    <div className="flex justify-between p-4">
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
                    <div>
                        <p className="px-4 mb-4">
                            {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                                <div>
                                    <input
                                        name="artist"
                                        onChange={(event) => onChangeEditableInput(event)}
                                        className="text-lg editable"
                                        disabled={!isEditMode}
                                        value={isEditMode ? updatedEntry.artist : currentImages[0].artist} />
                                    <input
                                        name="title"
                                        onChange={(event) => onChangeEditableInput(event)}
                                        className="text-lg editable"
                                        disabled={!isEditMode}
                                        value={isEditMode ? updatedEntry.title : currentImages[0].title} />
                                    <input
                                        name="technique"
                                        onChange={(event) => onChangeEditableInput(event)}
                                        className="text-lg editable"
                                        disabled={!isEditMode}
                                        value={updatedEntry.technique || currentImages[0].technique} />
                                    <input
                                        name="dimensions"
                                        onChange={(event) => onChangeEditableInput(event)}
                                        className="text-lg editable"
                                        disabled={!isEditMode}
                                        value={updatedEntry.dimensions || currentImages[0].dimensions} />
                                    <input
                                        name="price"
                                        onChange={(event) => onChangeEditableInput(event)}
                                        className="text-lg editable"
                                        disabled={!isEditMode}
                                        value={updatedEntry.price || currentImages[0].price} />

                                    <input
                                        name="notes"
                                        onChange={(event) => onChangeEditableInput(event)}
                                        className="text-lg editable"
                                        disabled={!isEditMode}
                                        value={updatedEntry.notes || currentImages[0].notes} />
                                </div>
                            ) : (
                                <>
                                    <p>
                                        {`${art.title ? art.title : "No title"} made with ${art.technique} with dimensions ${art.dimensions}
                              and price of ${art.price}EU`}
                                    </p>
                                    <p>
                                        {`Notes: ${art.notes}`}
                                    </p>
                                </>
                            )}
                            {isEditMode && currentImages.length && currentImages[0].id === art.id ? (
                                <CascadingDropdowns
                                    formControlData={formControlData}
                                    setFormControlData={setFormControlData} />
                            ) : (
                                <>
                                    <p>{`Located in: ${art.storageLocation} - ${art.cell} - ${art.position}`}</p>
                                </>
                            )}
                        </p>
                    </div>
                </div>
                </>
            ))}

        </div></>
}

export default ListView