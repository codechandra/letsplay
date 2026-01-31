import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    role?: string;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const location = useLocation();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAuthenticated = !!user;

    if (!isAuthenticated) {
        // Redirect to login but save the intended destination
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (role && (!user.roles || !user.roles.includes(role))) {
        // Redirect to 404 or home if authorized but wrong role
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
