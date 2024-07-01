import React from 'react'
import { useOutletContext } from 'react-router-dom';
import Thumnbail from './Thumbnail'


const Thumbnails = () => {

    const {searchResults} = useOutletContext()
    
    return <>
        {searchResults && searchResults.map((art, id) => (
            <Thumnbail key={id} art={art} />
        ))}
    </>   
}

export default Thumbnails