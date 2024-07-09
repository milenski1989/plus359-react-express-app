import './DetailsView.css'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Card from './refactored components/Card';

const DetailsView = ({searchResults}) => {
    return <>
        <ResponsiveMasonry
            columnsCountBreakPoints={{400: 1, 600: 2, 750: 3, 900: 4, 1000: 5, 1200: 7}}
        >
            <Masonry gutter='1rem'>
                {searchResults.map(art => (
                    <Card 
                        key={art.id}
                        artwork={art}
                        searchResults={searchResults} 
                    />
                ))} 
            </Masonry>
        </ResponsiveMasonry>
    </>
}

export default DetailsView