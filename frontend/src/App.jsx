import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Home from './pages/Home';
import Tournament from './pages/Tournament';
import Match from './pages/Match';
import Player from './pages/Player';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<AuthenticatedRoute />}>
                    <Route path="/app/home" element={<Home />} />
                    <Route path="/app/tournament/:id" element={<Tournament />} />
                    <Route path="/app/match/:id" element={<Match />} />
                    <Route path="/app/player/:id" element={<Player />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
