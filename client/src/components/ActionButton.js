import { Button } from "@mui/material";

const ActionButton = ({children, handleOnclick, disabled}) => {

    return (
        <Button
            variant="contained"
            sx={{ width: "100px", marginTop: "0.75rem", boxShadow: 1, marginLeft: "auto", marginRight: "auto"}}
            children={children}
            onClick={handleOnclick}
            disabled={disabled} />
    );
};

export default ActionButton;