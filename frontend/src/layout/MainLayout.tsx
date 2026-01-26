import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-letsplay-blue/20">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
