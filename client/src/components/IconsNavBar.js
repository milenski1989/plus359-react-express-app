/* eslint-disable no-undef */
import { Link } from "react-router-dom"
import './NavBar.css'
import styled from "styled-components";
import { Button } from "@mui/material"
import UploadIcon from '@mui/icons-material/Upload';
import CollectionsIcon from '@mui/icons-material/Collections';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const NavUnlisted = styled.ul`
  position: absolute;
  top: 50%;
left: 50%;
transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  flex-direction: column;
  padding:0;
  
`;

const linkStyle = {
    marginTop: "2rem",
    textDecoration: "none",
    color: "white",
};

const IconsNavbar = () => {
   
    return <>
        <NavUnlisted>
            <Link to='/upload' style={linkStyle}>{
                <Button 
                    variant="outlined"
                    sx={{ width: 100, padding: 0.5, marginTop: 0.75 }} 
                    startIcon={<UploadIcon />}>
                        Upload
                </Button>
            }</Link>
            <Link to='/artworks' style={linkStyle}>{
                <Button 
                    variant="outlined"
                    sx={{ width: 100, padding: 0.5, marginTop: 0.75 }} 
                    startIcon={<CollectionsIcon />}>
                        Gallery
                </Button>
            }</Link>
            <Link to='/account' style={linkStyle}>{
                <Button 
                    variant="outlined"
                    sx={{ width: 100, padding: 0.5, marginTop: 0.75 }} 
                    startIcon={<AccountBoxIcon />}>
                        Account
                </Button>
            }</Link>
        </NavUnlisted>
    </>
}

export default IconsNavbar