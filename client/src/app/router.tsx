import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout.js';
import Home from '../pages/Home.js';
import Login from '../pages/Login.js';
import AdminDashboard from '../pages/AdminDashboard.js';
import LeadDetail from '../pages/LeadDetail.js';
import ProtectedRoute from '../components/admin/ProtectedRoute.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'lead/:id',
        element: (
          <ProtectedRoute>
            <LeadDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: (
          <div className="flex-1 flex flex-col justify-center items-center py-20 text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2 font-display">404 — Not Found</h2>
            <p className="text-sm text-slate-500 mb-6">The page you are looking for doesn't exist.</p>
            <a href="/" className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold">
              Go Home
            </a>
          </div>
        ),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
export default AppRouter;
