import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import updateScore from './sockets/updateScore.js';
import authRoute from './routes/authRoute.js';
import playerRouter from './routes/playerRoute.js'
import tournamentRoute from './routes/tournamentRoute.js';
import matchRoute from './routes/matchRoute.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: true,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

io.on('connection', (socket) => {
    console.log('New player connected');
    updateScore(io, socket);
    socket.on('disconnect', () => {
        console.log('Player disconnected');
    });
});

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoute);
app.use('/api/player', playerRouter);
app.use('/api/tournament', tournamentRoute);
app.use('/api/match', matchRoute);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
});
