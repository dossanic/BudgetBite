import React, { useState } from 'react';

function SearchBar(){
    //create state variable to hold text as the user types
    const [searchTerm, setSearchTerm] = useState('');

    //handle what happens when the user types in the search bar
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    //handle form submission
    const handleFormSubmit = (event) => {
        event.preventDefault(); //prevent browser from refreshing on form submit

        if (searchTerm.trim() === '') {
            console.log('Searching database/API for:', searchTerm.trim());
            //where we call Edamam fetch function
        }
    };

    return (
        <form className="search-form" onSubmit={handleFormSubmit}>
            <label htmlFor="pantry-search">Enter an ingredient:</label>
            <div className="search-row">
                <input
                    id="pantry-search" 
                    type="text" 
                    placeholder="Enter ingredients..." 
                    value={searchTerm}      // bind input value to state variable
                    onChange={handleInputChange} //updates state when key is pressed
                />
                <button type="submit">Search</button>
            </div>
        </form>
    );
}

export default SearchBar;