/**
 * main.jsx - Entry point for the React application 
 * 
 * @file Initialises the React app and renders the root component 
 * @author Carina Jose 
 * @author Amreet Dhillon 
 * @version 1.0.0
 * @since 18-02-2025
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/**
 * Renders the root React component inside the 'root' div in the HTML file 
 * Uses React's StrictMode to highlight the potential problems in the application 
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
