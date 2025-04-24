import express from 'express';
import cors from 'cors';
require('dotenv').config();

//Import Environment Variables
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

//Setup Middlewares
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Import controllers

import videoController from './controllers/video.controller'

//Mount API routes
app.use('/api/video', videoController)

//Run NodeJS Server on port
const startServer = async () => {
    try {

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}/api`);
        });

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('Shutting down server...');
            process.exit(0);
        });

    } catch (error) {
        console.error('Error while starting the server', error);
        process.exit(1);
    }
}

startServer();