import React, { useState } from 'react'
import Message from './Message'
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import { signupUser } from '../api/authService';

function AddNewUser() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState(false)
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(false)
    const [signupError, setSignupError] = useState({error: false, message: ''})

    const handleSignupUser = async () => {
        setLoading(true);
    
        const data = {
            email,
            password,
            userName
        };

        try {
            await signupUser(data);
            setLoading(false);
            setEmail("");
            setUserName("");
            setPassword("");
            setConfirmedPassword(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
            setSignupError({ error: true, message: error.response.data.message });
        }
    };
    

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        handleSignupUser()
    }

    const checkPasswordMatch = (e) => {
        if (e.target.value === password) setConfirmedPassword(true)
        else setConfirmedPassword(false)
    }

    return  <>
        <Message
            open={signupError.error}
            handleClose={() => setSignupError({ error: false, message: "" })}
            message={signupError.message}
            severity="error" />
        {loading ? 
            <CircularProgress variant="determinate" className="loader" color="primary" />
            : 
            <Box
                component="section"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: '3rem auto',
                    marginTop: '4rem',
                    width: "60vw",
                }}
            >
                <TextField
                    label="Email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <TextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    label="Confirm Password"
                    onChange={checkPasswordMatch}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500   invalid:border-pink-500 invalid:text-pink-600
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm sm:leading-6"
                />
                {!confirmedPassword && password &&
                              <p className="text-red-400">
                                  Passwords do not match
                              </p>
                }
  
                <Button 
                    onClick={handleSubmit}
                    disabled={!email || !password || !confirmedPassword}
                    sx={{mt: 2}}
                    type="submit"
                    variant="contained"
                >
            Create
                </Button>
            </Box>
        }
    </>
}

export default AddNewUser