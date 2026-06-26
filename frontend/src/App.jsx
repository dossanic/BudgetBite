import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Signup from './views/Signup';
import { supabase } from './supabaseClient';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        }

        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <BrowserRouter>
            <Header user={user} />

            <main>
                <Routes>
                    <Route
                        path="/"
                        element={user ? <Dashboard /> : <Navigate to="/login" />}
                    />

                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;