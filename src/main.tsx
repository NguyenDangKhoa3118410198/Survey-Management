import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      form={{
        validateMessages: {
          required: '${label} là bắt buộc!',
          types: {
            email: '${label} không đúng định dạng email!',
            number: '${label} phải là số!',
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
