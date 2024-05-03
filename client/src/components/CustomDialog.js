import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

function CustomDialog({children, openModal, setOpenModal, title, handleClickYes, handleClickNo, confirmButtonText, cancelButtonText, disabledConfirmButton, style}) {
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
            <DialogContent  sx={{padding: "2rem", ...style}}>
                {children}
            </DialogContent>

            <DialogActions sx={{marginBottom: "1rem"}}>
                {confirmButtonText ? 
                    <Button
                        variant="contained"
                        sx={{backgroundColor: '#6ec1e4', width: "100px", marginTop: "0.75rem", boxShadow: 1, marginLeft: "auto", marginRight: "auto"}}
                        children={confirmButtonText}          
                        onClick={handleClickYes}
                        disabled={disabledConfirmButton}
                    /> :
                    <></>
                }
             

                <Button
                    variant="contained"
                    sx={{backgroundColor: '#6ec1e4', width: "100px", marginTop: "0.75rem", boxShadow: 1, marginLeft: "auto", marginRight: "auto"}}
                    children={cancelButtonText}           
                    onClick={handleClickNo}
                />
            </DialogActions>
        </Dialog>
    )
}

export default CustomDialog