/* eslint-disable no-undef */
import React from 'react'
import './App.css'
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import './Home.css'

const storages = [
    'Vasil Levski', 'Vasil Levski Folders', 'Charta', 'Lozenets',
    'South Park', 'Vasil Levski Rooms', 'Collect', 'Other'
]


const Home = () => {

    let navigate = useNavigate();

    const handleStorageSelect = (name) => {
        navigate(`/gallery/:${name}`)
    }

    return <>
        <Navbar/>
        <div className="folders">
            {storages.map(storage => (
                <div 
                    key={storage} 
                    className="folder"
                    onClick={() => handleStorageSelect(storage)}
                >
                    <div className="title">{storage}</div>
                </div>
            ))}
            
        </div>
    </>
}

export default Home