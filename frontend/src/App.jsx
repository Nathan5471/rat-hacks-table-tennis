import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments'
import Leaderboard from './pages/Leaderboard';
import Tournament from './pages/Tournament';
import Match from './pages/Match';
import Player from './pages/Player';
import { SocketProvider } from './contexts/SocketContext';
import MatchJudge from './pages/MatchJudge';
import MatchLiveView from './pages/MatchLiveView';

function App() {
    return (
        <SocketProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<AuthenticatedRoute />}>
                    <Route path="/app/home" element={<Home />} />
                    <Route path="/app/tournaments" element={<Tournaments />} />
                    <Route path="/app/leaderboard" element={<Leaderboard />} />
                    <Route path="/app/tournament/:id" element={<Tournament />} />
                    <Route path="/app/match/:id" element={<Match />} />
                    <Route path="/app/player/:id" element={<Player />} />
                    <Route path="/app/match/:id/judge" element={<MatchJudge />} />
                    <Route path="/app/match/:id/liveView" element={<MatchLiveView />} />
                </Route>
                <Route path="*" element={<Navigate to="/app/home" replace />} />
            </Routes>
        </Router>
        </SocketProvider>
    )
}

export default App
