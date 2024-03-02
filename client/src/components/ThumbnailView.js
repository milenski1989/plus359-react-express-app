
import { Checkbox } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useContext } from 'react';
import { ImageContext } from './contexts/ImageContext';
import './ThumbnailView.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Masonry from '@mui/lab/Masonry';

const ThumbnailView = ({searchResults}) => {

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
        <Masonry columns={{ xs: 1, sm: 2, md: 4, lg: 5, xl: 6}} spacing={2} sequential>
            {searchResults.map((art, id) => (
                <div
                    key={id}>
                    <Checkbox
                        onChange={(e) => checkBoxHandler(e, art.id)}
                        sx={{
                            position: "absolute",
                            zIndex: '9999',
                            color: "white",
                            "&.Mui-checked": {
                                color: "white",
                            },
                        }}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleOutlineIcon />}
                    />
                    <image style={{width: '100%', height: 'auto'}} src={art.image_url}/>
                    <LazyLoadImage
                        src={art.image_url}
                        effect="blur"
                        width='100%'
                        height="auto"
                    />
                </div>
            ))}
        </Masonry>
    </>

}

export default ThumbnailView