import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import Home from '../pages/Home.tsx';
import "../App.css";
import { MainLayout } from '../layouts/MainLayout.tsx';

export function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Route>
        </Routes>
    )
}

