/* eslint-disable no-undef */
import React from 'react'
import './App.css'
import Navbar from "./Navbar";
import './Home.css'
import LocationsContainer from './LocationsContainer';

const Home = () => {
    return <>
        <Navbar/>
        <LocationsContainer/>
    </>
}

export default Home