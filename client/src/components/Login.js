import { Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react"
import './App.css'
import Message from "./Message"
import { Link,  useHistory, useLocation } from "react-router-dom";

const linkStyle = {
    textDecoration: "none",
    color: "blue",
    display: "inline"
};

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState({error: false, message: ''})
    const [inputTouched, setInputTouched] = useState(false)
    const [viewPassword, setViewPassword] = useState(false)

    const history = useHistory()
    let myStorage = window.localStorage
    const location = useLocation()
    let { from } = location.state || { from: { pathname: '/' } }

    const handleLogin = async () => {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        const data = await response.json()

        if (response.status === 200) {
            console.log(data)
            myStorage.setItem('user', JSON.stringify({username: data.username, email : data.email, isSuperUser: data.isSuperUser}))
            setLoading(false)
            setLoginError({error: false, message: ''})
            history.replace(from)
        } else {
            setLoginError({error: true, message: data.error})
            setLoading(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        handleLogin()
    }

    const handleViewPassword = () => {
        setViewPassword(!viewPassword)
    }

    return <>
        {<Message open={loginError.error} handleClose={() => setLoginError({error: false, message: ""})} message={loginError.message} severity="error"
        /> }
        <div className="mainSection">
            <form className="loginSection">
                { loading ? 
                    <CircularProgress className="loader" color="primary" /> 
                    : 
                    <>
                        <div className="loginField">
                            <TextField
                                id="email"
                                label="Email"
                                required
                                variant="outlined"
                                margin="normal"
                                onBlur={() => setInputTouched(true)}
                                error={inputTouched && !email}
                                onChange={event => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="loginField">
                            <FormControl sx={{width: '210.400px', marginTop: "0.5rem" }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={viewPassword ? 'text' : 'password'}
                                    value={password}
                                    onBlur={() => setInputTouched(true)}
                                    error={inputTouched && !password}
                                    onChange={event => setPassword(event.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleViewPassword}
                                               
                                                edge="end"
                                            >
                                                {viewPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password" />
                            
                            </FormControl>
                        </div>
                        <div className="loginButton">
                            <Button
                                className="actionButton loginButton"
                                children="Log in"
                                variant="outlined"
                                onClick={handleSubmit}
                                disabled={!email || !password} />
                        </div>

                        <div className="loginSignupTextContainer">
                            Not registered yet? Go to <Link to='/signup' style={linkStyle}>signup</Link>
                        </div>
                    </>
                }
                
            </form>
        </div>
    </>
}

export default Login