import { Route, Routes } from 'react-router-dom';

import About from '../pages/About';
import AnimatedAboutPage from '../pages/About';
import ComposeEmail from '../pages/ComposeEmail';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../layout/Dashboardlayout';
import EmailAnalytics from '../pages/EmailAnalytics';
import EmailContentView from '../pages/EmailContentView';
import Home from '../pages/Home';
import { Layout } from '../layout/Layout';
import LoginPage from '../pages/LoginPage';
import NotFound from '../pages/NotFound';
import React from 'react';

const AppRoutes = () => {
  return (
    <Routes>
    
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />           
        <Route path="about" element={<About />} />  
        <Route path="login" element={<LoginPage />} />  
        <Route path="*" element={<NotFound />} /> 
      </Route>


      <Route element={<DashboardLayout/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/email/:emailId" element={<EmailContentView />} />
        <Route path="analytics" element={<EmailAnalytics />} />
        <Route path="/email/send" element= {<ComposeEmail/>}/>
        <Route path="/about" element={<AnimatedAboutPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
