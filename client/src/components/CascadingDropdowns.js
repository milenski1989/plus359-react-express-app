/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import { ImageContext } from './App';
import { locations, findAvailablePositions } from "./constants/constants";

function CascadingDropdowns({formControlData, setFormControlData, openInModal}) {

    const {setUpdatedEntry, currentImage} = useContext(ImageContext)

    const [location, setLocation] = useState('--Location--')
    const [cell, setCell] = useState('--Cell--')
    const [cells, setCells] = useState([])
    const [position, setPosition] = useState('--Position--')
    const [positions, setPositions] = useState([])

    const changeLocation = (event) => {
        const {value} = event.target
        if (value === '--Location--') return
        setLocation(event.target.value)
        setCells(locations.find(location => location.name === event.target.value).cells)

        setFormControlData((prevState) => ({
            ...prevState,
            storageLocation: value,
        })),
        setUpdatedEntry &&
        setUpdatedEntry((prevState) => ({
            ...prevState,
            storageLocation: value
        }))
    }

    const changeCell = async (event) => {
        const {value} = event.target
        if (value === '--Cell--') return
        setCell(value)
        if (!openInModal){
            const availablePositions =  await findAvailablePositions(value, location).then(data => data)
            setPositions(availablePositions)
        }
        setFormControlData((prevState) => ({
            ...prevState,
            cell: value,
        }));

        if (setUpdatedEntry) {
            setUpdatedEntry((prevState) => ({
                ...prevState,
                cell: value
            }))
        }  
    }

    const changePosition = (event) => {
        const {value} = event.target
        if (value === '--Position--') return
        setPosition(value)

        setFormControlData((prevState) => ({
            ...prevState,
            position: value,
        }));
        
        if (setUpdatedEntry) {
            setUpdatedEntry((prevState) => ({
                ...prevState,
                position: value
            }))
        }  
    }

    return (
        <div className="md:container md:mx-auto">
            {/* Locations*/}   
            <select
                className='mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                value={location || currentImage[0].storageLocation}
                onChange={changeLocation}>
                <option>--Location--</option>
                {locations.map(location => (
                    <option key={location.name}>{location.name}</option>
                ))}
            </select>
            
            {/*Cells*/}
            <select 
                className='mt-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                disabled={location === 'Sold'}
                value={cell || currentImage[0].cell} 
                onChange={changeCell}>
                <option>--Cell--</option>
                {location !== 'Sold' && cells.map(cell => (
                    <option key={cell.name}>{cell.name}</option>
                ))}
            </select>
            
            {/*Positions*/}
            {!openInModal &&
               <select
                   className='mt-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                   disabled={location === 'Sold'}
                   value={position || currentImage[0].position}
                   onChange={changePosition}>
                   <option>--Position--</option>
                   {positions.map(position => (
                       <option key={position}>{position}</option>
                   ))}
               </select>
            }
        </div>
    )
}

export default CascadingDropdowns
