/* eslint-disable no-undef */
import React, {  useEffect, useState } from 'react'
import './App.css'
import IconsNavBar from './IconsNavBar'
import { useHistory } from "react-router"
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import Upload from './Upload'
import Search from './Search'
import Artworks from './Artworks'

const buttonStyle = {
    position: "absolute",
    top: "2rem",
    right: "2rem",
    color:"white"
}

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const Home = () => {

    const history = useHistory()

    const [activeTab] = useState()

    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        history.push("/login")
    }

    useEffect(() => {
        if (history) {
            switch (history.location.pathname) {
            case "/search" : setActiveTab(<Search/>)
                break
            case "/upload" : setActiveTab(<Upload/>)
                break;
            case "/artworks" : setActiveTab(<Artworks/>)
                break;
            }
        }
    },[])

    return <div className="parent">
        <div className="bar">
            <Link to='/'><img className="logo" alt="logo" src={icons.logo} /></Link> 
            <Button
                style={buttonStyle}
                className="actionButton logoutButton"
                children="Log out"
                onClick={handleLogout}
            />
        </div>
        <IconsNavBar/>
        {activeTab}
    </div>
}

export default Home