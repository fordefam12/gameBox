function showNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body: message });
        }
      });
    }
  }
  
  // Example: Monitor wishlist price drops (use an API to check for price changes)
  function checkPriceDrops() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.forEach(game => {
      // API call to check for price change
      fetch(`https://api.rawg.io/api/games/${game.slug}?key=${rawgAPIKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.price < game.storedPrice) {
            showNotification('Price Drop!', `${game.title} is now $${data.price}`);
          }
        });
    });
  }
  
  // Call this function periodically (every hour, for example)
  setInterval(checkPriceDrops, 3600000); // 1 hour
  