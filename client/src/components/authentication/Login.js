import { Alert, Box, Button, CircularProgress, Container, CssBaseline, Link, TextField } from "@mui/material"
import { useState } from "react"
import Message from "../reusable/Message"
import { useNavigate } from "react-router-dom";
import  './Login.css'
import Typography from '@mui/material/Typography';
import Logo from '../assets/logo359 gallery-black.png'
import { loginUser } from "../../api/authService";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://plus359gallery.com" style={{textDecoration: 'none', color: '#007bff'}}>
          +359 Gallery
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState({error: false, message: ''})
    const [emailError, setEmailError] = useState(false);

    let myStorage = window.localStorage
    let navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleLogin = async () => {
        const _email = email
        const _password = password
        setLoading(true);
        try {
            const response = await loginUser(_email, _password)
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
        event.preventDefault()
        if (!validateEmail(email)) {
            setEmailError(true);
            return;
        }
        handleLogin()
    }

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
            <Container
                sx={{
                    '& .MuiContainer-root': {
                        width: '100%'
                    }
                }}
                component="main">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img className="login-logo" src={Logo} />
                    <Typography component="h1" variant="h5">
                          Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {loginError.error && <Alert severity="error">{loginError.message}</Alert>}
                        <TextField
                            fullWidth
                            label="email@example.com"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError(false);
                            }}
                            required
                            error={emailError}
                            helperText={emailError ? 'Invalid email format' : ''}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            sx={{mt: 2}}
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={!email || !password || loading || emailError}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign in'}
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>

               
        }
    </>
}

export default Login