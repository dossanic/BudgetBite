import React from 'react';

// Header component
function Header() {
    return (

        
        <header className="header">
            {/* webpage header */}
            <div>
                <h1 className="logo">BudgetBite</h1>
            </div>

            {/* navigation links */}
            <nav>
                <ul className="nav-links">
                    <li>
                        <a href="#search">Find Recipes</a>
                    </li>
                    <li>
                        <a href="#saved">Saved Recipes</a>
                    </li>
                </ul>
            </nav>

            {/* user will be able to login later */}
            <div className="user-box">
                <span>Welcome, User</span>
            </div>


        </header>
    );
}

//allow other files to import Header
export default Header;