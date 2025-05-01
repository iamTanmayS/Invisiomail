import { Route, Routes } from 'react-router-dom';

import About from '../pages/About';
import ComposeEmail from '../pages/ComposeEmail';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layout/Dashboardlayout';
import EmailContentView from '../pages/EmailContentView';
import Home from '../pages/Home';
import { Layout } from '../layout/Layout';
import LoginPage from '../pages/LoginPage';
import NotFound from '../pages/NotFound';
import React from 'react';

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
        <Route path="/email/:emailId" element={<EmailContentView />} />
        <Route path="/email/send" element= {<ComposeEmail/>}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
