import { useContext } from "react";
import { ImageContext } from './contexts/ImageContext';
import { Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditableContainer from "./EditableContainer";
import ActionButtons from "./ActionButtons";
import './DetailsView.css'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { generateBackGroundColor } from "./constants/constants";


const DetailsView = ({searchResults, handleDialogOpen, page, sortField, sortOrder, handleSearchResults, handlePagesCount, handleTotalCount, handleError, handleLoading}) => {

    const {
        setCurrentImages,
    } = useContext(ImageContext);

    const checkBoxHandler = (e, id) => {
        const index = searchResults.findIndex(art => art.id === id)
        if (e.target.checked) {
           
            setCurrentImages(prev => [...new Set(prev).add(searchResults[index])])
        } else {
            setCurrentImages(prev => [...prev.filter(image => image.id !== id )])
        }
    }

    return <>
        <div className="cards">
            {searchResults.map((art, id) => (

                <div className="card" key={id}>
                    <div className="card-header-container">
                        <p className="card-header">{art.artist}</p>
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
                            onChange={(e) => checkBoxHandler(e, art.id)}
                            sx={{
                                "&.Mui-checked": {
                                    color: "black",
                                },
                            }}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleOutlineIcon />}
                        /> 
                    </div>
                    <LazyLoadImage
                        src={art.image_url}
                        effect="blur"
                        width='100%'
                        height="auto"
                    />
                    <ActionButtons 
                        art={art}
                        handleDialogOpen={handleDialogOpen}
                        searchResults={searchResults}
                        page={page} 
                        sortField={sortField}
                        sortOrder={sortOrder} 
                        handleSearchResults={handleSearchResults}
                        handlePagesCount={handlePagesCount} 
                        handleTotalCount={handleTotalCount}
                        handleError={handleError}
                        handleLoading={handleLoading}
                    />
                    <EditableContainer 
                        art={art}
                    />
                </div>
            ))}
        </div>
    </>
}

export default DetailsView