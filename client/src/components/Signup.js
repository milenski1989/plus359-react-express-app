import { Button, TextField } from "@mui/material"
import { useState } from "react"
import './App.css'
import { ThreeDots } from "react-loader-spinner"
import Message from "./Message"

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState({error: false, message: ''})

    const handleSignup = async () => {
        const response = await fetch("https://app.plus359gallery.eu/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                userName: userName
            })
        })
        const data = await response.json();
        if (response.status === 200 || response.status === 201) {
            console.log(data)
            setLoading(false)
            setLoginError(null)
        } else {
            setLoginError({error: true, message: data.error})
            setLoading(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        handleSignup()
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

                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            type="text"
                            required
                            margin="normal"
                            onChange={event => setUserName(event.target.value)} />

                    </div><div className="loginButton">
                        <Button
                            className="actionButton loginButton"
                            children="Sign up"
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

export default Signup