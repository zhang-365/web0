import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

import FrontLayout from '../layouts/FrontLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Product from '../pages/Product';


import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Z_Login';
import Dashboard from '../pages/Z_Dashboard';
import UserList from '../pages/Z_UserList';
import DeptList from '../pages/Z_DeptList';
import RoleList from '../pages/Z_RoleList';
import MenuList from '../pages/Z_MenuList';
import ProductList from '../pages/Z_ProductList';
import RolePermission from '../pages/Z_RolePermission';
import MessageList from '../pages/Z_MessageList';
import AttachmentPage from '../pages/Z_AttachmentPage';
import NotFound404 from '../pages/NotFound404';
const ADMIN_PREFIX = '/manage_abc2026';
// 路由守卫
const AuthGuard = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to={`${ADMIN_PREFIX}/login`} replace />;
  }
  return <>{children}</>;
};
const GuestGuard = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to={ADMIN_PREFIX} replace />;
  }
  return <>{children}</>;
};


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/product",
    element: <Product />,
  },
  {
    path: `${ADMIN_PREFIX}/login`,
    element: <GuestGuard><Login /></GuestGuard>,
  },
  {
    path: ADMIN_PREFIX,
    element: <AuthGuard><MainLayout /></AuthGuard>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'users', element: <UserList /> },
      { path: 'depts', element: <DeptList /> },
      { path: 'roles', element: <RoleList /> },
      { path: 'menus', element: <MenuList /> },
      { path: 'products', element: <ProductList /> },
      { path: 'role-permission', element: <RolePermission /> },
      { path: 'messageList', element: <MessageList /> },
      { path: 'attachment', element: <AttachmentPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound404 />,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};