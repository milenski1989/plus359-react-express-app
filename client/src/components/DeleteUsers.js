import { Box, Checkbox, CircularProgress, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Message from "./Message";
import CustomDialog from "./CustomDialog";
import axios from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLongPress } from "use-long-press";
import SelectAllIcon from '../components/assets/select-all.svg'
import UnselectAllIcon from '../components/assets/unselect-all.svg'
import './DeleteUsers.css'

function DeleteUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState({ error: false, message: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showCheckbox, setShowCheckbox] = useState(false);

    const bind = useLongPress(() => {
        if (!setShowCheckbox) return;
        setShowCheckbox(prev => !prev);
    }, {
        onStart: (event) => {
            event.preventDefault();
        }
    });

    const user = JSON.parse(localStorage.getItem("user"));

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

    console.log(selectedUsers)
    

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
            await axios.delete(`https://storage-management-app.vercel.app/auth/deleteUsers`, {
                params: { emails },
            });
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
            const res = await fetch(`https://storage-management-app.vercel.app/auth/all`);
            const data = await res.json();

            setUsers(data.data.filter((item) => item.id !== user.id));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError({ error: true, message: error.response.data });
        }
    };

    console.log(selectedUsers)

    return (
        <>
            {isLoading && <CircularProgress className="loader" color="primary" />}
            <div className="delete-users-buttons">
                {users.length && showCheckbox ?
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
                {users.map((user) => (
                    <div
                        {...bind()}
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
                        {showCheckbox && (
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
                        )}
                    </div>
                ))}
            </Box>
        </>
    );
}

export default DeleteUsers;
