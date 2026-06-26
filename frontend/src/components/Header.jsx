import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Header({ user }) {
    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate('/login');
    }

    return (
        <header>

            <h1>BudgetBite</h1>

            <nav>
                <ul>
                    {user && (
                        <>
                            <li><Link to="/">Dashboard</Link></li>
                        </>
                    )}

                    {!user && (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Sign Up</Link></li>
                        </>
                    )}
                </ul>
            </nav>

            {user && (
                <button onClick={handleLogout}>
                    Logout
                </button>
            )}

        </header>
    );
}

export default Header;