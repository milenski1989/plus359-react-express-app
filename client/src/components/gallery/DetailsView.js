import './DetailsView.css'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Card from './Card';

const DetailsView = ({handleDialogOpen, searchResults, handleIsLocationChangeDialogOpen}) => {
    return <div className="details-view-content-container">
        <ResponsiveMasonry
            columnsCountBreakPoints={{400: 1, 600: 2, 750: 3, 900: 4, 1000: 5, 1200: 7}}
        >
            <Masonry gutter='1rem'>
                {searchResults.map(art => (
                    <Card 
                        key={art.id}
                        handleDialogOpen={handleDialogOpen}
                        art={art}
                        searchResults={searchResults} 
                        handleIsLocationChangeDialogOpen={handleIsLocationChangeDialogOpen}
                    />
                ))} 
            </Masonry>
        </ResponsiveMasonry>
    </div>
}

export default DetailsView