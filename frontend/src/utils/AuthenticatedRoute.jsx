import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from './AuthAPIHandler';

const AuthenticatedRoute = () => {
    const isAuthenticated = isLoggedIn();

    return isAuthenticated === true ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthenticatedRoute;