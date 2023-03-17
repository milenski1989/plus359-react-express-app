import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from "@mui/material"
import { useContext } from "react";
import {ImageContext} from "./App";


const ConfirmationDialog = ({deleteImageAndEntry, isDeleteConfOpen, setIsDeleteConfOpen}) => {
    const {currentImage, setIsInfoModalOpen} = useContext(ImageContext)

    //handle delete thumbnail, original image and entry
    const hadleDeleteImageAndEntry = (originalName, filename, id) => {
        deleteImageAndEntry(originalName, filename, id)
        setIsDeleteConfOpen(false)
        setIsInfoModalOpen(false)
    };

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
            <DialogContent>

            </DialogContent>
            <DialogActions>
                <Button onClick={() => hadleDeleteImageAndEntry(currentImage.download_key, currentImage.image_key, currentImage.id)}>Yes</Button>
                <Button onClick={() => setIsDeleteConfOpen(false)} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog