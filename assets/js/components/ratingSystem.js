function renderRatingStars(rating) {
    const starContainer = document.getElementById('ratingStars');
    starContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = i < rating ? 'filled-star' : 'empty-star';
      starContainer.appendChild(star);
    }
  }
  function addRating(gameId, rating) {
    // Store rating in local storage or send to backend
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    ratings[gameId] = rating;
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }
  
  function getRating(gameId) {
    const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    return ratings[gameId] || 0;
  }
  