function fetchCachedData(url) {
    const cachedData = localStorage.getItem(url);
    if (cachedData) {
      return Promise.resolve(JSON.parse(cachedData));
    }
  
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        localStorage.setItem(url, JSON.stringify(data));
        return data;
      });
  }
  
  // Example usage in your script
  fetchCachedData(`https://api.rawg.io/api/games/${gameSlug}?key=${rawgAPIKey}`)
    .then(data => {
      console.log('Fetched data:', data);
    });
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours

    function isCacheExpired(key) {
      const timestamp = localStorage.getItem(`${key}-timestamp`);
      if (!timestamp) return true;
      const currentTime = Date.now();
      return currentTime - parseInt(timestamp) > cacheDuration;
    }
    
    function fetchDataWithCache(url) {
      if (isCacheExpired(url)) {
        localStorage.removeItem(url);
        localStorage.removeItem(`${url}-timestamp`);
      }
    
      return fetchCachedData(url);
    }
    