import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom'
import {React, createContext, useState} from 'react'
import './App.css'
import Login from './Login'
import Home from './Home'
import PdfMaker from './PdfMaker'
import Account from './Account'
import Gallery from './Gallery'
import Upload from './Upload'
import Signup from './Signup'
import ProtectedRoute from './ProtectedRoute'

export const ImageContext = createContext()
export const ThemeContext = createContext()
const App = () => {
    const [currentImages, setCurrentImages] = useState([])
    const [updatedEntry, setUpdatedEntry] = useState({});
    const [isEditMode, setIsEditMode] = useState(false)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [imageHeight, setImageHeight] = useState(0)

    return <>
        <BrowserRouter>
            <ImageContext.Provider value={{
                currentImages,
                setCurrentImages,
                updatedEntry,
                setUpdatedEntry,
                isEditMode,
                setIsEditMode,
                isInfoModalOpen,
                setIsInfoModalOpen,
                imageHeight,
                setImageHeight
            }}>
                <Routes>
                    <Route exact path="/login" element={<Login/>} />
                    <Route exact path="/signup" element={<Signup/>} />
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/" element={<Home/>}></Route>
                        <Route path="/upload" element={<Upload/>}></Route>
                        <Route path="/gallery" element={<Gallery/>}></Route>
                        <Route path='/pdf' element={<PdfMaker/>}></Route>
                        <Route path='/account' element={<Account/>}></Route>
                    </Route>
                    <Route path="/" element={<Navigate to="/" replace />} />
                    <Route path="/logout" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<p className='flex justify-center mt-'>Page not found: 404!</p>} />
                </Routes>
            </ImageContext.Provider>
        </BrowserRouter>
    </>
}

export default App

