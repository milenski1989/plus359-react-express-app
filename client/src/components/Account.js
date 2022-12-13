import SecondaryNavbar from "./SecondaryNavbar";
import "./App.css";
import ConstructionIcon from '@mui/icons-material/Construction';

const Account = () => {

    return (
        <>
            <SecondaryNavbar />
            <section className="mainSection" style={{textAlign: "center", marginTop: "40vh"}}>
                <ConstructionIcon fontSize="large" color="primary"/>
            </section>
        </>
    );
};

export default Account;
