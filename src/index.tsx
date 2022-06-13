import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { App } from 'App';
import { BrowserRouter } from 'react-router-dom';
import { css, Global } from '@emotion/react';
import 'terminal.css';
import 'aesthetic-css/aesthetic.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Global
        styles={css`
          :root {
            --global-font-size: 15px;
            --global-line-height: 1.4em;
            --global-space: 10px;
            --font-stack: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace,
              serif;
            --mono-font-stack: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace,
              serif;
            --background-color: #222225;
            --page-width: 60em;
            --font-color: #e8e9ed;
            --invert-font-color: #222225;
            --secondary-color: #a3abba;
            --tertiary-color: #a3abba;
            --primary-color: #62c4ff;
            --error-color: #ff3c74;
            --progress-bar-background: #3f3f44;
            --progress-bar-fill: #62c4ff;
            --code-bg-color: #3f3f44;
            --input-style: solid;
            --display-h1-decoration: none;
          }
        `}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
