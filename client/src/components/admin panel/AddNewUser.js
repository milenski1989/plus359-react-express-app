import React, { useState } from 'react';
import Message from '../reusable/Message';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { signupUser } from '../../api/authService';
import './AddNewUser.css'; // Import the CSS file

function AddNewUser() {
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
        confirmedPassword: '',
        userName: ''
    });
    const [loading, setLoading] = useState(false);
    const [signupError, setSignupError] = useState({ error: false, message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const isEmailValid = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const isPasswordMatched = (password, confirmedPassword) => {
        return password === confirmedPassword;
    };

    const handleSignupUser = async () => {
        setLoading(true);

        const data = {
            email: inputs.email,
            password: inputs.password,
            userName: inputs.userName
        };

        try {
            await signupUser(data);
            setLoading(false);
            setInputs({
                email: '',
                password: '',
                confirmedPassword: '',
                userName: ''
            });
        } catch (error) {
            setLoading(false);
            console.log(error);
            setSignupError({ error: true, message: error.response.data.message });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSignupUser();
    };

    const inputFields = [
        { label: 'Email', name: 'email', type: 'email', placeholder: 'example@email.com' },
        { label: 'User Name', name: 'userName', type: 'text' },
        { label: 'Password', name: 'password', type: 'password' },
        { label: 'Confirm Password', name: 'confirmedPassword', type: 'password' }
    ];

    const emailError = inputs.email === '' ? 'Email is required!' : (!isEmailValid(inputs.email) ? 'Invalid email format!' : '');
    const passwordError = !isPasswordMatched(inputs.password, inputs.confirmedPassword) ? 'Passwords do not match!' : '';

    return (
        <>
            <Message
                open={signupError.error}
                handleClose={() => setSignupError({ error: false, message: '' })}
                message={signupError.message}
                severity="error"
            />
            {loading ? (
                <CircularProgress variant="determinate" className="loader" color="primary" />
            ) : (
                <Box component="section" className="section-container">
                    {inputFields.map((field) => (
                        <>
                            <TextField
                                key={field.name}
                                label={field.label}
                                placeholder={field.placeholder}
                                type={field.type}
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleChange}
                                error={!!(field.name === 'email' && emailError) || !!(field.name === 'confirmedPassword' && passwordError)}
                            />
                            {field.name === 'email' && emailError && (
                                <Typography variant="body2" color="error">
                                    {emailError}
                                </Typography>
                            )}
                            {field.name === 'confirmedPassword' && passwordError && (
                                <Typography variant="body2" color="error">
                                    {passwordError}
                                </Typography>
                            )}
                        </>
                    ))}
                    <Button
                        onClick={handleSubmit}
                        disabled={!inputs.email || !inputs.password || !inputs.confirmedPassword || !!emailError || !!passwordError}
                        sx={{ mt: 2 }}
                        type="submit"
                        variant="contained"
                    >
                        Create
                    </Button>
                </Box>
            )}
        </>
    );
}

export default AddNewUser;
