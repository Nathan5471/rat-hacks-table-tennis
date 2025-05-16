import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import playerRouter from './routes/playerRoute.js'
import tournamentRoute from './routes/tournamentRoute.js';
import matchRoute from './routes/matchRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use('/api/auth', authRoute);
app.us('/api/player', playerRouter);
app.use('/api/tournament', tournamentRoute);
app.use('/api/match', matchRoute);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
});
