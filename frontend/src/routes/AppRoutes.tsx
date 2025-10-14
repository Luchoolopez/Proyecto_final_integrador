import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/LoginRegister/Login.tsx';
import Register from '../components/LoginRegister/Register.tsx';
import Home from '../pages/Home.tsx';
import "../App.css";
import {MainLayout} from '../layouts/MainLayout.tsx';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout/>}>
                    <Route path='/' element={<Home />} />
                    <Route path='/iniciar-sesion' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

