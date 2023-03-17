/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Download from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import Edit from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteIcon from "@mui/icons-material/Delete";
import { saveAs } from 'file-saver'
import {ImageContext} from "./App";

export default function BasicSpeedDial({showMore, handleShowMore, searchResults, setIsDeleteConfOpen}) {

    const {currentImage, setUpdatedEntry, setIsEditMode} = useContext(ImageContext)
    
    const [openDial, setOpenDial] = useState(false)

    const downloadOriginalImage = (downloadUrl, name ) => {
        saveAs(downloadUrl, name)
    }

    //handle copy original img info to prefill the editable fields
    const prefillEditableFields = (id) => {
        setIsEditMode(true);
        let copyOfEntry;

        copyOfEntry = searchResults.find((art) => art.id === id);
        const {id: copyId, artist, title, technique, dimensions, price, notes, storageLocation, cell, position, onWall, inExhibition} = copyOfEntry
        setUpdatedEntry({
            id: copyId,
            artist,
            title,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cell,
            position,
            onWall,
            inExhibition
        });
    };

    return (
        <Box sx={{transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 15, left: 10 }}
                icon={<SpeedDialIcon />}
                onOpen={() => setOpenDial(true)}
                onClose={() => setOpenDial(false)}
                open={openDial}
                direction="right"
            >
                <SpeedDialAction
                    icon={<ExpandMoreIcon />}
                    onClick={() => {setIsEditMode(false); handleShowMore(!showMore)}}
                    tooltipTitle="show more"

                />

                <SpeedDialAction
                    icon={<Download />}
                    onClick={() => downloadOriginalImage(currentImage.download_url, currentImage.download_key)}
                    tooltipTitle="download"

                />

                <SpeedDialAction
                    icon={<Edit />}
                    onClick={() => {handleShowMore(false); setIsEditMode(true); prefillEditableFields(currentImage.id)} }
                    tooltipTitle="edit"

                />

                <SpeedDialAction
                    icon={<PrintIcon />}
                    onClick={() => {setOpenDial(false); setTimeout(() => {window.print()}, 100) }}
                    tooltipTitle="print"
                />

                <SpeedDialAction
                    icon={<DeleteIcon />}
                    onClick={() => setIsDeleteConfOpen(true)}
                    tooltipTitle="delete"
                />

            </SpeedDial>
        </Box>
    );
}
