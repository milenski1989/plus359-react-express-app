/* eslint-disable no-debugger */
/* eslint-disable indent */
/* eslint-disable no-undef */
import { TextField, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import SecondaryNavbar from "./SecondaryNavbar";
import "./Artworks.css";
import "./App.css";
import Message from "./Message";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios"

const Artworks = () => {
  const [arts, setArts] = useState([]);
  const [updatedArt, setUpdatedArt] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState({ error: false, message: "" });

  const getArts = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:5000/artworks");

    const data = await response.json();

    if (response.status === 200) {
      setArts(data.artworks);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArts();
  }, []);

  const deleteSingleArt = async (id) => {
   
   const response = await axios.delete(
      `http://localhost:5000/artworks/${id}`, {id: id})

    if (response.status === 200) {
    
  setArts(arts.filter((art) => art.id !== id));
            setDeleting(false)    
    }
  };

  const hadleDelete = (id, filename) => {
    setDeleting(true);
    deleteSingleArt(id, filename)
  }

  const editArt = async (id) => {
    const response = await axios.put(`http://localhost:5000/artworks/${id}`, updatedArt )
    
    const data = await response.data
    if (response.status === 200) {
    setEditing(false);
      setUpdatedArt({});
      getArts();
    } else {
      setEditing(false);
      setUpdatedArt({});
      setEditError({ error: true, message: data.error.message.slice(0, 62) });
    }
  };

  const handleEdit = (id) => {
    setEditing(true);
    let copyOfArtDetails = arts.find((art) => art.id === id);
    setUpdatedArt({
      id: copyOfArtDetails.id,
      author: copyOfArtDetails.author,
      title: copyOfArtDetails.title,
      height: copyOfArtDetails.height,
      width: copyOfArtDetails.width,
    });
  };

  const handleSave = (id) => {
    editArt(id);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const onChangeEditableField = (e) => {
    const { name, value } = e.target;
    setUpdatedArt((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      {
        <Message
          open={editError.error}
          handleClose={() => setEditError({ error: false, message: "" })}
          message={editError.message}
          severity="error"
        />
      }

      <SecondaryNavbar />
      <section className="storageSection mainSection">
        {loading || deleting ? (
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
        ) : (
          arts.map((art, id) => (
            <div className="entryContainer" key={id}>
              <div className="imageContainer">
                <img
                  src={art.image_url}
                  alt="No Preview"
                  className="artImage"
                />
              </div>

              <h3>{art.title}</h3>

              <div className="btnFlexOuterContainer">
                <div>
                  <IconButton
                    variant="outlined"
                    onClick={() => hadleDelete(art.id)}
                    sx={{ marginTop: 0.75, marginRight: editing ? 16 : 26 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>

                <div className="btnFlexInnerContainer">
                  <IconButton
                    variant="outlined"
                    onClick={() => handleEdit(art.id)}
                    sx={{ marginTop: 0.75 }}
                  >
                    <ModeEditIcon />
                  </IconButton>
                  {editing && art.id === updatedArt.id && (
                    <>
                      <IconButton
                        onClick={() =>handleSave(updatedArt.id)}
                        sx={{ marginTop: 0.75 }}
                      >
                        <SaveIcon />
                      </IconButton>

                      <IconButton
                        onClick={handleCancel}
                        sx={{ marginTop: 0.75 }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>

              <div className="infoContainer">
                <TextField
                  value={
                    editing && art.id === updatedArt.id
                      ? updatedArt.author
                      : art.author
                  }
                  label="Author"
                  variant={editing ? "outlined" : "standard"}
                  margin="normal"
                  type="text"
                  required={editing}
                  name="author"
                  className="firstTextField"
                  disabled={art.id !== updatedArt.id || !editing}
                  onChange={(event) => onChangeEditableField(event)}
                />

                <TextField
                  value={
                    editing && art.id === updatedArt.id
                      ? updatedArt.title
                      : art.title
                  }
                  label="Title"
                  variant={editing ? "outlined" : "standard"}
                  margin="normal"
                  type="text"
                  name="title"
                  disabled={art.id !== updatedArt.id || !editing}
                  onChange={(event) => onChangeEditableField(event)}
                />

                <TextField
                  value={
                    editing && art.id === updatedArt.id
                      ? updatedArt.height
                      : art.height
                  }
                  label="Height"
                  variant={editing ? "outlined" : "standard"}
                  margin="normal"
                  type="number"
                  required={editing}
                  pattern="[0-9]*"
                  name="height"
                  disabled={art.id !== updatedArt.id || !editing}
                  onChange={(event) => onChangeEditableField(event)}
                />

                <TextField
                  value={
                    editing && art.id === updatedArt.id
                      ? updatedArt.width
                      : art.width
                  }
                  label="Width"
                  variant={editing ? "outlined" : "standard"}
                  margin="normal"
                  type="number"
                  required={editing}
                  pattern="[0-9]*"
                  name="width"
                  disabled={art.id !== updatedArt.id || !editing}
                  onChange={(event) => onChangeEditableField(event)}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
};
export default Artworks;
