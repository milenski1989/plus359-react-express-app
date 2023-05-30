import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import {React, Suspense, lazy, createContext, useState} from 'react'
import './App.css'
import PrivateRoute from './PrivateRoute'
const Signup = lazy(() => import('./Signup'))
const Login = lazy(() => import('./Login'))
const Gallery = lazy(() => import('./Gallery'))
const Upload = lazy(() => import('./Upload'))
const Account = lazy(() => import('./Account'))
const Home = lazy(() => import('./Home'))
const PdfMaker = lazy(() => import('./PdfMaker'))



export const ImageContext = createContext()
export const ThemeContext = createContext()
const App = () => {
    const [currentImages, setCurrentImages] = useState([])
    const [updatedEntry, setUpdatedEntry] = useState({});
    const [isEditMode, setIsEditMode] = useState(false)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [imageHeight, setImageHeight] = useState(0)

    const [theme, setTheme] = useState('light')

    // useEffect(() => {
    //     if (theme === 'light') {
    //         document.body.className = "dark";
    //     } else {
    //         document.body.className = "light";
    //     }
        
    // }, [theme]);

    return <>
        <BrowserRouter>
            <Switch>
                <Suspense>
                    <ThemeContext.Provider value={{theme, setTheme}}>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/signup" component={Signup} />
                        <PrivateRoute exact path="/" component={Home} />
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
                            <PrivateRoute exact path="/upload" component={Upload} />
                            <PrivateRoute exact path="/artworks" component={Gallery} />
                            <PrivateRoute exact path="/pdf" component={PdfMaker} />
                        </ImageContext.Provider>
                        <PrivateRoute exact path="/account" component={Account} />
                    </ThemeContext.Provider>
                </Suspense>
                <Redirect exact path="/" to="/" />
                <Redirect exact path="/logout" to="/login" />
            </Switch>
        </BrowserRouter>
    </>
}

export default App

