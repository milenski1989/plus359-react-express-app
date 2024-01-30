/* eslint-disable no-undef */
import { Link, useNavigate, useLocation } from "react-router-dom"
import './NavBar.css'
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
        <nav className="navbar bg-black border-gray-200">
            <div className="max-w-screen-xl flex max-sm:flex-wrap items-center justify-between mx-auto p-4">
                <Link to='/'><img className="max-sm:w-16 w-20 mr-4" alt="logo" src={icons.logo} /></Link>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    data-collapse-toggle="navbar-default" type="button" className="inline-flex text-white items-center p-2 ml-3 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 lg:hidden" aria-controls="navbar-default" aria-expanded="false">
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
                <div className={`${!isOpen && "max-sm:hidden"} w-full`} id="navbar-default">
                    <div className="font-medium flex flex-col justify-between max-sm:content-around p-4 md:p-0 mt-4 lg:flex-row md:space-x-8 md:mt-0 md:border-0">
                        <Link to='/' 
                            className="block py-2 pl-3 pr-4 rounded text-[#40C8F4]"
                        >Home</Link>
                        <Link to='/upload'
                            className="block py-2 pl-3 pr-4 rounded text-[#40C8F4]"
                        >Upload</Link>
                        <Link to='/account'
                            className="block py-2 pl-3 pr-4 rounded text-[#40C8F4]"
                        >Account</Link>
                        <Link to='/login'
                            onClick={handleLogout}
                            className="block py-2 pl-3 pr-4 rounded text-[#40C8F4]"
                        >Log Out</Link>
                    </div>
                </div>
            </div>
        </nav> 
    </>
}

export default Navbar