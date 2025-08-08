import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import Layout from './pages/Layout';
import OtherApp from './pages/OtherApp'
import NoPage from './pages/NoPage';
import Tests from './pages/Tests';
import DiscordClone from './pages/DiscordClone';
import Game from './pages/GameTest';
import Test2 from './pages/Symbols';
import reportWebVitals from './reportWebVitals';

export default function Main() {
  return (
    <BrowserRouter basename="/react-app-0">
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<App />} />
          <Route path='other' element={<OtherApp />} />
          <Route path='testing' element={<Tests />} />
          <Route path='discordclone' element={<DiscordClone />} />
          <Route path='*' element={<NoPage />} />
          <Route path='plat0' element={<Game />} />
          <Route path='symbols' element={<Test2 />} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
