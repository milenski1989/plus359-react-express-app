import { Alert, Snackbar } from "@mui/material"


const Message = ({ open, handleClose, message, severity }) => {

    return <>
        <Snackbar open={open} autoHideDuration={2500} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    </>
}

export default Message