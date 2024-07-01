import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
const Login = lazy(() => import('./components/Login'))
const Home = lazy(() => import('./components/Home'))
const Upload = lazy(() => import('./components/Upload'))
const PdfMaker = lazy(() => import('./components/PdfMaker'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))
const StoragesManagement = lazy(() => import('./components/StoragesManagement'))
const Account = lazy(() => import('./components/Account'))
const EditPage = lazy(() => import('./components/EditPage'))

import ProtectedRoute from './components/ProtectedRoute'
import GalleryLayout from './components/GalleryLayout'

const root = ReactDOM.createRoot(document.getElementById('root'));

import { ThemeProvider, createTheme } from '@mui/material'
import { ImageProvider } from './components/contexts/ImageContext';
import ThumbnailView from './components/ThumbnailView';
import GalleryContent from './components/GalleryContent';
import App from './components/App';
import NavigationLayout from './components/NavigationLayout';
import DetailsView from './components/DetailsView';
import ListView from './components/ListView';

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

const routes  = [
    {path: '/', element: <Suspense fallback=''><Home/></Suspense>},
    {path: '/upload', element: <Suspense fallback=''><Upload/></Suspense>},
    {path: '/gallery/:name', element: <Suspense fallback=''><GalleryLayout/></Suspense>, children: [
        { 
            path: '', element: <GalleryContent> 
                <DetailsView/>
            </GalleryContent>
        },
        {
            path: 'thumbnails', element: <GalleryContent> 
                <ThumbnailView/>
            </GalleryContent>  
        },
        {
            path: 'list', element: <GalleryContent> 
                <ListView/>
            </GalleryContent>  
        }
    ]},
    {path: '/pdf', element: <Suspense fallback=''><PdfMaker/></Suspense>},
    {path: '/admin-panel', element: <Suspense fallback=''><AdminPanel/></Suspense>},
    {path: '/storages-management', element: <Suspense fallback=''><StoragesManagement/></Suspense>},
    {path: '/account', element: <Suspense fallback=''><Account/></Suspense>},
    {path: '/edit-page', element: <Suspense fallback=''><EditPage/></Suspense>},

    
]

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<App/>}>
                <Route exact path="/login" element={<Suspense fallback=''><Login/></Suspense>} />
                <Route  element={<NavigationLayout/>}>
                    <Route element={<ProtectedRoute/>}>
                        {routes.map(({path, element, children}) => (
                            <Route key={path} path={path} element={element}> 
                                { children?.map(({path, element}, index) => (
                                    <Route key={index} path={path} element={element} />
                                ))}
                            </Route>
                        ))}
                    </Route>
                </Route>
              
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/logout" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<p className='flex justify-center mt-'>Page not found: 404!</p>} />
            </Route>
        </Route>
    )
)

root.render(
    <ThemeProvider theme={theme}>
        <ImageProvider>
            <RouterProvider router={router}/> 
        </ImageProvider>
    </ThemeProvider>
);


