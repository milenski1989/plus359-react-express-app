import { Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditableContainer from "../EditableContainer";
import ActionButtons from "../ActionButtons";
import '../DetailsView.css'
import { generateBackGroundColor } from "../constants/constants";
import ImageContainer from "./ImageContainer";
import { useContext } from "react";
import { ImageContext } from "../contexts/ImageContext";

const Card = ({ searchResults, handleDialogOpen, handleSearchResults }) => {

    const {
        currentImages,
        setCurrentImages,
    } = useContext(ImageContext);

    const checkBoxHandler = (id) => {
        if (currentImages.some(image => image.id === id)) {
            setCurrentImages(currentImages.filter(image => image.id !== id));
        } else {
            setCurrentImages([...currentImages, searchResults.find(image => image.id === id)]);
        }
    }
 
    return <>
        {searchResults.map((art, id) => (

            <div className="card" key={id}>
                <div className="card-header-container">
                    <p className="card-header">{art.artist || 'No Artist'}</p>
                    {art.position !== 0 ?
                        <div
                            style={{backgroundColor: generateBackGroundColor(art.cell), 
                                color: "white", 
                                height: "auto",
                                marginRight: "0.5rem"}}>
                            <p style={{padding: "0.7rem"}}>{art.position}</p>
                        </div>
                        :
                        <></>
                    }
                    <Checkbox
                        onChange={() => checkBoxHandler(art.id)}
                        checked={currentImages.some(image => image.id === art.id)}
                        sx={{
                            "&.Mui-checked": {
                                color: "black",
                            },
                        }}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleOutlineIcon />}
                    /> 
                </div>
               
                <ImageContainer imageSrc={art.image_url}/>
                
                <ActionButtons 
                    className={'in-details-view'}
                    art={art}
                    handleDialogOpen={handleDialogOpen}
                    searchResults={searchResults}
                    handleSearchResults={handleSearchResults}
                />
                <EditableContainer 
                    art={art}
                />
            </div>
        ))}
    </>
};

export default Card