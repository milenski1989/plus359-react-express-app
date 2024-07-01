import './ThumbnailView.css'
import Masonry from '@mui/lab/Masonry';
import Thumbnails from './Thumbnails';
import { ResponsiveMasonry } from 'react-responsive-masonry';

const ThumbnailView = () => {
    return <>
        <ResponsiveMasonry
            columnsCountBreakPoints={{400: 1, 600: 2, 750: 3, 900: 4, 1000: 5, 1200: 7}}
        >
            <Masonry gutter="1rem" sequential>
                <Thumbnails/>
            </Masonry>
        </ResponsiveMasonry>
    </>
}

export default ThumbnailView