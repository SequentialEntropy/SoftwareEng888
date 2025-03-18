/**
 * vite.config.js - Vite configuration file 
 * 
 * @file Configures Vite for the React project including plugin settings 
 * @author Carina Jose 
 * @author Amreet Dhillon
 * @version 1.0.0
 * @since 14-02-2025
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/**
 * Exports the Vite configuration 
 * 
 * @returns {Object} the Vite configuration object
 */
export default defineConfig({
    plugins: [react()], // Enables React support in Vite
    server: {
        allowedHosts: ["climate.genkiasahi.com"]
    }
})
