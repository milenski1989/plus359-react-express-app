/* eslint-disable no-undef */
import React, {  useEffect, useState } from 'react'
import './App.css'
import IconsNavBar from './IconsNavBar'
import { useHistory } from "react-router"
import { Link } from 'react-router-dom'
import Upload from './Upload'
import Gallery from './Gallery'
import Logout from './Logout'

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const Home = () => {

    const history = useHistory()

    const [activeTab, setActiveTab] = useState()

    useEffect(() => {
        if (history) {
            switch (history.location.pathname) {
            case "/upload" : setActiveTab(<Upload/>)
                break;
            case "/artworks" : setActiveTab(<Gallery/>)
                break;
            }
        }
    },[])

    return <><div className="parent">
        <div className="bar">
            <Link to='/'><img className="logo" alt="logo" src={icons.logo} /></Link>
            <Logout styles={{ top: '25px', right: '3px' }} />
        </div>
        <IconsNavBar />
        {activeTab}
    </div>
    </>
}

export default Home