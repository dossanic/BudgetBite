import React from 'react';

// Header component
function Header() {
    return (

        
        <header>
            {/* webpage header */}
            <div>
                <h1>BudgetBite</h1>
            </div>

            {/* navigation links */}
            <nav>
                <ul>
                    <li>
                        <a href="#search">Find Recipes</a>
                    </li>
                    <li>
                        <a href="#saved">Saved Recipes</a>
                    </li>
                </ul>
            </nav>

            {/* user will be able to login later */}
            <div>
                <span>Welcome, User</span>
            </div>


        </header>
    );
}

//allow other files to import Header
export default Header;