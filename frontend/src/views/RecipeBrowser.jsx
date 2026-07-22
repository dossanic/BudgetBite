import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
const { DEFAULT_PAGE_SIZE, DEFAULT_SORT_MODE } = require('../constants');
const { recipeBrowserStyles } = require('./recipeBrowserStyles');
const { fetchRecipesWithBudgets, fetchRecipesList, fetchFavorites, addFavorite, removeFavorite } = require('../services/apiService');

// Compares two recipe titles for A-Z sorting, pushing titles that don't start with a letter (e.g. leading quotes) after titles starting with Z
function compareTitlesAlphabetically(titleA, titleB) {
  const a = titleA || '';
  const b = titleB || '';
  const aStartsWithLetter = /^[a-z]/i.test(a);
  const bStartsWithLetter = /^[a-z]/i.test(b);

  if (aStartsWithLetter && !bStartsWithLetter) return -1;
  if (!aStartsWithLetter && bStartsWithLetter) return 1;
  return a.localeCompare(b);
}

// RecipeBrowser component allows users to search for recipes and view them in a paginated format
function RecipeBrowser({ user }) {
  const navigate = useNavigate();
  const [favoritedIds, setFavoritedIds] = useState(() => new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeQuery, setActiveQuery] = useState('recipes'); // Default active query to 'recipes' for initial load
  const [currentPage, setCurrentPage] = useState(1); // Track the current page number for pagination
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages available for the current search query
  const [totalHits, setTotalHits] = useState(0); // Track the total number of hits returned by the API for the current search query
  const [pageHistory, setPageHistory] = useState([]); // Track the history of page URLs for navigating back to previous pages
  const [currentPageUrl, setCurrentPageUrl] = useState(null); // Track the URL of the current page for API requests
  const [nextPageUrl, setNextPageUrl] = useState(null); // Track the URL of the next page for API requests
  const [sortMode, setSortMode] = useState(DEFAULT_SORT_MODE); // Track the current sort mode, defaulting to the shared default
  const pageSize = DEFAULT_PAGE_SIZE; // Use the shared default page size for pagination

  // Use useEffect to fetch all recipes on initial component mount
  useEffect(() => {
    handleInitialLoad();
  }, []);

  useEffect(() => {
    fetchFavorites(user.id)
      .then((data) => setFavoritedIds(new Set((data.favorites || []).map((r) => r.id))))
      .catch((err) => console.error("Recipe Browser Favorites Fetch Error:", err));
  }, [user.id]);

  const toggleFavorite = (recipe) => {
    const isFavorited = favoritedIds.has(recipe.id);

    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (isFavorited) next.delete(recipe.id);
      else next.add(recipe.id);
      return next;
    });

    const request = isFavorited ? removeFavorite(user.id, recipe.id) : addFavorite(user.id, recipe);
    request.catch((err) => console.error("Recipe Browser Favorite Toggle Error:", err));
  };

  // Handle input change for the search query
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission for searching recipes based on the user's input query
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim(); // Trim whitespace from the search query to avoid unnecessary API calls with empty or whitespace-only queries
    if (trimmedQuery) {
      executeSearch(trimmedQuery, 1); // Execute search with the trimmed query and reset to page 1
    }
  };

  // Function to fetch recipes sorted alphabetically (A-Z) with pagination
  const fetchAlphabetizedRecipes = async (query, page = 1) => {
    const collectedRecipes = [];
    let currentPage = 1;
    let currentNextUrl = null;
    const maxResults = 250;

    // Loop to fetch recipes until the maximum number of results is reached or there are no more pages available
    while (collectedRecipes.length < maxResults && (currentPage === 1 || currentNextUrl)) {
      // Was: fetchRecipesWithBudgets([query], { page: currentPage, pageSize: DEFAULT_PAGE_SIZE, nextUrl: currentNextUrl, sortMode: DEFAULT_SORT_MODE });
      // Switched to fetchRecipesList since these cards never display cost/missing-ingredients info,
      // and the old call fired 2 extra network calls (one potentially hitting Groq) per recipe.
      const pageResult = await fetchRecipesList(query, {
        page: currentPage,
        pageSize: DEFAULT_PAGE_SIZE,
        nextUrl: currentNextUrl,
        sortMode: DEFAULT_SORT_MODE
      });

      // If no recipes are returned for the current page, break the loop to avoid unnecessary API calls
      const pageRecipes = pageResult.recipes || [];
      collectedRecipes.push(...pageRecipes);

      // Update the next page URL for the next iteration of the loop
      currentNextUrl = pageResult.pagination?.nextPageUrl || null;
      if (!currentNextUrl) break;
      currentPage += 1;
    }

    // Sort the collected recipes alphabetically by title, treating titles that don't start with a letter (e.g. leading quotes) as coming after Z
    const sortedRecipes = [...collectedRecipes].sort((a, b) => compareTitlesAlphabetically(a.title, b.title));
    const startIndex = (page - 1) * pageSize;
    const pagedRecipes = sortedRecipes.slice(startIndex, startIndex + pageSize);

    // Return the paginated and sorted recipes along with pagination information
    return {
      recipes: pagedRecipes,
      allRecipes: sortedRecipes,
      pagination: {
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(sortedRecipes.length / pageSize)),
        totalHits: sortedRecipes.length,
        nextPageUrl: null
      }
    };
  };

  // Function to execute the search for recipes based on the provided query, page number, and optional page URL for pagination
  const executeSearch = async (query, page = 1, pageUrl = null, requestedSortMode = sortMode) => {
    setLoading(true);
    setError(null);
    setRecipes([]); // Clear previous recipes before fetching new results

    // Reset page history if starting a new search from the first page
    if (page === 1) {
      setPageHistory([]);
    }

    try {
      const shouldSortAlphabetically = requestedSortMode === 'az';
      let result;
      if (shouldSortAlphabetically) {
        result = await fetchAlphabetizedRecipes(query, page);
        setAllRecipes(result.allRecipes || []);
      } else {
        // Was: fetchRecipesWithBudgets([query], { page, pageSize, nextUrl: pageUrl, sortMode });
        // Switched to fetchRecipesList -- see note in fetchAlphabetizedRecipes above.
        result = await fetchRecipesList(query, { page, pageSize, nextUrl: pageUrl, sortMode });
        setAllRecipes(result.recipes || []);
      }

      setActiveQuery(query);
      setRecipes(result.recipes || []);
      setCurrentPage(result.pagination?.page || page);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotalHits(result.pagination?.totalHits || 0);
      setCurrentPageUrl(pageUrl || null);
      setNextPageUrl(result.pagination?.nextPageUrl || null);
    } catch (err) {
      console.error("Recipe Browser Fetch Error:", err);
      setError("Failed to fetch recipes from Edamam.");
    } finally {
      setLoading(false);
    }
  };

  const handleInitialLoad = () => {
    setSearchQuery('');
    setSortMode('az');
    executeSearch('recipes', 1, null, 'az');
  };

  // Handle pagination when the user clicks on the "Next" or "Previous" buttons
  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (sortMode === 'az') {
      const startIndex = (nextPage - 1) * pageSize;
      const pagedRecipes = allRecipes.slice(startIndex, startIndex + pageSize);
      setRecipes(pagedRecipes);
      setCurrentPage(nextPage);
      return;
    }

    // Determine the appropriate page URL for the next page based on the current page and page history
    if (nextPage === currentPage + 1) { // Handle going to the next page
      setPageHistory((prev) => [...prev, currentPageUrl]);
      executeSearch(activeQuery, nextPage, nextPageUrl);
      return;
    }

    // Handle going to a specific page (not just next or previous)
    if (nextPage === currentPage - 1) { // Handle going back to the previous page
      const previousPageUrl = pageHistory[pageHistory.length - 1] || null;
      setPageHistory((prev) => prev.slice(0, -1));
      executeSearch(activeQuery, nextPage, previousPageUrl);
    }
  };

  const styles = recipeBrowserStyles;

  return (
    <section style={styles.container}>
      {/* 👇 Added centering layout node */}
      <div style={styles.contentWrapper}>
        <h2 style={styles.heading}>Explore Recipes</h2>

        <div style={styles.actionsRow}>
          <form onSubmit={handleFormSubmit} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search for recipes (e.g., lasagna, tacos)..."
              value={searchQuery}
              onChange={handleInputChange}
              style={styles.input}
              className="bb-input"
            />
            <button type="submit" style={styles.button} className="bb-btn-primary">Search</button>
          </form>
        </div>

        {loading && <p style={styles.loadingText}>🍊 Loading recipes...</p>}
        {error && <p style={styles.errorText}>{error}</p>}

        {!loading && recipes.length > 0 && (
          <>
            {/* <p style={styles.paginationInfo}>Showing {recipes.length} of {totalHits} recipes • Page {currentPage} of {totalPages}</p> */}
            <div style={styles.grid}>
              {recipes.map((recipe, index) => (
                <div
                  key={recipe.id || index}
                  style={{ ...styles.card, cursor: 'pointer' }}
                  className="bb-card"
                  onClick={() => navigate(`/recipes/${encodeURIComponent(recipe.id)}`)}
                >
                  <FavoriteButton
                    filled={favoritedIds.has(recipe.id)}
                    onToggle={() => toggleFavorite(recipe)}
                    overlay
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  />
                  {recipe.image && (
                    <img src={recipe.image} alt={recipe.title} style={styles.image} />
                  )}
                  <h4 style={styles.title}>{recipe.title || "Untitled Recipe"}</h4>
                  <p style={styles.source}>Source: <em>{recipe.source || "Unknown Source"}</em></p>
                  <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer" style={styles.link} className="bb-link" onClick={(e) => e.stopPropagation()}>
                    View Full Recipe Instructions
                  </a>
                </div>
              ))}
            </div>

            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage <= 1 ? styles.paginationButtonDisabled : {})
                }}
                className="bb-pagination-btn"
              >
                Previous
              </button>
              <span style={styles.paginationInfo}>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{
                  ...styles.paginationButton,
                  ...(currentPage >= totalPages ? styles.paginationButtonDisabled : {})
                }}
                className="bb-pagination-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default RecipeBrowser;