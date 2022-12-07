import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import './App.css'
import Login from './Login'
import PrivateRoute from './PrivateRoute'
import Home from './Home'
import Upload from './Upload'
import Artworks from './Artworks'
import Signup from './Signup'

const App = () => {

    return <>
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute exact path="/upload" component={Upload} />
                <PrivateRoute exact path="/artworks" component={Artworks} />
                <Redirect exact path="/" to="/" />
                <Redirect exact path="/logout" to="/login" />
            </Switch>
        </BrowserRouter>
    </>
}

export default App

