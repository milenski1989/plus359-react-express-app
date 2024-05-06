import { createContext, useState } from 'react';

const ImageContext = createContext();

const ImageProvider = ({ children }) => {
    const [currentImages, setCurrentImages] = useState([]);
    const [updatedEntry, setUpdatedEntry] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [imageHeight, setImageHeight] = useState(0);

    return (
        <ImageContext.Provider
            value={{
                currentImages,
                setCurrentImages,
                updatedEntry,
                setUpdatedEntry,
                isEditMode,
                setIsEditMode,
                isInfoModalOpen,
                setIsInfoModalOpen,
                imageHeight,
                setImageHeight,
            }}
        >
            {children}
        </ImageContext.Provider>
    );
};

export { ImageContext, ImageProvider };
