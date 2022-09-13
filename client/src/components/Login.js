import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import './App.css'
import { ThreeDots } from "react-loader-spinner"
import Message from "./Message"

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState({error: false, message: ''})

    const history = useHistory()
    let myStorage = window.localStorage
    const location = useLocation()
    let { from } = location.state || { from: { pathname: '/' } }

    const handleLogin = async () => {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        const data = await response.json()
        console.log(data)
    
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
                {!loading ?
                    <><div className="loginField">
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            type="text"
                            required
                            onChange={event => setEmail(event.target.value)} />
                    </div><div className="loginField">
                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            required
                            margin="normal"
                            onChange={event => setPassword(event.target.value)} />
                        {/* <img src={EyeIcon} className="clickable" onClick={handlePasswordVisibility} /> */}

                    </div><div className="loginButton">
                        <Button
                            className="actionButton loginButton"
                            children="Log in"
                            variant="outlined"
                            onClick={handleSubmit} />
                    </div></> :
                    <div className="loader">
                        <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="#78FECF"
                            ariaLabel="three-dots-loading"
                            visible={true}
                        />
                    </div>
                } 
            </form>
        </div>
    </>
}

export default Login