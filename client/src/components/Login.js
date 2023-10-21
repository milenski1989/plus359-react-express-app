import { CircularProgress} from "@mui/material"
import { useState } from "react"
import './App.css'
import Message from "./Message"
import { useNavigate } from "react-router-dom";

// const linkStyle = {
//     textDecoration: "none",
//     color: "#6ec1e4",
//     display: "inline"
// };

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState({error: false, message: ''})

    let myStorage = window.localStorage

    let navigate = useNavigate();


    const handleLogin = async () => {
        const response = await fetch("http://localhost:5000/auth/login", {
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
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">*Email</label>
                                <div className="mt-2">
                                    <input onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" autoComplete="email" required 
                                        placeholder="example@email.com"
                                        className="placeholder-shown:border-gray-500block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 invalid:border-pink-500 invalid:text-pink-600
                                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm sm:leading-6" />

                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">*Password</label>
                                    <div className="text-sm">
                                        <a href="#" className="font-semibold text-main ">Forgot password?</a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" autoComplete="current-password" required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500   invalid:border-pink-500 invalid:text-pink-600
                                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={!email || !password} className={!email || !password ? "flex w-full justify-center rounded-md bg-white text-black px-3 py-1.5 text-sm leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "flex w-full justify-center rounded-md bg-main text-white px-3 py-1.5 text-sm leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"}>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
                
            
            
        </div>
    </>
}

export default Login