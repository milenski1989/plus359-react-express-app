import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import {React, Suspense, lazy, createContext, useState} from 'react'
import './App.css'
import PrivateRoute from './PrivateRoute'
import EditPage from './EditPage'
const Signup = lazy(() => import('./Signup'))
const Login = lazy(() => import('./Login'))
const Gallery = lazy(() => import('./Gallery'))
const Upload = lazy(() => import('./Upload'))
const Account = lazy(() => import('./Account'))
const Home = lazy(() => import('./Home'))



export const ImageContext = createContext()
export const ThemeContext = createContext()
const App = () => {
    const [currentImage, setCurrentImage] = useState(null)
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
                            currentImage,
                            setCurrentImage,
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
                            <PrivateRoute exact path="/edit" component={EditPage} />
                        </ImageContext.Provider>
                        <PrivateRoute exact path="/account" component={Account} />
                    </ThemeContext.Provider>
                </Suspense>
                <Redirect exact path="/" to="/" />
                <Redirect exact path="/logout" to="/login" />
                <Redirect exact path="/edit" to="/edit"/> 
            </Switch>
        </BrowserRouter>
    </>
}

export default App

