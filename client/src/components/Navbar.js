/* eslint-disable no-undef */
import { Link, useNavigate, useLocation } from "react-router-dom"
import './NavBar.css'
import { useMediaQuery } from "@mui/material";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useState } from "react";

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const Navbar = () => {

    let navigate = useNavigate();
    const {pathname} = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    return  <>
        {isSmallDevice ?
            <nav className="mobile-navbar-container">
                <Link to='/'><img className="mobile-logo" alt="logo" src={icons.logo}/></Link>   
                <div className={isOpen ? "mobile-nav-links-container" : "hidden"}>
                    <Link to='/' 
                        className="mobile-nav-link"
                    >Home</Link>
                    <Link to='/upload'
                        className="mobile-nav-link"
                    >Upload</Link>
                    <Link to='/account'
                        className="mobile-nav-link"
                    >Account</Link>
                    <Link to='/login'
                        onClick={handleLogout}
                        className="mobile-nav-link"
                    >Log Out</Link>
                </div>
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="navbar-button"
                    >
                        {isOpen ? (
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </nav> 
            :
            <nav className="navbar">
                <div className="navbar-elements-container">
                    <Link to='/'><img className="logo" alt="logo" src={icons.logo}/></Link>
                    <p className="current-location">{pathname.slice(10).replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1')}</p>
                    <div className="right-side">
                        <Link to='/' 
                            className="nav-link"
                        >Home</Link>
                        <Link to='/upload'
                            className="nav-link"
                        >Upload</Link>
                        <Link to='/account'
                            className="nav-link"
                        >Account</Link>
                        <Link to='/login'
                            onClick={handleLogout}
                            className="nav-link"
                        >Log Out</Link>
                    </div>
                </div>
            </nav>
        } 
    </>
}

export default Navbar