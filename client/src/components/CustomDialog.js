import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import ActionButton from './ActionButton'

function CustomDialog({children, openModal, setOpenModal, title, handleClickYes, handleClickNo}) {
    return (
        <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent sx={{padding: "2rem"}}>
                {children}
            </DialogContent>
            <DialogActions sx={{marginBottom: "1rem"}}>
                <ActionButton
                    children="yes"
                    handleOnclick={handleClickYes}
                />
                <ActionButton
                    children="cancel"
                    handleOnclick={handleClickNo}
                />
            </DialogActions>
        </Dialog>
    )
}

export default CustomDialog