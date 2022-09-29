/* eslint-disable no-debugger */
/* eslint-disable indent */
/* eslint-disable no-undef */
import {
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
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
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Artworks = () => {
  const [arts, setArts] = useState([]);
  const [updatedArt, setUpdatedArt] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState({ error: false, message: "" });
  const [viewDetails, setViewDetails] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      `http://localhost:5000/artworks/${id}`,
      { id: id }
    );

    if (response.status === 200) {
      setArts(arts.filter((art) => art.id !== id));
      setDeleting(false);
    }
  };

  const hadleDelete = () => {
    setConfirmDelete(true);
  };

  const editArt = async (id) => {
    const response = await axios.put(
      `http://localhost:5000/artworks/${id}`,
      updatedArt
    );

    const data = await response.data;
    if (response.status === 200) {
      setEditing(false);
      setUpdatedArt({});
      getArts();
    } else {
      setEditing(false);
      setUpdatedArt({});
      setEditError({ error: true, message: data.error.message.slice(0, 62) });
    }
    setViewDetails(false);
  };

  const handleEdit = (id) => {
    setViewDetails(true);
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
    setViewDetails(false);
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
          <div className="gridContainer">
            {arts.map((art, id) => (
              <>
                <Dialog
                  open={confirmDelete}
                  onClose={() => setConfirmDelete(false)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete the entry? This is
                      irreversible!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setDeleting(true),
                          deleteSingleArt(art.id, setConfirmDelete(false));
                      }}
                      autoFocus
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>

                <div className="gridItem" key={id}>
                  <div className="imageContainer">
                    <img
                      src={art.image_url}
                      alt="No Preview"
                      className="artImage"
                    />
                  </div>

                  <div className="buttonsContainer">
                    <IconButton
                      variant="outlined"
                      onClick={hadleDelete}
                      sx={{ marginTop: 0.75}}
                    >
                      <DeleteIcon />
                    </IconButton>

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
                            onClick={() => handleSave(updatedArt.id)}
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
                    <IconButton
                      variant="standard"
                      onClick={() => {
                        setViewDetails((prev) => (prev = !prev)),
                          setEditing(false);
                      }}
                      sx={{ marginTop: 0.75 }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </div>
                
                  {viewDetails && (
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
                  )}
                </div>
              </>
            ))}
          </div>
        )}
      </section>
    </>
  );
};
export default Artworks;
