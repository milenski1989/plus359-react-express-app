import { Link } from "react-router-dom"
import './NavBar.css'
import './App.css'
import styled from "styled-components";
import Logout from "./Logout";

const NavUnlisted = styled.ul`
  display: flex;
  text-decoration: none;
  background: rgb(29, 28, 28);
  justify-content: space-around;
  padding: 1rem;
  margin: 0;
`;

const linkStyle = {
    textDecoration: "none",
    color: "white",
};

const SecondaryNavbar = () => {

    return  <>
        <NavUnlisted>
            <Link to='/' style={linkStyle}>Home</Link>
            <Link to='/upload' style={linkStyle}>Upload</Link>
            <Link to='/artworks' style={linkStyle}>Gallery</Link>
        </NavUnlisted>
        <Logout styles={{top: '5px', right: '3px'}}/>
    </>
}

export default SecondaryNavbar