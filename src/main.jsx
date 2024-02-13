import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {UserProvider} from "./contexts/UserContext.jsx";
import {NamesProvider} from "./contexts/NamesContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
        <NamesProvider>
            <App />
        </NamesProvider>
    </UserProvider>
  </React.StrictMode>,
)
