import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(document.getElementById('root'));
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
const Login = lazy(() => import('./components/authentication/Login.js'))
const HomePage = lazy(() => import('./components/home/HomePage.js'))
const Upload = lazy(() => import('./components/upload/Upload.js'))
const PdfMaker = lazy(() => import('./components/pdf/PdfMaker.js'))
const AdminPanel = lazy(() => import('./components/admin panel/AdminPanel.js'))
const StoragesManagement = lazy(() => import('./components/admin panel/StoragesManagement.js'))
const Account = lazy(() => import('./components/account/Account.js'))
const EditPage = lazy(() => import('./components/EditPage'))
import ProtectedRoute from './components/ProtectedRoute'
import { ThemeProvider, createTheme } from '@mui/material'
import { ImageProvider } from './components/contexts/ImageContext';
import App from './components/App';
import NavigationLayout from './components/navigation/NavigationLayout.js';
import GalleryContent from './components/gallery/GalleryContent.js';
import './index.css';


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
    {path: '/', element: <Suspense fallback=''><HomePage/></Suspense>},
    {path: '/upload', element: <Suspense fallback=''><Upload/></Suspense>},
    {path: '/gallery/:name', element: <Suspense fallback=''><GalleryContent/></Suspense>},
    {path: '/pdf', element: <Suspense fallback=''><PdfMaker/></Suspense>},
    {path: '/admin-panel', element: <Suspense fallback=''><AdminPanel/></Suspense>},
    {path: '/storages-management', element: <Suspense fallback=''><StoragesManagement/></Suspense>},
    {path: '/account', element: <Suspense fallback=''><Account/></Suspense>},
    {path: '/edit-page', element: <Suspense fallback=''><EditPage/></Suspense>}  
]

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<App/>}>
                <Route exact path="/login" element={<Suspense fallback=''><Login/></Suspense>} />
                <Route element={<NavigationLayout/>}>
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


