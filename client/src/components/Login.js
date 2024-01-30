import { Alert, Box, Button, CircularProgress, Container, CssBaseline, Link, TextField } from "@mui/material"
import { useState } from "react"
import './App.css'
import Message from "./Message"
import { useNavigate } from "react-router-dom";
import  './Login.css'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

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
        const response = await fetch("https://app.plus359gallery.com/auth/login", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        const data = await response.json()

        if (response.status === 200) {
            const {id, userName, email, superUser, createdAt} = data
            myStorage.setItem('user', JSON.stringify({
                id, 
                userName, 
                email, 
                superUser, 
                createdAt
            }))
            setLoading(false)
            setLoginError({error: false, message: ''})
            navigate('/')
        } else {
            setLoginError({error: true, message: data.error})
            setLoading(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!validateEmail(email)) {
            setEmailError(true);
            return;
        }

        setLoading(true)
        handleLogin()
    }

    return <>
        <div className="md:container md:mx-auto">

            {<Message open={loginError.error} handleClose={() => setLoginError({error: false, message: ""})} message={loginError.message} severity="error"
            /> }
               
            { loading ? 
                <CircularProgress className="loader" color="primary" /> 
                : 
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
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
                
            
            
        </div>
    </>
}

export default Login