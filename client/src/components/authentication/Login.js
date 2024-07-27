import { Alert, Box, Button, CircularProgress, Link, TextField } from "@mui/material";
import { useState } from "react";
import Message from "../reusable/Message";
import { useNavigate } from "react-router-dom";
import './Login.css';
import Typography from '@mui/material/Typography';
import Logo from '../assets/logo359 gallery-black.png';
import { loginUser } from "../../api/authService";

const inputFields = [
    { label: 'Email', name: 'email', type: 'email', placeholder: 'example@email.com' },
    { label: 'Password', name: 'password', type: 'password' }
];

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://plus359gallery.com" style={{ textDecoration: 'none', color: '#007bff' }}>
                +359 Gallery
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Login = () => {
    const [inputs, setInputs] = useState({
        email: '',
        password: '',
        confirmedPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState({ error: false, message: '' });

    let myStorage = window.localStorage;
    let navigate = useNavigate();

    const isEmailValid = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const emailError = inputs.email === '' ? 'Email is required!' : (!isEmailValid(inputs.email) ? 'Invalid email format!' : '');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    const handleLogin = async () => {
        const _email = inputs.email;
        const _password = inputs.password;
        setLoading(true);
        try {
            const response = await loginUser(_email, _password);
            const { id, userName, email, superUser, createdAt } = response.data.user;
            myStorage.setItem('user', JSON.stringify({
                id,
                userName,
                email,
                superUser,
                createdAt
            }));
            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoginError({ error: true, message: error.response.data.message });
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin();
    };

    return <>
        <Message 
            open={loginError.error} 
            handleClose={() => setLoginError({error: false, message: ""})} 
            message={loginError.message} 
            severity="error"
        />        
        { loading ? 
            <CircularProgress className="loader" color="primary" /> 
            : 
            <div className="login-container">
                <img className="login-logo" src={Logo} alt="logo" />
                <Box component="form" onSubmit={handleSubmit} className="textfields-container" sx={{ padding: 3, backgroundColor: 'white', boxShadow: 3, borderRadius: 2 }}>
                    {loginError.error && <Alert severity="error">{loginError.message}</Alert>}
                    {inputFields.map((field) => (
                        <div key={field.name}>
                            <TextField
                                label={field.label}
                                placeholder={field.placeholder}
                                type={field.type}
                                name={field.name}
                                value={inputs[field.name]}
                                onChange={handleChange}
                                error={!!(field.name === 'email' && emailError)}
                                fullWidth
                                margin="normal"
                            />
                            {field.name === 'email' && emailError && (
                                <Typography variant="body2" color="error">
                                    {emailError}
                                </Typography>
                            )}
                        </div>
                    ))}
                    <Button
                        sx={{ mt: 2 }}
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!inputs.email || !inputs.password || !!emailError}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign in'}
                    </Button>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </div>
        }
    </>
}

export default Login;
