import './DetailsView.css'
import Masonry from '@mui/lab/Masonry';
import Card from './refactored components/Card';

const DetailsView = ({searchResults, handleDialogOpen, handleSearchResults, setIsLocationChangeDialogOpen}) => {

    return <>
        <Masonry columns={{ xs: 1, sm: 2, md: 4, lg: 5, xl: 6}} spacing={2} sequential>
            <Card 
                searchResults={searchResults} 
                handleDialogOpen={handleDialogOpen} 
                handleSearchResults={handleSearchResults}
                setIsLocationChangeDialogOpen={setIsLocationChangeDialogOpen}
            />
        </Masonry>
    </>
}

export default DetailsView