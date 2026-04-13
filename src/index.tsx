import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './i18n'; 
import 'antd/dist/reset.css';
// 引入全局CSS（关键）
import './assets/css/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);