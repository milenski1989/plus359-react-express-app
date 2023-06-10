import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom'
import {React, createContext, useState, lazy, Suspense} from 'react'
import './App.css'
import Login from './Login'
const Home = lazy(() => import('./Home'))
const Upload = lazy(() => import('./Upload'))
const Gallery = lazy(() => import('./Gallery'))
const PdfMaker = lazy(() => import('./PdfMaker'))
const Account = lazy(() => import('./Account'))
const Signup = lazy(() => import('./Signup'))
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
                    <Route exact path="/signup" element={<Suspense fallback=''><Signup/></Suspense>} />
                    <Route element={<ProtectedRoute/>}>
                        <Route path="/" element={<Suspense fallback=''><Home/></Suspense>}></Route>
                        <Route path="/upload" element={<Suspense fallback=''><Upload/></Suspense>}></Route>
                        <Route path="/gallery" element={<Suspense fallback=''><Gallery/></Suspense>}></Route>
                        <Route path='/pdf' element={<Suspense fallback=''><PdfMaker/></Suspense>}></Route>
                        <Route path='/account' element={<Suspense fallback=''><Account/></Suspense>}></Route>
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

