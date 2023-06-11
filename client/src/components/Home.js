/* eslint-disable no-undef */
import React from 'react'
import './App.css'
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const storages = [
    'Vasil Levski', 'Vasil Levski Folders', 'Charta', 'Lozenets',
    'Bojurishte', 'Elin Pelin', 'Collect', 'Other'
]


const Home = () => {

    let navigate = useNavigate();


    const handleStorageSelect = (name) => {
        navigate(`/gallery/:${name}`)
    }

    return <>
        <Navbar/>
        <div className="grid grid-cols-4 gap-x-6 gap-y-6 max-sm:gap-y-1 max-sm:grid-cols-1 md:grid-cols-4 max-sm:p-0 p-20 mt-4 max-sm:mt-8">
            {storages.map(storage => (
                <div key={storage} 
                    onClick={() => handleStorageSelect(storage)} 
                    className="my-7 border border shadow-lg shadow-grey rounded-md cursor-pointer dark max-sm:mr-8 max-sm:ml-8 max-sm:mb-8 w-200px h-100px p-16 text-center">{storage}</div>
            ))}
            
        </div>
    </>
}

export default Home