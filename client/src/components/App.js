import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import {React, Suspense, lazy} from 'react'
import './App.css'
import PrivateRoute from './PrivateRoute'
const Signup = lazy(() => import('./Signup'))
const Login = lazy(() => import('./Login'))
const Artworks = lazy(() => import('./Artworks'))
const Upload = lazy(() => import('./Upload'))
const Account = lazy(() => import('./Account'))
const Home = lazy(() => import('./Home'))


const App = () => {

    return <>
        <BrowserRouter>
            <Switch>
                
                <Suspense>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={Signup} />
                    <PrivateRoute exact path="/" component={Home} />
                    <PrivateRoute exact path="/upload" component={Upload} />
                    <PrivateRoute exact path="/artworks" component={Artworks} />
                    <PrivateRoute exact path="/account" component={Account} />
                </Suspense>
                <Redirect exact path="/" to="/" />
                <Redirect exact path="/logout" to="/login" />
               
                
            </Switch>
        </BrowserRouter>
    </>
}

export default App

