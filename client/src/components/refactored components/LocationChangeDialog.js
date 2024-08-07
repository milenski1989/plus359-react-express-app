import React, { useContext, useState } from 'react'
import CustomDialog from '../CustomDialog'
import CascadingDropdowns from '../CascadingDropdowns'
import { ImageContext } from '../contexts/ImageContext'
import { updateLocations } from '../../api/storageService'

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

    console.log('change4')

    const updateLocation = async () => {
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