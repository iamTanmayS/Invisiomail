import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import { Layout } from '../layout/Layout';
import LoginPage from '../pages/LoginPage';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layout/Dashboardlayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Wrap your layout around all nested routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />           {/* path="/" */}
        <Route path="about" element={<About />} />  
        <Route path="login" element={<LoginPage />} />  {/* path="/about" */}
        
        <Route path="*" element={<NotFound />} />    {/* path="*" inside layout */}
      </Route>


      <Route element={<DashboardLayout/>}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
