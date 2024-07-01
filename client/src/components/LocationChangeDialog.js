import React, { useContext, useState } from 'react'
import CustomDialog from './CustomDialog'
import CascadingDropdowns from './CascadingDropdowns'
import { ImageContext } from './contexts/ImageContext'
import { updateLocations } from '../api/storageService'
import { useOutletContext } from 'react-router-dom'

const LocationChangeDialog = () => {

    const {
        currentImages,
        setCurrentImages,
        setIsEditMode
    } = useContext(ImageContext);

    const {setLocationChanged, isLocationChangeDialogOpen, setIsLocationChangeDialogOpen} = useOutletContext()

    const handleLocationChanged = () => {
        setLocationChanged(prev => !prev)
    }

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
            await updateLocations(ids, formControlData)
            setIsEditMode(false)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLocationChangeDialogOpen(false);
            setCurrentImages([])
            handleLocationChanged()
        }
    }

    return <>
        {isLocationChangeDialogOpen &&
                <CustomDialog
                    openModal={isLocationChangeDialogOpen}
                    setOpenModal={() => setIsLocationChangeDialogOpen(false)}
                    title="This will change the location of all selected entries, are you sure?"
                    handleClickYes={() => updateLocation(formControlData)}
                    handleClickNo={() => setIsLocationChangeDialogOpen(false)}
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