import { Button, CircularProgress, TextField } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import './App.css'
import Message from "./Message"
import './Signup.css'

const linkStyle = {
    textDecoration: "none",
    color: "blue",
};

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(false)
    const [signupError, setSignupError] = useState({error: false, message: ''})
    const [inputTouched, setInputTouched] = useState(false)
    const [signupSuccess, setSignupSuccess] = useState({success: false, message: ''})

    const handleSignup = async () => {
        const response = await fetch("http://localhost:5000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                userName
            })
        })
        const data = await response
        console.log(data)
        if (response.status === 200 || response.status === 201) {
            setLoading(false)
            setSignupSuccess({success: true, message: data.message})
        } else {
            setSignupError({error: true, message: data.error})
            setLoading(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        handleSignup()
    }

    return(<>
        {<Message open={signupError.error} handleClose={() => setSignupError({error: false, message: ""})} message={signupError.message} severity="error"
        /> }
        {<Message open={signupSuccess.success} handleClose={() => setSignupSuccess(false)} message={signupSuccess.message} severity="success"
        /> }

        <div className="signupSection">
            <form className="signupForm">
                {!loading ?
                    <><div className="loginField">
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            onBlur={() => setInputTouched(true)}
                            error={inputTouched && !email}
                            type="text"
                            required
                            onChange={event => setEmail(event.target.value)} />
                    </div><div className="loginField">
                        <TextField
                            sx={{marginTop: "1rem"}}
                            id="password"
                            label="Password"
                            variant="outlined"
                            type="text"
                            required
                            onBlur={() => setInputTouched(true)}
                            error={inputTouched && !password}
                            onChange={event => setPassword(event.target.value)} />
                        <div className="loginField">
                            <TextField
                                sx={{marginTop: "1rem"}}
                                id="username"
                                label="Username"
                                variant="outlined"
                                type="text"
                                onChange={event => setUserName(event.target.value)} />
                        </div>

                    </div><div className="signupButton">
                        <Button
                            children="Sign up"
                            variant="outlined"
                            onClick={handleSubmit}
                            disabled={!email || !password} />
                    </div>
                    <div className="loginSignupTextContainer">
                        Have an account? Go back to <Link to='/login' style={linkStyle}>login</Link>
                    </div>
                    </> :
                    <CircularProgress className="loader" color="primary" />
                } 
            </form>
        </div>
    </>)
}

export default Signup