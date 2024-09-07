const cache = {};

async function fetchWithCache(url) {
  if (cache[url]) {
    return cache[url];
  }
  const response = await fetch(url);
  const data = await response.json();
  cache[url] = data;
  return data;
}
function cacheGameData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  function getCachedGameData(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  