import { Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material"
import { useContext } from "react";
import ActionButton from "./ActionButton";
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
            <DialogContent sx={{padding: "2rem"}}>

            </DialogContent>
            <DialogActions sx={{marginBottom: "1rem"}}>
                <ActionButton
                    children="yes"
                    handleOnclick={() => hadleDeleteImageAndEntry(currentImage.download_key, currentImage.image_key, currentImage.id)}
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