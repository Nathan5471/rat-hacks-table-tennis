import { Navigate, Outlet } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { isLoggedIn } from './AuthAPIHandler';

const AuthenticatedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await isLoggedIn();
                setIsAuthenticated(response);
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsAuthenticated(false);
            }
        };

        checkLoginStatus();
    }, []);

    if (isAuthenticated === null) {
        return <></>
    }

    if (isAuthenticated === true) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" />;
    }
}

export default AuthenticatedRoute;