import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { locations, cellsData, createDropdownOptions } from "./constants/constants";

function LocationsDropdowns({formControlData, setFormControlData, inputTouched, setInputTouched, }) {

    const [cells, setCells] = useState([]);
    const [stores, setStores] = useState([]);
    const [positions, setPositions] = useState([])

    useEffect(() => {
        setStores(locations);
    }, []);

    //select location
    const handleLocationSelect = (id) => {
        const filteredCells = cellsData.filter(
            (locationCell) => locationCell.locationNameId === id
        );
        setCells(filteredCells[0]);
    };

    //select cell
    const handleCellSelect = async (event) => {
        const {value} = event.target
        const availablePositions =  await createDropdownOptions(value).then(data => data)
        setPositions(availablePositions)
        
        setFormControlData((prevState) => ({
            ...prevState,
            cell: value,
        }));
    }

    //select position
    const handleSelectPosition = (event) => {
        setFormControlData((prevState) => ({
            ...prevState,
            position: event.target.value,
        }));
    }

    return (
        <>
            <FormControl margin="normal" fullWidth>
                <InputLabel required>locations</InputLabel>
                <Select
                    sx={{
                        boxShadow: 1
                    }}
                    value={formControlData.storageLocation.id || ""}
                    name="storageLocation"
                    onBlur={() => setInputTouched(true)}
                    error={inputTouched && !formControlData["storageLocation"] }
                    onChange={(event) => {
                        const { value } = event.target;
                        handleLocationSelect(value),
                        setFormControlData((prevState) => ({
                                       
                            ...prevState,
                            storageLocation: {
                                id: value,
                                name: stores[value - 1].name,
                            },
                        }));
                    }}
                >
                    {stores.length !== 0 &&
                  stores.map((store, index) => {
                      return (
                          <MenuItem key={index} value={store.id}>
                              {store.name}
                          </MenuItem>
                      );
                  })}
                </Select>
            </FormControl>

            <FormControl margin="normal" fullWidth>
                <InputLabel required>cells</InputLabel>
                <Select
                    sx={{
                        boxShadow: 1
                    }}
                    value={formControlData.cell}
                    name="cell"
                    onBlur={() => setInputTouched(true)}
                    error={inputTouched && !formControlData["cell"] }
                    onChange={handleCellSelect}
                >
                    {cells.length !== 0 &&
                  cells.cellNumbers.map((cell, index) => {
                      return (
                          <MenuItem key={index} value={cell}>
                              {cell}
                          </MenuItem>
                      );
                  })}
                </Select>
            </FormControl>
                        
            <FormControl margin="normal" fullWidth>
                <InputLabel required>positions</InputLabel>
                <Select
                    sx={{
                        boxShadow: 1
                    }}
                    value={formControlData.position}
                    name="position"
                    onChange={(event) => handleSelectPosition(event)}
                >
                    {positions.length !==0 && positions.map((position, index) => {
                        return (
                            <MenuItem key={index} value={position}>
                                {position}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </>
    )
}

export default LocationsDropdowns
