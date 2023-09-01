import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './features/axios/redux/app/store';
import './index.css';
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-tailwind/react";
import App from './App';


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
        <Provider store={store}>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </Provider>
  </React.StrictMode>
);