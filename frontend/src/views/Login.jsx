import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Login() {
    const navigate = useNavigate();

    // Stores what the user types
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handles login when the form is submitted
    async function handleLogin(e) {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            // Save the logged-in user
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Login successful!');

            // Send user back to Dashboard
            navigate('/');
        }
    }

    return (
        <main>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label><br />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label><br />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit">Login</button>
            </form>
        </main>
    );
}

export default Login;