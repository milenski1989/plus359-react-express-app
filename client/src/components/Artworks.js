/* eslint-disable no-debugger */
/* eslint-disable indent */
/* eslint-disable no-undef */
//import { TextField, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import SecondaryNavbar from './SecondaryNavbar'
import './Artworks.css'
import './App.css'
import Message from './Message'
//import DeleteIcon from '@mui/icons-material/Delete'
//import ModeEditIcon from '@mui/icons-material/ModeEdit'
//import SaveIcon from '@mui/icons-material/Save'
//import CancelIcon from '@mui/icons-material/Cancel';

const Gallery = () => {

    const [arts, setArts] = useState([])
    //const [updatedArt, setUpdatedArt] = useState({})
    const [loading, setLoading] = useState(false)
    //const [deleting, setDeleting] = useState(false)
    //const [editing, setEditing] = useState(false)

    const [editError, setEditError] = useState({error: false, message: ""})

    console.log('arts', arts)

    const getArts = async () => {
        setLoading(true)
        const response = await fetch("http://localhost:5000/artworks")
       
        const data = await response.json()
    
        if (response.status === 200) {
            setArts(data.artworks)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        getArts()
    },[])

    // const deleteSingleArt = async (id) => {

    //   const response = await fetch(`https://plus359gallery-strapi-app.herokuapp.com/api/arts/${id}`, {
    //         method: "DELETE",
    //     })
    //     const data = await response.json();
    //     if (response.status === 200) {
    //             setArts(arts.filter(art => art.id !== id))
    //             setDeleting(false)
    //     } else {
    //         setDeleting(false)
    //         console.log(data)
    //     }

    // }

    // const editArt = async (id) => {
    //     const response = await fetch(`https://plus359gallery-strapi-app.herokuapp.com/api/arts/${id}`, {
    //         method: "PUT",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${window.localStorage.jwt}`
    //         },
    //         body: JSON.stringify({ data: {...updatedArt} })
    //     })
    //     const data = await response.json();
    //         if (response.status === 200) {
    //             setEditing(false)
    //             setUpdatedArt({})
    //             getArts()
    //         } else {
    //             setEditing(false)
    //             setUpdatedArt({})
    //             setEditError({error: true, message: data.error.message.slice(0,62)})
    //         }

    // }

    // const handleDelete = (id) => {
    //     setDeleting(true)
    //     deleteSingleArt(id)
    // }

    // const handleEdit = (id) => {
    //     setEditing(true)
    //     let copyOfArtDetails = arts.find(art => art.id === id)
    //     setUpdatedArt(
    //         {
    //             id: copyOfArtDetails.id,
    //             author: copyOfArtDetails.attributes.author,
    //             title: copyOfArtDetails.attributes.title,
    //             height: copyOfArtDetails.attributes.height,
    //             width: copyOfArtDetails.attributes.width
    //     }
    //     )
    // }

    // const handleSave = (id) => {
    //     editArt(id)
    //  }

    // const handleCancel = () => {
    //     setEditing(false)
    // }

    // const onChangeEditableField = (e) => {
    //     const { name, value } = e.target;
    //     setUpdatedArt(prevState => ({
    //         ...prevState,
    //        [name] : value
    //     }));
    // }

    return <>
          {<Message open={editError.error} handleClose={() => setEditError({error: false, message: ""})} message={editError.message} severity="error"
        /> }
        <SecondaryNavbar/>
        <section className="storageSection mainSection">
            {loading ?
            <div className="loader">
                  <ThreeDots
             height="80"
             width="80"
             radius="9"
             color="#78FECF"
             ariaLabel="three-dots-loading"
             visible={true}
         />
            </div> :
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {arts.map(art => 
                    <div key={art.id} style={{width: 400, marginTop: '1rem'}}>
                        <img src={art.image_url} alt="No Preview" style={{width: '100%', height: 'auto'}}/>
                        <h3>{art.title}</h3>
                    </div>
                )}
            </div>
            }
        </section>
    </>

}

export default Gallery
