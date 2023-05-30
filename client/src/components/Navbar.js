import { Link, useNavigate } from "react-router-dom"
import './NavBar.css'
import './App.css'
import { useState } from "react";

const linkStyle = {
    textDecoration: "none",
    color: "white",
    marginBottom: '0.5rem'
};

const Navbar = () => {

    let navigate = useNavigate();


    const [isOpen, setIsOpen] = useState(false);


    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    return  <>

        <div className="lg:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400 relative top-0 right-0"
            >
                <svg
                    className={`fill-current h-6 w-6 ${isOpen ? "hidden" : "block"}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
                <svg
                    className={`fill-current h-6 w-6 ${isOpen ? "block" : "hidden"}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                </svg>
            </button>
        </div>

        <div className={`bg-black lg:flex lg:justify-around lg:p-4 ${isOpen ? "max-sm:flex max-sm:flex-col max-sm:items-center max-sm:p-3" : "max-sm:hidden"}`}
        >
            <Link to='/' style={linkStyle}>Home</Link>
            <Link to='/upload' style={linkStyle}>Upload</Link>
            <Link to='/gallery' style={linkStyle}>Gallery</Link>
            <Link to='/account' style={linkStyle}>Account</Link>
            <Link to='/login' onClick={handleLogout} style={linkStyle}>Log out</Link>
        </div>
        
    </>
}

export default Navbar