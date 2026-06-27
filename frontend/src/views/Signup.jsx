import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignup(e) {
        e.preventDefault();

        const { data, error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password: password,
        });

        if (error) {
            alert(error.message);
            return;
        }

        console.log('Signup data:', data);

        alert('Account created successfully! You can now log in.');
        navigate('/login');
    }

    return (
        <main>
            <h2>Create Account</h2>

            <form onSubmit={handleSignup}>
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>

                <br />

                <button type="submit">Sign Up</button>
            </form>
        </main>
    );
}

export default Signup;