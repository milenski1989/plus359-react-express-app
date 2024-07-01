import { useOutletContext } from "react-router-dom";
import CardWithActions from './CardWithActions';

const CardsWithActions = () => {

    const {searchResults} = useOutletContext()

    return <>
        {searchResults.map((art, id) => (
            <CardWithActions 
                key={id} 
                art={art}
            />
        ))}
    </>
};

export default CardsWithActions