function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
  }
  
  function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
  }
  
  // Usage in API call
  showLoadingSpinner();
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      hideLoadingSpinner();
      // Handle data
    })
    .catch((error) => {
      hideLoadingSpinner();
      console.error(error);
    });
  