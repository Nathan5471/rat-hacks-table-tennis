import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Home from './pages/Home';
import Tournament from './pages/Tournament';
import Match from './pages/Match';
import Player from './pages/Player';
import { SocketProvider } from './contexts/SocketContext';
import MatchJudge from './pages/MatchJudge';
import MatchLiveView from './pages/MatchLiveView';
import { Socket } from 'socket.io-client';

function App() {
    return (
        <SocketProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<AuthenticatedRoute />}>
                    <Route path="/app/home" element={<Home />} />
                    <Route path="/app/tournament/:id" element={<Tournament />} />
                    <Route path="/app/match/:id" element={<Match />} />
                    <Route path="/app/player/:id" element={<Player />} />
                    <Route path="/app/match/:id/judge" element={<MatchJudge />} />
                    <Route path="/app/match/:id/liveView" element={<MatchLiveView />} />
                </Route>
            </Routes>
        </Router>
        </SocketProvider>
    )
}

export default App
