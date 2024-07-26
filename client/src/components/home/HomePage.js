import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './HomePage.css'
import Message from '../reusable/Message';
import { getAllStorages } from '../../api/storageService';

const HomePage = () => {

    const [storages, setStorages] = useState([])
    const [error, setError] = useState({ error: false, message: "" })

    let navigate = useNavigate();

    useEffect(() => {
        getStorages()
    },[])

    const getStorages = async () => {
        try {
            const response = await getAllStorages()
            setStorages(response.data);
        } catch (error) {
            throw new Error(error)
        }
    }

    const handleStorageSelect = (name) => {
        navigate(`/gallery/:${name}`)
    }
  
    return <>
        <Message
            open={error.error}
            handleClose={() => setError({ error: false, message: "" })}
            message={error.message}
            severity="error" />
        <div className="locations-container">
            <div className='location' onClick={() => handleStorageSelect('All')}>
                All
            </div>
            {storages.map(storage => (
                <div key={storage.id} className='location'>
                    <div onClick={() => handleStorageSelect(storage.name)}>
                        {storage.name}
                    </div>
                </div>
            ))} 
        </div>
    </>  
}

export default HomePage