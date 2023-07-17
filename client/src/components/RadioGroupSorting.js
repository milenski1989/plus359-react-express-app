import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'

const options = [
    {sortCriteria: 'id', sortOrder: 'asc'},
    {sortCriteria: 'id', sortOrder: 'desc'},
    {sortCriteria: 'position', sortOrder: 'asc'},
    {sortCriteria: 'position', sortOrder: 'desc'}
]

const RadioGroupSorting = ({setSortField, setSortOrder}) => {

    const handleSorting = (field, order) => {
        setSortField(field)
        setSortOrder(order)
    }
    
    return <div className='mt-16'>
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Order by:</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="id"
                name="radio-buttons-group"
            >
                {options.map(option => 
                    <FormControlLabel 
                        key={`${option.sortCriteria}-${option.sortOrder}`}
                        onChange={() => handleSorting(option.sortCriteria, option.sortOrder)}
                        value={`${option.sortCriteria}-${option.sortOrder}`} 
                        control={<Radio />} label={`${option.sortCriteria}-${option.sortOrder}`} />
                )}
              
            </RadioGroup>
        </FormControl>
    </div>
}

export default RadioGroupSorting