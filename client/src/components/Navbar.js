import { Link, useNavigate, useLocation } from "react-router-dom"
import './NavBar.css'
import { useMediaQuery } from "@mui/material";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Logo from '../components/assets/logo359 gallery-white.png'

const Navbar = () => {

    let navigate = useNavigate();
    const {pathname} = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'))
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    },[isOpen])

    const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    return  <>
        {isSmallDevice ?
            <nav className="mobile-navbar">
                <Link to='/'><img className="mobile-logo" alt="logo" src={Logo}/></Link>   
                <p className="mobile-current-location">{pathname === '/admin-panel' ||  pathname === '/storages-management' ? '' : pathname.slice(10).replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1')}</p>
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                    className="mobile-navbar-button"
                >
                    {isOpen ? (
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>
                <div className={isOpen ? "mobile-navlinks active overlay" : "mobile-navlinks"}>
                    <Link to='/' 
                        className="mobile-nav-link"
                    >Home</Link>
                    <Link to='/upload'
                        className="mobile-nav-link"
                    >Upload</Link>
                    <Link to='/account'
                        className="mobile-nav-link"
                    >Account</Link>
                    {user.superUser &&
                        <Link to='/admin-panel'
                            className="mobile-nav-link"
                        >Admin Panel</Link>
                    }
                    <Link to='/login'
                        onClick={handleLogout}
                        className="mobile-nav-link"
                    >Log Out</Link> 
                </div>
               
            </nav> 
            :
            <nav className="navbar">
                <div className="navbar-elements-container">
                    <Link to='/'><img className="logo" alt="logo" src={Logo}/></Link>
                    <p className="current-location">{pathname === '/admin-panel' ||  pathname === '/storages-management' ? '' : pathname.slice(10).replace(/%20/g, ' ').replace(/([A-Z])/g, ' $1')}</p>
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
                        {user.superUser &&
                        <Link to='/admin-panel'
                            className="nav-link"
                        >Admin Panel</Link>
                        }
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