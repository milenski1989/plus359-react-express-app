/* eslint-disable indent */
/* eslint-disable no-undef */
import { TextField, IconButton } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import SecondaryNavbar from './SecondaryNavbar'
import './Gallery.css'
import './App.css'
import Message from './Message'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel';

// eslint-disable-next-line no-undef
const qs = require('qs')

const Gallery = () => {

    const [arts, setArts] = useState([])
    const [updatedArt, setUpdatedArt] = useState({
    })
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [editing, setEditing] = useState(false)
    const [page, ] = useState(1)
    const [sortCriteria, ] = useState(['author:asc'])
    const [editError, setEditError] = useState({error: false, message: ""})

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

      const response = await fetch(`https://plus359gallery-strapi-app.herokuapp.com/api/arts/${id}`, {
            method: "DELETE",
        })
        const data = await response.json();
        if (response.status === 200) {
                setArts(arts.filter(art => art.id !== id))
                setDeleting(false)
        } else {
            setDeleting(false)
            console.log(data)
        }

    }

    const editArt = async (id) => {
        const response = await fetch(`https://plus359gallery-strapi-app.herokuapp.com/api/arts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.localStorage.jwt}`
            },
            body: JSON.stringify({ data: {...updatedArt} })
        })
        const data = await response.json();
            if (response.status === 200) {
                setEditing(false)
                setUpdatedArt({})
                getArts()
            } else {
                setEditing(false)
                setUpdatedArt({})
                setEditError({error: true, message: data.error.message.slice(0,62)})
            }

    }

    const handleDelete = (id) => {
        setDeleting(true)
        deleteSingleArt(id)
    }

    const handleEdit = (id) => {
        setEditing(true)
        let copyOfArtDetails = arts.find(art => art.id === id)
        setUpdatedArt(
            {
                id: copyOfArtDetails.id,
                author: copyOfArtDetails.attributes.author,
                title: copyOfArtDetails.attributes.title,
                height: copyOfArtDetails.attributes.height,
                width: copyOfArtDetails.attributes.width
        }
        )
    }

    const handleSave = (id) => {
        editArt(id)
     }

    const handleCancel = () => {
        setEditing(false)
    }

    const onChangeEditableField = (e) => {
        const { name, value } = e.target;
        setUpdatedArt(prevState => ({
            ...prevState,
           [name] : value
        }));
    }

    return <>
          {<Message open={editError.error} handleClose={() => setEditError({error: false, message: ""})} message={editError.message} severity="error"
        /> }
        <SecondaryNavbar/>
        <section className="storageSection mainSection">
            {loading || deleting ?
            <div className="loader">
                  <ThreeDots
             height="80"
             width="80"
             radius="9"
             color="#78FECF"
             ariaLabel="three-dots-loading"
             visible={true}
         />
            </div>
            :
                <div className="storageFlexContainer">

                    {arts.length !== 0 && arts.map((art, id) =>
                        <div key={id} className="singleItem">
                                {art?.attributes?.photo?.data !== null &&
                                <><div className="imageContainer">
                                    <img className="artImage" alt="No preview available" src={art?.attributes?.photo?.data[0]?.attributes?.formats?.small?.url} />
                                </div>
                                <div className="btnFlexOuterContainer">
                                <div>
                                <IconButton variant="outlined"  onClick={() => handleDelete(art.id)}
                                            sx={{ marginTop: 0.75, marginRight: editing ? 16 : 26 }}
                                            >
                                            <DeleteIcon />
                                        </IconButton>
                                </div>

                                       <div className="btnFlexInnerContainer">
                                        <IconButton variant="outlined"  onClick={() => handleEdit(art.id)}
                                            sx={{ marginTop: 0.75 }}
                                             >
                                            <ModeEditIcon />
                                        </IconButton>
                                        {editing && art.id === updatedArt.id && <><IconButton
                                        onClick={() => handleSave(updatedArt.id)}
                                        sx={{ marginTop: 0.75 }} >
                                        <SaveIcon/>
                                            </IconButton>

                                        <IconButton
                                            onClick={handleCancel}
                                            sx={{ marginTop: 0.75 }} >
                                        <CancelIcon/>
                                                </IconButton>
                                                </>
                                            }
                                </div>
                                </div>

                                <div className="infoContainer storageFlexContainer">

                                        <TextField
                                            value={editing && art.id === updatedArt.id ? updatedArt.author : art.attributes?.author}
                                            label="Author"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="text"
                                            required={editing}
                                            name="author"
                                            className="firstTextField"
                                            disabled={art.id !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)} />

                                        <TextField
                                            value={editing && art.id === updatedArt.id ? updatedArt.title : art.attributes?.title}
                                            label="Title"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="text"
                                            name="title"
                                            disabled={art.id !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)} />

                                        <TextField
                                            value={editing && art.id === updatedArt.id ? updatedArt.height : art.attributes?.height}
                                            label="Height"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="number"
                                            required={editing}
                                            pattern="[0-9]*"
                                            name="height"
                                            disabled={art.id !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)} />

                                        <TextField
                                            value={editing && art.id === updatedArt.id ? updatedArt.width : art.attributes?.width}
                                            label="Width"
                                            variant={editing ? "outlined" : "standard"}
                                            margin="normal"
                                            type="number"
                                            required={editing}
                                            pattern="[0-9]*"
                                            name="width"
                                            disabled={art.id !== updatedArt.id || !editing}
                                            onChange={(event) => onChangeEditableField(event)} />

                                    </div></>
                            }

                        </div>
                    )
                    }

                </div>
            }
        </section>
    </>

}

export default Gallery

/*

*/