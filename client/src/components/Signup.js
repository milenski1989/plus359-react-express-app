import { CircularProgress } from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import './App.css'
import Message from "./Message"
import './Signup.css'

const linkStyle = {
    textDecoration: "none",
    color: "#6ec1e4",
};

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState(false)
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(false)
    const [signupError, setSignupError] = useState({error: false, message: ''})
    const [signupSuccess, setSignupSuccess] = useState({success: false, message: ''})

    const handleSignup = async () => {
        const res = await fetch("https://features.ddq4m4fgykx7y.amplifyapp.com/auth/signup", {
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
        const data = await res.json()
        if (res.status === 200 || res.status === 201) {
            console.log(data)
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

    const checkPasswordMatch = (e) => {
        if (e.target.value === password) setConfirmedPassword(true)
        else setConfirmedPassword(false)
    }

    return(
        <div className="md:container md:mx-auto">
            <Message 
                open={signupError.error} 
                handleClose={() => setSignupError({error: false, message: ""})} 
                message={signupError.message} 
                severity="error"
            />
            
            <Message 
                open={signupSuccess.success} 
                handleClose={() => setSignupSuccess(false)} 
                message={signupSuccess.message} 
                severity="success"
            />

            {loading ? 
                <CircularProgress className="loader" color="primary" /> 
                : 

                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">*Email</label>
                                <div className="mt-2">
                                    <input onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" autoComplete="email" required 
                                        placeholder="example@email.com"
                                        className="placeholder-shown:border-gray-500block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">*Password</label>
                                </div>
                                <div className="mt-2">
                                    <input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" autoComplete="current-password" required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500   invalid:border-pink-500 invalid:text-pink-600
                                     focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm sm:leading-6"/>
                                   
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">*Confirm Password</label>
                                </div>
                                <div className="mt-2">
                                    <input onChange={checkPasswordMatch} name="password" type="password" autoComplete="current-password" 
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500   invalid:border-pink-500 invalid:text-pink-600
                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm sm:leading-6"                                      />
                                    {!confirmedPassword && password &&
                                      <p className="text-red-400">
                                          Passwords do not match
                                      </p>
                                    }
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">*User name</label>
                                </div>
                                <div className="mt-2">
                                    <input onChange={(e) => setUserName(e.target.value)} id="username" name="username" type="text" autoComplete="username" required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500   invalid:border-pink-500 invalid:text-pink-600
                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={!email || !password || !userName} className={!email || !password || !userName ? "flex w-full bg-white justify-center rounded-md px-3 py-1.5 text-sm leading-6 text-grey shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" : "flex w-full bg-main justify-center rounded-md px-3 py-1.5 text-sm leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"}>Sign up</button>
                            </div>
                        </form>

                        <div className="mt-10 text-center text-sm text-gray-500">
                        Have an account? Go back to <Link to='/login' style={linkStyle}>login</Link>
                        </div>
                    </div>
                </div>}


        </div>)
}

export default Signup