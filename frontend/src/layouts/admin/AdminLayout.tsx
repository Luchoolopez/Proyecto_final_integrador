import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
// A futuro importarías tus componentes de admin aquí:
// import { AdminHeader } from './AdminHeader';
// import { AdminSidebar } from './AdminSidebar';

export const AdminLayout = () => {
    return (
        <div className="admin-layout-container" style={{ display: 'flex' }}>




                <AdminSidebar />

                <Outlet />
        

        </div>
    );
};