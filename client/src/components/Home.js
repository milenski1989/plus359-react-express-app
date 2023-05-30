/* eslint-disable no-undef */
import React, {  useEffect, useState } from 'react'
import './App.css'
import IconsNavBar from './IconsNavBar'
import { Link, useLocation } from 'react-router-dom'
import Upload from './Upload'
import Gallery from './Gallery'
import Logout from './Logout'

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const Home = () => {

    let location = useLocation();

    const [activeTab, setActiveTab] = useState()

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
        <div className="bar">
            <Link to='/'><img className="logo" alt="logo" src={icons.logo} /></Link>
            <div style={{position: 'absolute', top: '50%', transform:' translateY(-50%)', right: '20px'}}><Logout/></div>
        </div>
        <IconsNavBar />

        {activeTab}
    </div>
    </>
}

export default Home