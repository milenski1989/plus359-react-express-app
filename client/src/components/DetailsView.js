import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import CardsWithActions from './CardsWithActions';

const DetailsView = () => {

    return <>
        <ResponsiveMasonry
            columnsCountBreakPoints={{400: 1, 600: 2, 750: 3, 900: 4, 1000: 5, 1200: 7}}
        >
            <Masonry gutter='1rem' sequential>
                <CardsWithActions 
                />
            </Masonry>
        </ResponsiveMasonry>
    </>
}

export default DetailsView