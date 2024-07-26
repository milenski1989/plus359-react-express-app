import React, { useContext, useState } from 'react'
import CustomDialog from './reusable/CustomDialog'
import CascadingDropdowns from './reusable/CascadingDropdowns'
import { ImageContext } from './contexts/ImageContext'
import { updateLocations } from '../api/storageService'

const LocationChangeDialog = ({isLocationChangeDialogOpen, handleIsLocationChangeDialogOpen, handleLocationChange}) => {

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

    const updateLocation = async () => {
        const ids = []
        for (let image of currentImages) {
            ids.push(image.id)
        }
        try {
            await updateLocations(ids, formControlData)
            setIsEditMode(false)
            setCurrentImages([])
            
        } catch (error) {
            console.log(error)
        } finally {
            handleIsLocationChangeDialogOpen(false);
            setCurrentImages([])
            handleLocationChange()
        }
    }

    return <>
        {isLocationChangeDialogOpen &&
                <CustomDialog
                    openModal={isLocationChangeDialogOpen}
                    setOpenModal={() => handleIsLocationChangeDialogOpen(false)}
                    title="This will change the location of all selected entries, are you sure?"
                    handleClickYes={updateLocation}
                    handleClickNo={() => handleIsLocationChangeDialogOpen(false)}
                    confirmButtonText="Yes"
                    cancelButtonText="No"
                >
                    <CascadingDropdowns
                        setFormControlData={setFormControlData}
                        isOpenInModal={isLocationChangeDialogOpen} />

                </CustomDialog>}
    </>
  
}

export default LocationChangeDialog