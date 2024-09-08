let gameList = [];  // Global array to hold all games data
let fuse;  // Fuse.js instance for fuzzy searching

// Fetch the game list and prepare it for fuzzy search
function fetchGamesList() {
  const gamesListURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&page=1&page_size=100`;

  fetch(gamesListURL)
    .then((response) => response.json())
    .then((data) => {
      gameList = data.results.map(game => ({
        title: game.name,
        slug: game.slug,
        release_date: game.released,
        platforms: game.parent_platforms.map(platform => platform.platform.name).join(', ')
      }));

      // Initialize Fuse.js with the game list for fuzzy search
      fuse = new Fuse(gameList, {
        keys: ['title'],  // Search on the game title
        threshold: 0.3    // Adjust the threshold for similarity
      });
    })
    .catch((error) => console.error('Error fetching games list:', error));
}

// Call the function to load the games on page load
fetchGamesList();

// Function to handle fuzzy search based on user input
function fuzzySearch(query) {
  if (!fuse) return;  // Ensure Fuse.js is initialized

  const results = fuse.search(query);  // Get search results
  if (results.length > 0) {
    displayGameDetails(results[0].item);  // Display the best match
  } else {
    console.log('No exact match found.');
    displaySuggestions(fuse.search(query, { limit: 5 }));  // Display suggestions
  }
}

// Function to display game details in the UI
function displayGameDetails(game) {
  console.log(`Displaying details for: ${game.title}`);
  // Add your code to update the UI with the game details, e.g., game.title, game.release_date, game.platforms, etc.
}

// Function to display suggestions for similar games
function displaySuggestions(suggestions) {
  const suggestionsList = document.getElementById("suggestionsList");
  suggestionsList.innerHTML = "";  // Clear previous suggestions
  if (suggestions.length > 0) {
    let suggestionsHTML = "<ul>";
    suggestions.slice(0, 5).forEach(suggestion => {
      suggestionsHTML += `<li onclick="selectGame('${suggestion.item.title}')">${suggestion.item.title}</li>`;
    });
    suggestionsHTML += "</ul>";
    suggestionsList.innerHTML = suggestionsHTML;
  } else {
    suggestionsList.innerHTML = "<p>No similar games found.</p>";
  }
}

// Function to select a game from the suggestions
function selectGame(gameTitle) {
  document.getElementById("searchInput").value = gameTitle;
  document.getElementById("suggestionsList").innerHTML = "";  // Clear suggestions
}

// Event listener for real-time search input
document.getElementById("searchInput").addEventListener('input', function () {
  const query = this.value;
  if (query.length > 2) {
    fuzzySearch(query);  // Call fuzzy search when input length is greater than 2
  } else {
    document.getElementById("suggestionsList").innerHTML = "";  // Clear suggestions
  }
});
