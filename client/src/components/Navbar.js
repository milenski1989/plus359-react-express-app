/* eslint-disable no-undef */
import { Link, useNavigate, useLocation } from "react-router-dom"
import './App.css'
import { useState, useEffect } from "react";

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const Navbar = () => {

    let navigate = useNavigate();

    const {pathname} = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [ pathname ]);

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    return  <>
        <nav className="bg-black border-gray-200 dark">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to='/'><img className="max-sm:w-16 w-20" alt="logo" src={icons.logo} /></Link>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden" aria-controls="navbar-default" aria-expanded="false">
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
                <div className={`${!isOpen && "max-sm:hidden"} w-full md:block md:w-auto`} id="navbar-default">
                    <div className="font-medium flex flex-col justify-between max-sm:content-around p-4 md:p-0 mt-4 lg:flex-row md:space-x-8 md:mt-0 md:border-0">
                        <Link to='/' 
                            className="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                        >Home</Link>
                        <Link to='/upload'
                            className="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                        >Upload</Link>
                        <Link to='/account'
                            className="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                        >Account</Link>
                        <Link to='/login'
                            onClick={handleLogout}
                            className="max-sm:justify-self-end block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                        >Log Out</Link>
                    </div>
                </div>
            </div>
        </nav> 
    </>
}

export default Navbar