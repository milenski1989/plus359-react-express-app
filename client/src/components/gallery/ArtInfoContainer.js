import React from 'react'
import './ArtInfoContainer.css'

const keysToMap = ['Artist', 'Title', 'Technique', 'Dimensions', 'Price', 'Notes'];

const ArtInfoContainer = ({art}) => {

    return <>
        <div className='art-info-container'>
            <div>
                {keysToMap.slice(1, keysToMap.length).map(key => (
                    <p key={key} className="art-info-item">
                        <span className='input-label'>{`${key}: `}</span>
                        {`${art[key.toLowerCase()] ? art[key.toLowerCase()] : `No ${key.toLowerCase()}`}`}
                    </p>
                ))}
            </div>     
            <p><span className='input-label'>Storage: </span>{`${art.storageLocation || art.location}`}</p>
            <p><span className='input-label'>Cell: </span>{art.cell}</p> 
            <p><span className='input-label'>Position: </span>{art.position}</p>
        </div>
    </>
   
}

export default ArtInfoContainer