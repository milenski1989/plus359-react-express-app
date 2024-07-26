import { createContext, useState } from 'react';

const ImageContext = createContext();

const ImageProvider = ({ children }) => {
    const [currentImages, setCurrentImages] = useState([]);
    const [updatedEntry, setUpdatedEntry] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [page, setPage] = useState(1)
    return (
        <ImageContext.Provider
            value={{
                currentImages,
                setCurrentImages,
                updatedEntry,
                setUpdatedEntry,
                isEditMode,
                setIsEditMode,
                page,
                setPage
            }}
        >
            {children}
        </ImageContext.Provider>
    );
};

export { ImageContext, ImageProvider };
