import { Route, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider, } from 'react-router-dom'
import {React, lazy, Suspense} from 'react'
import './App.css'
const Login = lazy(() => import('./Login'))
const Home = lazy(() => import('./Home'))
const Upload = lazy(() => import('./Upload'))
const PdfMaker = lazy(() => import('./PdfMaker'))
const Account = lazy(() => import('./Account'))
const Signup = lazy(() => import('./Signup'))
import ProtectedRoute from './ProtectedRoute'
import { ImageProvider } from './contexts/ImageContext'
import { ThemeProvider, createTheme } from '@mui/material'
import NewGalleryContent from './refactored components/NewGalleryContent'

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '0.5rem 1.2rem',
                    textTransform: 'capitalize',
                    fontSize: '1rem',
                },
            },
        },
        MuiMasonry: {
            styleOverrides: {
                root: {
                    margin: 0
                }
            }
        }
    },
});

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route exact path="/login" element={<Suspense fallback=''><Login/></Suspense>} />
            <Route exact path="/signup" element={<Suspense fallback=''><Signup/></Suspense>} />
            <Route element={<ProtectedRoute/>}>
                <Route path="/" element={<Suspense fallback=''><Home/></Suspense>}></Route>
                <Route path="/upload" element={<Suspense fallback=''><Upload/></Suspense>}></Route>
                <Route path="/gallery/:name" element={<Suspense fallback=''><NewGalleryContent/></Suspense>}/>
                <Route path='/pdf' element={<Suspense fallback=''><PdfMaker/></Suspense>}></Route>
                <Route path='/account' element={<Suspense fallback=''><Account/></Suspense>}></Route>
            </Route>
            <Route path="/" element={<Navigate to="/" replace />} />
            <Route path="/logout" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<p className='flex justify-center mt-'>Page not found: 404!</p>} />
        </Route>
    )
)

const App = () => {

    return <>
        <ThemeProvider theme={theme}>
            <ImageProvider>
                <RouterProvider router={router} />
            </ImageProvider>
        </ThemeProvider>
    </>
}

export default App

