import { Button, CircularProgress, TextField } from "@mui/material"
import { useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import './App.css'
import Message from "./Message"

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState({error: false, message: ''})
    const [inputTouched, setInputTouched] = useState(false)

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
            myStorage.setItem('username', data.username)
            setLoading(false)
            setLoginError(null)
            history.replace(from)
        } else {
            setLoginError({error: true, message: data.message})
            setLoading(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        handleLogin()
    }

    return <>
        {<Message open={loginError.error} handleClose={() => setLoginError({error: false, message: ""})} message={loginError.message} severity="error"
        /> }
        <div className="parent">
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
                            <TextField
                                id="password"
                                label="Password"
                                variant="outlined"
                                type="password"
                                required
                                margin="normal"
                                onBlur={() => setInputTouched(true)}
                                error={inputTouched && !password}
                                onChange={event => setPassword(event.target.value)} />
                        </div>
                        <div className="loginButton">
                            <Button
                                className="actionButton loginButton"
                                children="Log in"
                                variant="outlined"
                                onClick={handleSubmit} />
                        </div>
                    </>
                }

            </form>
        </div>
    </>
}

export default Login