/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */

import { Box, Button, CircularProgress, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"

import './Warehouse.css'
// eslint-disable-next-line no-undef
const qs = require('qs')

// const icons = {
//     delete: require('../components/assets/delete.png'),
// }

const Warehouse = () => {
    const [arts, setArts] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [page, ] = useState(1)
    const [sortCriteria, ] = useState(['author:asc'])

    const setQuery = () => {
        let query = qs.stringify({
            sort: sortCriteria,
            populate: '*',
            pagination: {
                pageSize: 20,
                page: page,
            },
        }, {
            encodeValuesOnly: true,
        });

        return query
    }

    const getArts = async () => {
        setLoading(true)
        const response = await axios(`https://plus359gallery-strapi-app.herokuapp.com/api/arts?${setQuery()}`)
        const data = await response.data
        setArts(data.data)
        setLoading(false)
    }

    useEffect(() => {
        getArts()
    },[])

    const deleteSingleArt = async (id) => {

        await fetch(`https://plus359gallery-strapi-app.herokuapp.com/api/arts/${id}`, {
            method: "DELETE",
        })
        setArts(arts.filter(art => art.id !== id))
        setDeleting(false)
    }

    const handleDelete = (id) => {
        setDeleting(true)
        deleteSingleArt(id)
    }

    // TO DO: fetch data, using lazy loading !
  
    return   <>
        <div className="warehouseFlexContainer">
            {(loading || deleting ) ? <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box> :
                arts.length !== 0 &&
                arts.map((art, id) => <div key={id} className="warehouseFlexElement">
                    <div className="singleEntry" key={id}>
                		{art?.attributes?.photo?.data !== null &&
                            <div className="imageContainer">
                            	<img className="entryImage" alt="No preview available" src={art?.attributes?.photo?.data[0]?.attributes?.formats?.small?.url} />
                            	<Button
                            		children={ <span>del</span>}
                            		onClick={() => handleDelete(art.id)}
                                />
                            </div>}

                	</div>

                	<div className="entriesInfo">
                		<div className="infoContainer">
                			<TextField
                				value={art.attributes?.author}
                				label="Author"
                				variant="outlined"
              			margin="normal"
               			type="text"
               			onChange={() => console.log('edit')} />

               		<TextField
                                value={art.attributes?.title}
                				label="Title"
                				variant="outlined"
                				margin="normal"
                				type="text"
                				onChange={() => console.log('edit')} />

                		</div>
                		<div className="infoContainer">
                			<TextField
                				value={art.attributes?.height}
                				label="Height"
                				variant="outlined"
                				margin="normal"
                				type="text"
                				onChange={() => console.log('edit')} />

                			<TextField
                				value={art.attributes?.width}
                				label="Width"
                				variant="outlined"
                				margin="normal"
                				type="text"
                				onChange={() => console.log('edit')} />
                		</div>
                	</div>
                </div>
                )
            }
        </div>
    </>

}

export default Warehouse

