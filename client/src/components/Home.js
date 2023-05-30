/* eslint-disable no-undef */
import React, {  useEffect, useState } from 'react'
import './App.css'
import IconsNavBar from './IconsNavBar'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Upload from './Upload'
import Gallery from './Gallery'

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const linkStyle = {
    textDecoration: "none",
    color: "white"
};

const Home = () => {

    let location = useLocation();

    const [activeTab, setActiveTab] = useState()

    let navigate = useNavigate();


    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    useEffect(() => {
        if (history) {
            switch (location) {
            case "/upload" : setActiveTab(<Upload/>)
                break;
            case "/gallery" : setActiveTab(<Gallery/>)
                break;
            }
        }
    },[])

    return <><div className="parent">
        <div className={`bg-black flex justify-between p-4`}>
            <Link to='/'><img className="logo" alt="logo" src={icons.logo} /></Link>
            <Link className="self-center"  to='/login' onClick={handleLogout} style={linkStyle}>Log out</Link>
        </div>
        <IconsNavBar />

        {activeTab}
    </div>
    </>
}

export default Home