import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

function useAuthentication() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token) {
            try {
                const decodedToken = jwtDecode<{ exp: number }>(token);

                // Check if token is expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem('access_token');
                    setIsAuthorized(false);
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('access_token');
                setIsAuthorized(false);
            }
        } else {
            setIsAuthorized(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsAuthorized(false);
    };

    return {
        isAuthorized,
        logout,
    };
}

export default useAuthentication;
