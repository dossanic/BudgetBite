import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function Signup() {

    // Stores the information entered by the user
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Creates a new account in Supabase
    async function handleSignup(e) {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Account created successfully!');
        }
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
                    />
                </div>

                <br />

                <button type="submit">
                    Sign Up
                </button>

            </form>

        </main>
    );
}

export default Signup;