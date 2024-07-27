import { Box, Checkbox, CircularProgress, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Message from "../reusable/Message";
import CustomDialog from "../reusable/CustomDialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SelectAllIcon from '../assets/select-all.svg'
import UnselectAllIcon from '../assets/unselect-all.svg'
import './DeleteUsers.css'
import { deleteUser, getAllUsers } from "../../api/authService";
import { checkBoxHandler } from "../utils/helpers";

function DeleteUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState({ error: false, message: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        getUsers();
    }, []);

    const handleSelectAll = () => {
        if (users.length === selectedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers([
                ...selectedUsers,
                ...users.filter(user =>
                    !selectedUsers.some(
                        selectedUser => selectedUser.id === user.id
                    ))
            ]);
        }
    }

    const deleteUsers = async (users) => {
        const emails = users.map(user => user.email)
        setIsLoading(true);
        try {
            await deleteUser(emails)
            setIsDialogOpen(false);
            getUsers();
        } catch (error) {
            setError({ error: true, message: error.response.data.message });
            setIsLoading(false);
        }
    };

    const getUsers = async () => {
        setIsLoading(true);
        try {
            const response = await getAllUsers()
            
            setUsers(response.data.users.filter((item) => item.id !== user.id));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError({ error: true, message: error.response.data.message });
        }
    };

    return (
        <>
            {isLoading && <CircularProgress className="loader" color="primary" />}
            <div className="delete-users-buttons">
                {users.length ?
                    <img onClick={handleSelectAll} src={selectedUsers.length ? UnselectAllIcon : SelectAllIcon} className='icon' /> :
                    <></>
                }
                {selectedUsers.length ? 
                    <DeleteOutlineIcon
                        className="icon"
                        style={{ cursor: "pointer", height: '34px', width: '34px'}}
                        onClick={() => {
                            setIsDialogOpen(true);
                        }}
                    /> :
                    <></>
                }
            </div>
            <Message
                open={error.error}
                handleClose={() => setError({ error: false, message: "" })}
                message={error.message}
                severity="error"
            />

            {isDialogOpen && (
                <CustomDialog
                    openModal={isDialogOpen}
                    setOpenModal={() => setIsDialogOpen(true)}
                    title="Are you sure you want to delete this user?"
                    handleClickYes={async () => await deleteUsers(selectedUsers)}
                    handleClickNo={() => {
                        setSelectedUsers([]);
                        setIsDialogOpen(false);
                    }}
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                    style={{ padding: "0" }}
                />
            )}

            <Box
                component="section"
                className={
                    isSmallDevice ? "mobile-locations-container" : "locations-container"
                }
            >
                {!isLoading && !error ?
                    users.map((user) => (
                        <div
                            className={isSmallDevice ? "mobile-location-item" : "location-item"}
                            key={user.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingLeft: "25px",
                                position: "relative"
                            }}
                        >
                            <div style={{marginLeft: "1rem"}}>{user.email}</div>
                            <Checkbox
                                onChange={() => checkBoxHandler(selectedUsers, setSelectedUsers, users, user.id)}
                                checked={selectedUsers.some(
                                    (selectedUser) => selectedUser.id === user.id
                                )}
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "10%",
                                    transform: "translate(-50%, -50%)",
                                    color: "white",
                                    "&.Mui-checked": {
                                        color: "white",
                                    },
                                }}
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<CheckCircleOutlineIcon />}
                            />
                        </div>
                    )) :
                    <p className="no-data-container">No users found!</p>
                }
            </Box>
        </>
    );
}

export default DeleteUsers;
