import { saveAs } from "file-saver";


export const generateBackGroundColor = (cell) => {
    if (!cell) return
    if (cell === "1-1" || cell === "charta1" || cell === "lozenets1" || cell === "other1" || cell === "collect1" || cell === "South Park1" || cell ==="Office Room") {
        return "#EAC435"
    } else if (cell === "1-2" || cell === "charta2" || cell === "lozenets2" || cell === "other2" || cell === "collect2" || cell === "South Park2" || cell === "Old Artists Room") {
        return "#345995"
    } else if (cell === "1-3" || cell === "charta3" || cell === "lozenets3" || cell === "other3" || cell === "collect3" || cell === "South Park3" || cell === "Modern Art") {
        return "#E40066"
    } else if (cell === "1-4" || cell === "charta4" || cell === "lozenets4" || cell === "other4" || cell === "collect4" || cell === "South Park4" || cell === "Carpet Room") {
        return "#03CEA4"
    } else if (cell === "2-1" || cell === "other5" || cell === "Books Room") {
        return "#FB4D3D"
    } else if (cell === "2-2" || cell === "other6" || cell === "Black Room") {
        return "#84DCC6"
    } else if (cell === "2-3" || cell === "Foyer") {
        return "#A5FFD6"
    } else if (cell === "2-4") {
        return "#C98CA7"
    } else if (cell === "3-1") {
        return "#E8FCC2"
    } else if (cell === "3-2") {
        return "#D63230"
    } else if (cell === "3-3") {
        return "#CFD186"
    } else if (cell === "3-4") {
        return "#8B5FBF"
    }  
}

export const downloadOriginalImage = (currentImages) => {
    for (let currentImage of currentImages) {
        saveAs(currentImage.download_url, currentImage.download_key);
    }
};

export const prepareImagesForLocationChange = async (handleIsLocationChangeDialogOpen) => {
    handleIsLocationChangeDialogOpen(true)
}

export const checkBoxHandler = (selectedItems, setSelectedItems, items, id) => {
    if (selectedItems.some(selectedItem => selectedItem.id === id)) {
        setSelectedItems(selectedItems.filter(image => image.id !== id));
    } else {
        setSelectedItems([...selectedItems, items.find(image => image.id === id)]);
    }
}

export const handleEdit = (art, setCurrentImages, navigate) => {
    setCurrentImages([art]);
    localStorage.setItem('currentImage', JSON.stringify(art));
    navigate('/edit-page')
};
