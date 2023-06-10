/* eslint-disable no-undef */
import React, {  useEffect, useState } from 'react'
import './App.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Upload from './Upload'
import Gallery from './Gallery'
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

const icons = {
    logo: require('./assets/logo359 gallery-white1.png')
}

const Home = () => {

    let location = useLocation();

    const [activeTab, setActiveTab] = useState()

    let navigate = useNavigate();


    const handleLogout = () => {
        window.localStorage.clear()
        window.sessionStorage.clear()
        navigate('/login')
    }

    useEffect(() => {
        if (history) {
            switch (location) {
            case "/upload" : setActiveTab(<Upload/>)
                break;
            case "/gallery" : setActiveTab(<Gallery/>)
                break;
            }
        }
    },[])

    return <><div className="parent">
        <div className={`bg-black flex justify-between p-4`}>
            <Link to='/'><img className="max-sm:w-16 w-24 mt-2 mr-12 max-sm:ml-1 ml-2" alt="logo" src={icons.logo} /></Link>
            <Link className="self-center no-underline text-white"  to='/login' onClick={handleLogout}>Log out</Link>
        </div>
        <NavUnlisted>
            <Link to='/upload' className='mt-8'>{
                <Button 
                    variant="outlined"
                    sx={{ width: 100, padding: 0.5, marginTop: 0.75 }} 
                    startIcon={<UploadIcon />}>
                        Upload
                </Button>
            }</Link>
            <Link to='/gallery' className='mt-8'>{
                <Button 
                    variant="outlined"
                    sx={{ width: 100, padding: 0.5, marginTop: 0.75 }} 
                    startIcon={<CollectionsIcon />}>
                        Gallery
                </Button>
            }</Link>
            <Link to='/account' className='mt-8'>{
                <Button 
                    variant="outlined"
                    sx={{ width: 100, padding: 0.5, marginTop: 0.75 }} 
                    startIcon={<AccountBoxIcon />}>
                        Account
                </Button>
            }</Link>
        </NavUnlisted>

        {activeTab}
    </div>
    </>
}

export default Home