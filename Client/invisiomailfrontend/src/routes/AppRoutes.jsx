import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/Notfound';
import { Layout } from '../layout/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Wrap your layout around all nested routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />           {/* path="/" */}
        <Route path="about" element={<About />} />   {/* path="/about" */}
        <Route path="*" element={<NotFound />} />    {/* path="*" inside layout */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
