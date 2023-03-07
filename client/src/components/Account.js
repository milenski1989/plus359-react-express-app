import SecondaryNavbar from "./SecondaryNavbar";
import "./App.css";
import ConstructionIcon from '@mui/icons-material/Construction';


const Account = () => {

    let myStorage = window.localStorage
    let user = JSON.parse(myStorage.getItem('user'))
    console.log(JSON.parse(myStorage.getItem('user')))

    return (
        <>
            <SecondaryNavbar />
            <section className="mainSection" style={{textAlign: "center", marginTop: "40vh"}}>
                <ConstructionIcon fontSize="large" color="primary"/>

                <div>
                    <div>
                        <h3>Username: {user.userName}</h3>
                        <h3>Email: {user.email}</h3>
                        <h3>{`This user ${user.superUser ? 'has' : 'doesnt have'} super user rights. ${!user.superUser ? 'Please, contact administrator' : ''}`}</h3>
                    </div>
                </div>
                
            </section>
        </>
    );
};

export default Account;
