const searchInput = document.getElementById('searchInput');
const suggestionBox = document.getElementById('suggestions');

searchInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  if (query.length >= 2) {
    const filteredGames = allGames.filter((game) =>
      game.toLowerCase().includes(query)
    );
    displaySuggestions(filteredGames);
  }
});

function displaySuggestions(suggestions) {
  suggestionBox.innerHTML = '';
  suggestions.forEach((game) => {
    const suggestionItem = document.createElement('div');
    suggestionItem.textContent = game;
    suggestionItem.addEventListener('click', () => {
      searchInput.value = game;
      searchGame(game);
      suggestionBox.innerHTML = '';  // Clear suggestions
    });
    suggestionBox.appendChild(suggestionItem);
  });
}
function filterByGenre(genre) {
    const filteredGames = allGames.filter(game => game.genres.includes(genre));
    renderGameList(filteredGames);
  }
  