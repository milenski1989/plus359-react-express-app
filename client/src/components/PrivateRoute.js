import { Route, Redirect } from 'react-router-dom'


const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user
    
}

function PrivateRoute({ component: Component, ...rest }) {

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated () ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute