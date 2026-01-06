import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import Home from '../pages/Home.tsx';
import CartPage from '../pages/CartPage.tsx';
import { AdminHome } from '../pages/admin/AdminHome.tsx';
import "../App.css";
import { MainLayout } from '../layouts/MainLayout.tsx';
import ProductListPage from '../pages/ProductListPage.tsx';
import ProductDetailPage from '../pages/ProductDetailPage.tsx';

{/*importaciones del admin*/ }
import { AdminLayout } from '../layouts/admin/AdminLayout.tsx';
import { AdminRoute } from './AdminRoute.tsx';
import { Account } from '../pages/Account.tsx';
import { EditAccount } from '../pages/EditAccount.tsx';
import { CategoryList } from '../pages/admin/CategoryList';
import { CategoryForm } from '../pages/admin/CategoryForm';
import { ProductList } from '../pages/admin/ProductList';
import { ProductForm } from '../pages/admin/ProductForm';
import { OrderList } from '../pages/admin/OrderList.tsx'
import { UserList } from '../pages/admin/UserList.tsx';
import { AddressList } from '../pages/AdressList.tsx';
import { AddressForm } from '../pages/AdressForm.tsx';
import { ForgotPassword } from '../pages/ForgotPassword.tsx';
import { ResetPassword } from '../pages/ResetPassword.tsx';
import { Newsletter } from '../pages/admin/Newsletter.tsx';

export function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/account' element={<Account />} />
                <Route path='/account/info' element={<EditAccount />} />
                <Route path='/account/addresses' element={<AddressList/>}/>
                <Route path='/account/addresses/add' element={<AddressForm/>}/>
                <Route path='/account/addresses/edit/:id' element={<AddressForm/>}/>
                <Route path='/cart' element={<CartPage />} />
                <Route path='/productos' element={<ProductListPage />} />
                <Route path='/productos/:slug1/:slug2' element={<ProductListPage />} />
                <Route path='/productos/:slug1' element={<ProductListPage />} />
                <Route path='/producto/:id' element={<ProductDetailPage />} />
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
                <Route path='/reset-password/:token' element={<ResetPassword/>}/>
            </Route>

            <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path='/admin' element={<AdminHome />} />
                    <Route path='/admin/categorias' element={<CategoryList />} />
                    <Route path='/admin/categorias/nueva' element={<CategoryForm />} />
                    <Route path='/admin/categorias/editar/:id' element={<CategoryForm />} />
                    <Route path='/admin/productos' element={<ProductList />} />
                    <Route path='/admin/productos/nuevo' element={<ProductForm />} />
                    <Route path='/admin/productos/editar/:id' element={<ProductForm />} />
                    <Route path='/admin/ordenes' element={<OrderList />} />
                    <Route path='/admin/usuarios' element={<UserList />} />
                    <Route path='admin/newsletter' element={<Newsletter/>}/>
                </Route>
            </Route>
        </Routes>
    )
}