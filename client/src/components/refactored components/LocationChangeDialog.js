import React, { useContext, useState } from 'react'
import CustomDialog from '../CustomDialog'
import CascadingDropdowns from '../CascadingDropdowns'
import axios from 'axios'
import { ImageContext } from '../contexts/ImageContext'

const LocationChangeDialog = ({isLocationChangeDialogOpen, handleIsLocationChangeDialogOpen, handleLocationChanged}) => {

    const {
        currentImages,
        setCurrentImages,
        setIsEditMode
    } = useContext(ImageContext);


    const [formControlData, setFormControlData] = useState({
        storageLocation: "",
        cell: "",
        position: "",
    });

    const updateLocation = async (formControlData) => {
        const ids = []
        for (let image of currentImages) {
            ids.push(image.id)
        }
        try {
            await axios.put(
                `https://plus359-react-express-lk1cf594n-milenski1989s-projects.vercel.app/storage/update-location`,
                {ids, formControlData}
            );
            setIsEditMode(false)
        } catch (error) {
            console.log(error)
        } finally {
            handleIsLocationChangeDialogOpen(false);
            setCurrentImages([])
            handleLocationChanged()
        }
    }

    return <>
        {isLocationChangeDialogOpen &&
                <CustomDialog
                    openModal={isLocationChangeDialogOpen}
                    setOpenModal={() => handleIsLocationChangeDialogOpen(false)}
                    title="This will change the location of all selected entries, are you sure?"
                    handleClickYes={() => updateLocation(formControlData)}
                    handleClickNo={() => handleIsLocationChangeDialogOpen(false)}
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                >
                    <CascadingDropdowns
                        setFormControlData={setFormControlData}
                        openInModal={isLocationChangeDialogOpen} />

                </CustomDialog>}
    </>
  
}

export default LocationChangeDialog