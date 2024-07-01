import { Outlet } from 'react-router-dom'
import {React} from 'react'
import './App.css'


const App = () => {

    return <>
        <div className="App">
            <Outlet/> 
        </div>
    </>
}

export default App

