import './ThumbnailView.css'
import Masonry from '@mui/lab/Masonry';
import Thumbnail from './refactored components/Thumbnail';

const ThumbnailView = ({searchResults, showCheckbox, setShowCheckbox}) => {

    return <>
        <Masonry columns={{ xs: 1, sm: 2, md: 4, lg: 5, xl: 6}} spacing={2} sequential>
            <Thumbnail  
                showCheckbox={showCheckbox}
                setShowCheckbox={setShowCheckbox}
                searchResults={searchResults}/>
        </Masonry>
    </>
}

export default ThumbnailView