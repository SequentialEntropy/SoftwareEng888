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
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    },
    build: {
        outDir: path.resolve(__dirname, '../backend/templates'), // Output to Django's static folder
        emptyOutDir: true,  // Clear previous builds
        assetsDir: "static"
    }
})
