import { Box, Checkbox, CircularProgress, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Message from "./Message";
import CustomDialog from "./CustomDialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SelectAllIcon from '../components/assets/select-all.svg'
import UnselectAllIcon from '../components/assets/unselect-all.svg'
import './DeleteUsers.css'
import { deleteUser, getAllUsers } from "../api/authService";
import { useOutletContext } from "react-router-dom";

function DeleteUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState({ error: false, message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    const {isDeleteDialogOpen, setIsDeleteDialogOpen} = useOutletContext()

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    useEffect(() => {
        getUsers();
    }, []);

    const checkBoxHandler = (id) => {
        if (selectedUsers.some((user) => user.id === id)) {
            setSelectedUsers(selectedUsers.filter((user) => user.id !== id));
        } else {
            setSelectedUsers([...selectedUsers, users.find((user) => user.id === id)]);
        }
    };

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
            isDeleteDialogOpen(false);
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
                            setIsDeleteDialogOpen(true);
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

            {isDeleteDialogOpen && (
                <CustomDialog
                    openModal={isDeleteDialogOpen}
                    setOpenModal={() => setIsDeleteDialogOpen(true)}
                    title="Are you sure you want to delete this user?"
                    handleClickYes={async () => await deleteUsers(selectedUsers)}
                    handleClickNo={() => {
                        setSelectedUsers([]);
                        setIsDeleteDialogOpen(false);
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
                {users.map((user) => (
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
                            onChange={() => checkBoxHandler(user.id)}
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
                ))}
            </Box>
        </>
    );
}

export default DeleteUsers;
