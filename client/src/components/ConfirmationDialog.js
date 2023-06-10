import { Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material"
import { useContext } from "react";
import ActionButton from "./ActionButton";
import {ImageContext} from "./App";


const ConfirmationDialog = ({ deleteOne, isDeleteConfOpen, setIsDeleteConfOpen}) => {
    const {currentImages, setCurrentImages} = useContext(ImageContext)

    //handle delete thumbnail, original image and entry
    const handleDeleteOne = (originalName, filename, id) => {
        deleteOne(originalName, filename, id)
        setIsDeleteConfOpen(false)
    };

    const handleDeleteMultiple = () => {
        
        for (let image of currentImages) {
            deleteOne(image.download_key, image.image_key, image.id)
            setCurrentImages(prev => [...prev.filter(image => !image.id)])
        }
        setIsDeleteConfOpen(false)
    }

    return (
        <Dialog
            open={isDeleteConfOpen}
            onClose={() => setIsDeleteConfOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete the entry ?"}
            </DialogTitle>
            <DialogContent sx={{padding: "2rem"}}>

            </DialogContent>
            <DialogActions sx={{marginBottom: "1rem"}}>
                <ActionButton
                    children="yes"
                    handleOnclick={() => {
                        if (currentImages.length > 1) {
                            handleDeleteMultiple(currentImages[0].download_key, currentImages[0].image_key, currentImages[0].id)
                        } else {
                            handleDeleteOne(currentImages[0].download_key, currentImages[0].image_key, currentImages[0].id)
                        }
                    } 
                    }
                />
                <ActionButton
                    children="cancel"
                    handleOnclick={() => setIsDeleteConfOpen(false)}
                />
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog