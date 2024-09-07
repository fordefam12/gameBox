const fuseOptions = {
    keys: ['name'], // Adjust this to match your game's structure
    threshold: 0.3, // Adjust this to increase/decrease match sensitivity
  };
  
  // Sample data (replace with fetched game data)
  const games = [
    { name: "Game A" },
    { name: "Game B" },
    { name: "Game C" }
  ];
  
  const fuse = new Fuse(games, fuseOptions);
  
  function fuzzySearch(input) {
    const result = fuse.search(input);
    displaySearchResults(result);
  }
  
  // Update your search event listener to call fuzzySearch
  searchInput.addEventListener('input', function() {
    const inputVal = searchInput.value;
    fuzzySearch(inputVal);
  });
  