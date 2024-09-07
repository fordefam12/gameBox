function openGameDetailModal(game) {
    const modal = document.getElementById('gameDetailModal');
    modal.style.display = 'block';
    // Populate modal with game details
    document.getElementById('modalTitle').textContent = game.name;
    document.getElementById('modalDescription').textContent = game.description;
        document.getElementById('gameDetailModal').style.display = 'block';
      
      
  }
  
  function closeModal() {
    document.getElementById('gameDetailModal').style.display = 'none';
  }
  function createScreenshotCarousel(screenshots) {
    const carousel = document.getElementById('screenshotCarousel');
    carousel.innerHTML = '';
    screenshots.forEach((screenshot) => {
      const img = document.createElement('img');
      img.src = screenshot.image;
      carousel.appendChild(img);
    });
  }
  