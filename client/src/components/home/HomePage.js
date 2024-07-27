import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './HomePage.css'
import Message from '../reusable/Message';
import { getAllStorages } from '../../api/storageService';

const HomePage = () => {

    const [storages, setStorages] = useState([])
    const [error, setError] = useState({ error: false, message: "" })
    const [isLoading, setIsLoading] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {
        getStorages()
    },[])

    const getStorages = async () => {
        setIsLoading(true);
        try {
            const response = await getAllStorages()
            setStorages(response.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError({ error: true, message: error.response.data.message });
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
        {!isLoading && !error.error ?
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
            </div> :
            <p className="no-data-container">No storages found!</p>
        }
    </>  
}

export default HomePage