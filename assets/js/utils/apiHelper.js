let gameList = [];  // Array to hold all games data

// Fetch the game list and prepare it for fuzzy search
export function fetchGamesList(rawgAPIKey) {
  const gamesListURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&page=1&page_size=100`;

  return fetch(gamesListURL)
    .then((response) => response.json())
    .then((data) => {
      gameList = data.results.map(game => ({
        title: game.name,
        slug: game.slug,
        release_date: game.released,
        platforms: game.parent_platforms.map(platform => platform.platform.name).join(', ')
      }));
      return gameList;
    })
    .catch((error) => console.error('Error fetching games list: ', error));
}

// Function to get the prepared game list
export function getGameList() {
  return gameList;
}
