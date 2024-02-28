/* eslint-disable no-undef */
import { Link, useNavigate, useLocation } from "react-router-dom"
import './NavBar.css'

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const Navbar = () => {

    let navigate = useNavigate();
    const {pathname} = useLocation();

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    return  <>
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
    </>
}

export default Navbar