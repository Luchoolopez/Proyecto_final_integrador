import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import Home from '../pages/Home.tsx';
import { AdminHome } from '../pages/admin/AdminHome.tsx';
import "../App.css";
import { MainLayout } from '../layouts/MainLayout.tsx';


{/*importaciones del admin*/}
import { AdminLayout } from '../layouts/admin/AdminLayout.tsx';
import { AdminRoute } from './AdminRoute.tsx';


export function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Route>

            <Route element={<AdminRoute/>}>
                <Route element={<AdminLayout/>}>
                    <Route path='/admin' element={<AdminHome/>}/>
                </Route>
            </Route>
        </Routes>
    )
}

