/* eslint-disable no-undef */

import { Link } from "react-router-dom"
import './NavBar.css'
import './App.css'
import styled from "styled-components";

const NavUnlisted = styled.ul`
  display: flex;
  padding: 1.5rem;
  text-decoration: none;
  background: rgb(29, 28, 28);
  justify-content: space-around;
  margin-top: 0;
  margin-bottom: 3rem;
`;

const linkStyle = {
    textDecoration: "none",
    color: "white",
};

const SecondaryNavbar = () => {

    return  <>
        <NavUnlisted>
            <Link to='/' style={linkStyle}>Home</Link>
            <Link to='/search' style={linkStyle}>Search</Link>
            <Link to='/upload' style={linkStyle}>Upload</Link>
            <Link to='/artworks' style={linkStyle}>Gallery</Link>
        </NavUnlisted>
    </>
}

export default SecondaryNavbar