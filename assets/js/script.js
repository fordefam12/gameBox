const rawgAPIKey = "afe2446d033e4b5197325726cd2f5fb8";
const fullGameList = `https://api.rawg.io/api/games?key=${rawgAPIKey}`;
var wishlistArray = [];
const modalWindow = document.getElementById("modalWindow");
const saveEl = document.getElementById("saveBtn");
const input = document.getElementById("query");
const wishlist = document.getElementById("wishlist-id");
const wishlistCount = document.getElementById("wishlist-count");
const searchButton = document.getElementById("searchButton");
const gameNameInput = document.getElementById("gameNameInput");
const gamePKInput = document.getElementById("gamePKInput");

const gamesListContainer = document.getElementById("gamesList");
const page = 1; // Page number
const pageSize = 100; // Number of games per page
const apiUrl = `https://api.rawg.io/api/games?key=${rawgAPIKey}&page=${page}&page_size=${pageSize}`;



// Function to fetch and display the list of games
function fetchGamesList() {
  const gamesListURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&page=${page}&page_size=${pageSize}`;

  const datalist = document.getElementById("games-datalist");

  fetch(gamesListURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const gameNames = data.results.map((game) => game.name);

        // Clear the existing options
        datalist.innerHTML = "";

        // Populate the datalist with game names
        gameNames.forEach((gameName) => {
          const option = document.createElement("option");
          option.value = gameName;
          datalist.appendChild(option);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching games list: ", error);
    });
    console.log(gamesListURL);
}
// Call the function to fetch and display the games list
fetchGamesList();

AOS.init();

// Function to show the modal
const alertModal = document.getElementById("alertModal"); // Assuming you have an alert modal element with this ID

function showAlertModal(message) {
  const alertMessage = document.getElementById("alertMessage"); // Assuming you have an element to display the message in your alert modal
  alertMessage.textContent = message;
  alertModal.style.display = "block";
}

// Function to hide the custom alert modal
function hideAlertModal() {
  alertModal.style.display = "none";
}

// Function to clear the game details container
function clearGameDetailsContainer() {
  const videoGameContainerParent = document.getElementById("vgImages");
  videoGameContainerParent.innerHTML = "";
}

// Function to clear the previous game images
function clearPreviousGameImages() {
  const videoGameContainer = document.getElementById("vgImages");
  videoGameContainer.innerHTML = "";
}
function toggleMenu() {
  const nav = document.getElementById('navMenu');
  nav.classList.toggle('is-active');
}

// Function to render items in the wishlist as <li> elements
function renderWishlist() {
  // Clear wishlist element and update wishlist count
  wishlist.innerHTML = "";
  const wishlistArray = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlistCount.textContent = wishlistArray.length;

  wishlistArray.forEach((wishlistGame, i) => {
    const li = document.createElement("button");
    
    // Check if wishlistGame is an object or a string
    if (typeof wishlistGame === 'object' && wishlistGame.title) {
      // It's an object, use the title property
      li.textContent = wishlistGame.title;
    } else {
      // It's a string, use the string value directly
      li.textContent = wishlistGame;
    }
    li.setAttribute("data-index", i);
    li.classList.add("liStyles");
    li.style.cssText = `
      margin-right: 1%;
      margin-bottom: 4%;
      background-color: hsl(204, 86%, 53%);
      width: 75%;
      color: white;
      border-radius: 2px;
      border: none;
      padding: 3%;
      display: flex;
      justify-content: space-between;
    `;

    const removeButton = document.createElement("button");
removeButton.style.cssText = `
  margin-left: 1%;
  background-color: hsl(348, 100%, 61%);
  border: 1px solid rgba(255, 182, 182, 0.534);
  padding: 1%;
  display: flex;
  height: 25px;
`;
removeButton.classList.add("removebuttonstyle", "fa", "fa-remove");
removeButton.textContent = "";

// Set the correct game title or slug in the dataset
removeButton.dataset.game = wishlistGame.title || wishlistGame.slug || wishlistGame; 

removeButton.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent triggering the game search when removing
  const gameTitle = event.target.getAttribute("data-game");
  
  // Correct the comparison by using the relevant property (e.g., title or slug)
  const updatedWishlist = wishlistArray.filter(
    (game) => game.title !== gameTitle && game.slug !== gameTitle
  );

  // Update localStorage and re-render the wishlist
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  renderWishlist();
});

// Function to handle mouseover and mouseout events for styling
const addMouseOverAndOutEvents = (element, stylesOnMouseOver, stylesOnMouseOut) => {
  element.addEventListener("mouseover", () => {
    element.style.cssText = stylesOnMouseOver;
  });

  element.addEventListener("mouseout", () => {
    element.style.cssText = stylesOnMouseOut;
  });
};

// Apply hover effects for remove button
addMouseOverAndOutEvents(
  removeButton,
  `
  margin-left: 1%;
  background-color: hsl(348, 100%, 61%);
  border: none;
  padding: 1%;
  cursor: pointer;
  display: flex;
  height: 25px;
`,
  `
  margin-left: 1%;
  background-color: hsl(348, 100%, 61%);
  border: 1px solid rgba(255, 182, 182, 0.534);
  padding: 1%;
  height: 25px;
`
);

// Apply hover effects for the list item
addMouseOverAndOutEvents(
  li,
  `
  margin-right: 1%;
  margin-bottom: 4%;
  background-color: hsl(204, 86%, 53%);
  width: 75%;
  color: white;
  border-radius: 2px;
  border: none;
  padding: 3%;
  display: flex;
  justify-content: space-between;
`,
  `
  margin-right: 1%;
  margin-bottom: 4%;
  background-color: hsl(204, 86%, 53%);
  width: 75%;
  color: white;
  border-radius: 2px;
  border: 1px solid blue;
  padding: 3%;
  display: flex;
  justify-content: space-between;
`
);

// Event listener to handle clicking the list item to trigger search
li.addEventListener("click", () => {
  const gameSlug = wishlistGame.slug || wishlistGame.title || wishlistGame;
  const videoGameContainerParent = document.getElementById("vgImages");
  videoGameContainerParent.innerHTML = ""; // Clear existing game images
  searchGame(gameSlug); // Trigger game search
  console.log(gameSlug);
});

li.appendChild(removeButton);
wishlist.appendChild(li);
  });
}

// Function to initialize the page
function init() {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (wishlistItems !== null) {
    wishlistArray = wishlistItems;
  }
  renderWishlist();
}

// Function to store a game in the wishlist
function storeWishlist(gameTitle) {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Get the game slug from the title
  const gameSlug = gameTitle
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove non-letter, non-number, and non-space characters
    .replace(/\s+/g, '-') // Replace consecutive spaces with a single hyphen
    .toLowerCase();
    console.log(gameTitle);

  // Check if the game title is not already in the wishlist
  const gameExists = wishlistItems.some(item => {
    const savedGameTitle = item.title || item; // Check for both title and old structure
    return savedGameTitle === gameTitle;
  });

  // If the game is not in the wishlist, add it with title and slug
  if (!gameExists) {
    wishlistItems.push({
      title: gameTitle,
      slug: gameSlug
    });

    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    renderWishlist();
  }
}


// Function to fetch games in the same series
function fetchSeriesGames(gamePk, page = 1, page_size = 30) {
  const seriesGamesURL = `https://api.rawg.io/api/games/${gamePk}/game-series?page=${page}&page_size=${page_size}&key=${rawgAPIKey}`;

  fetch(seriesGamesURL)
    .then((response) => response.json())
    .then((data) => {
      // Check if there are series-related games
      if (data.results && data.results.length > 0) {
        displayRelatedGames(data.results);
        console.log(data.results);
      }
    })
    .catch((error) => {
      console.error("Error fetching series-related games:", error);
      
    });
}
// Define a sample pageLoadData object
const pageLoadData = {
  id: 12345, // Replace with the actual game ID
  game_series_count: 30, // Replace with the actual game series count
};

// Now you can use pageLoadData in your code
const gameSeriesCount = pageLoadData.game_series_count;
const gamePk = pageLoadData.id;

if (gameSeriesCount > 0) {
  // Fetch related games in the same series
  const seriesGamesURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&series_pk=${gamePk}&page_size=${gameSeriesCount}`;

  fetch(seriesGamesURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        // Display the list of related games in your UI
        displayRelatedGames(data.results);
        console.log(data.results);
      } else {
        console.error("No related games found in the series.");
        
      }
    })
    .catch((error) => {
      console.error("Error fetching related games in the series:", error);
    });
}
function displayRelatedGames(relatedGames) {
  // Clear any existing content
  const relatedGamesContainer = document.getElementById("relatedGames");
  relatedGamesContainer.innerHTML = "";

  // Create a wrapper div to hold the game items
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("game-wrapper");

  relatedGames.forEach((game, index) => {
    const gameDiv = document.createElement("div");
    gameDiv.classList.add("related-game");

    // Create an image element for the game
    const gameImage = document.createElement("img");
    gameImage.src = game.background_image; // Set the image source based on your data

    // Create a paragraph element for the game name
    const gameName = document.createElement("p");
    gameName.textContent = game.name;

    // Add a click event listener to the image element
    gameImage.addEventListener("click", () => {
      // Trigger the searchGame function when the image is clicked
      searchGame(
        game.slug
      );
      console.log(game.slug);
    });

    // Append the image and name to the gameDiv
    gameDiv.appendChild(gameImage);
    gameDiv.appendChild(gameName);

    // Append the gameDiv to the wrapperDiv
    wrapperDiv.appendChild(gameDiv);

    // Add the "clear" class to start a new row after every three games
    if ((index + 1) % 3 === 0) {
      wrapperDiv.classList.add("clear");
    }
  });

  // Append the wrapperDiv to the relatedGamesContainer
  relatedGamesContainer.appendChild(wrapperDiv);
}
const seriesPage = 1;
const seriesPageSize = 10;
fetchSeriesGames(gamePk, seriesPage, seriesPageSize);

function searchGame(inputVal) {
  const specificGameURL = `https://api.rawg.io/api/games/${inputVal
    .replace(/\s+/g, "-")
    .toLowerCase()}?key=${rawgAPIKey}`;

    fetch(specificGameURL)
    .then((res) => {
      if (res.status === 404) {
        showAlertModal("Game not found.");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data === null) {
        hideAlertModal();
        return;
      }
      const videoGameTitle = document.querySelector("#vgTitle");
      videoGameTitle.textContent = data.name;
      saveEl.setAttribute("data-game", data.name);

      const videoGameRelease = document.querySelector("#releaseDate");
      videoGameRelease.textContent = `Released: ${data.released}`;

      const videoGameDescription = document.querySelector("#vgDescription");
      videoGameDescription.textContent = data.description_raw;

      const videoGameRating = document.querySelector("#vgRating");
      videoGameRating.textContent = data.esrb_rating.name || "";
// Check if 'data' is defined
if (data && data.name) {
  videoGameTitle.textContent = data.name;
  // Rest of the code that accesses 'data' properties
} else {
  console.error("Game data is undefined or missing 'name' property.");
}

      const videoGamePlatforms = document.querySelector("#vgPlatforms");
      const platformsString = data.parent_platforms
        .map((platform) => platform.platform.name)
        .join(", ");
      videoGamePlatforms.textContent = platformsString;

      clearPreviousGameImages();

      const videoGameContainer = document.getElementById("vgImages");
      const videoGameImage = document.createElement("img");
      videoGameContainer.appendChild(videoGameImage);

      const videoGameImageURLDynamic = data.background_image;
      const videoGameImageURLDynamic2 = data.background_image_additional;
      videoGameImage.setAttribute("src", videoGameImageURLDynamic);

      document.body.style.backgroundImage = `url('${videoGameImageURLDynamic2}')`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";

      const genreString = data.genres.map((genre) => genre.id).join(",");
      const genreURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&genres=${genreString}`;

      fetch(genreURL)
        .then(function (res) {
          return res.json();
        })
        .then(function (ratingData) {
          // console.log(ratingData);

          var game1 = data.name;
          var game2 = ratingData.results[1].name;
          var game3 = ratingData.results[2].name;
          var game4 = ratingData.results[3].name;
          var game5 = ratingData.results[4].name;

          var gameRating1 = data.rating;
          var gameRating2 = ratingData.results[0].rating;
          var gameRating3 = ratingData.results[1].rating;
          var gameRating4 = ratingData.results[2].rating;
          var gameRating5 = ratingData.results[3].rating;

          const ctx = document.getElementById("ratingChart");
          // destroy chart code
          var chartStatus = Chart.getChart("ratingChart"); // <canvas> id
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }

          new Chart(ctx, {
            type: "bar",
            data: {
              labels: [game1, game2, game3, game4, game5],
              datasets: [
                {
                  label: "Rating",

                  data: [
                    gameRating1,
                    gameRating2,
                    gameRating3,
                    gameRating4,
                    gameRating5,
                  ],
                  borderWidth: 2,
                  backgroundColor: "rgb(250, 6, 6)",
                },
              ],
            },
            options: {
              animation: {
                borderWidth: {
                  duration: 1000,
                  easing: "linear",
                  to: 1,
                  from: 5,
                  loop: true,
                },
              },
              animations: {
                backgroundColor: {
                  type: "color",
                  duration: 1000,
                  easing: "linear",
                  to: "blue",
                  from: "red",
                  loop: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });

          const ctx1 = document.getElementById("popChart");

          // destroy chart code
          var chartStatus = Chart.getChart("popChart"); // <canvas> id
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }

          new Chart(ctx1, {
            type: "line",
            data: {
              labels: [game1, game2, game3, game4, game5],
              datasets: [
                {
                  label: "Rating",
                  data: [
                    gameRating1,
                    gameRating2,
                    gameRating3,
                    gameRating4,
                    gameRating5,
                  ],
                  borderWidth: 5,
                  backgroundColor: "rgb(250, 6, 6)",
                },
              ],
            },
            options: {
              animation: {
                tension: {
                  duration: 1000,
                  easing: "linear",
                  from: 1,
                  to: 2,
                  loop: true,
                },
                backgroundColor: {
                  type: "color",
                  duration: 1000,
                  easing: "linear",
                  to: "blue",
                  from: "red",
                  loop: true,
                },
              },

              scales: {
                y: {
                  // defining min and max so hiding the dataset does not change scale range
                  min: 0,
                  max: 5,
                },
              },
            },
          });
        });
      // Fetch related games
      fetchSeriesGames(data.id);

      renderWishlist();
    })
   .catch((error) => {
      console.error("Error fetching game details: ", error);
      showAlertModal("An error occurred while fetching game details.");
    });
}

// Function to load the page
function pageLoad() {
  const pageLoadURL = `https://api.rawg.io/api/games/borderlands?key=${rawgAPIKey}`;

  fetch(pageLoadURL)
    .then((res) => res.json())
    .then((pageLoadData) => {
      if (pageLoadData.results && pageLoadData.results.length > 0) {
        // Display the list of related games in your UI
        displayRelatedGames(pageLoadData.results);
      }
      const videoGameImageURLDynamic2 =
        pageLoadData.background_image_additional;
      document.body.style.backgroundImage = `url('${videoGameImageURLDynamic2}')`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";

      const videoGameTitle = document.querySelector("#vgTitle");
      saveEl.setAttribute("data-game", pageLoadData.name);
      const videoGameDesc = document.querySelector("#vgDescription");
      const videoGameDate = document.querySelector("#releaseDate");
      const videoGameRating = document.querySelector("#vgRating");
      const videoGamePlatforms = document.querySelector("#vgPlatforms");
      const videoGameContainer = document.getElementById("vgImages");
      const videoGameImage = document.createElement("img");
      videoGameContainer.appendChild(videoGameImage);
      const videoGameImageURL = pageLoadData.background_image;
      videoGameImage.setAttribute("src", videoGameImageURL);

      videoGameDate.textContent = `Released: ${pageLoadData.released}`;
      videoGameDesc.textContent = pageLoadData.description_raw;
      videoGameTitle.textContent = pageLoadData.name;
      videoGameRating.textContent = pageLoadData.esrb_rating.name || "";
      const staticPlatformsString = pageLoadData.parent_platforms
        .map((platform) => platform.platform.name)
        .join(", ");
      videoGamePlatforms.textContent = staticPlatformsString;

      const genreStringOnLoad = pageLoadData.genres
        .map((genre) => genre.id)
        .join(",");
      const pageLoadGenre = `https://api.rawg.io/api/games?key=${rawgAPIKey}&genres=${genreStringOnLoad}`;

      fetch(pageLoadGenre)
        .then((res) => res.json())
        .then((pageLoadRatingData) => {

          function populateCarouselWithImages() {
            var carousel = document.querySelector(
              "#myCarousel .carousel-inner"
            );

            // Clear the existing carousel items
            carousel.innerHTML = "";

            // Extract background images and game names from the first 20 results
            var gameResults = pageLoadRatingData.results.slice(0, 20);

            // Determine the chunk size based on screen width
            var chunkSize = window.innerWidth < 768 ? 1 : 5; // Change 768 to your desired breakpoint

            for (var i = 0; i < gameResults.length; i += chunkSize) {
              var chunk = gameResults.slice(i, i + chunkSize);

              var item = document.createElement("div");
              item.className = "carousel-item";

              // Add the "active" class to the first item
              if (i === 0) {
                item.classList.add("active");
              }

              var row = document.createElement("div");
              row.className = "row";

              chunk.forEach(function (gameData) {
                var gameImageURL = gameData.background_image;
                var gameName = gameData.slug;

                var col = document.createElement("div");
                col.className = "col";

                var imageContainer = document.createElement("div");
                imageContainer.style.width = "300px";
                imageContainer.style.height = "200px";
                imageContainer.style.overflow = "hidden";
                imageContainer.style.position = "relative";

                var image = document.createElement("img");
                image.src = gameImageURL;
                image.style.width = "100%";
                image.style.height = "100%";

                var gameNameText = document.createElement("p");
                gameNameText.textContent = gameName;
                gameNameText.style.position = "absolute";
                gameNameText.style.bottom = "0";
                gameNameText.style.left = "0";
                gameNameText.style.right = "0";
                gameNameText.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
                gameNameText.style.color = "white";
                gameNameText.style.padding = "5px";

                image.addEventListener("click", function () {
                  var input = document.getElementById("query");
                  input.value = gameName;

                  var searchButton = document.getElementById("SearchBtn");
                  searchButton.click();
                });

                imageContainer.appendChild(image);
                col.appendChild(imageContainer);
                col.appendChild(gameNameText);
                row.appendChild(col);
              });

              item.appendChild(row);
              carousel.appendChild(item);
            }
          }

          populateCarouselWithImages();

          var game1 = pageLoadData.name;
          var game2 = pageLoadRatingData.results[1].name;
          var game3 = pageLoadRatingData.results[2].name;
          var game4 = pageLoadRatingData.results[3].name;
          var game5 = pageLoadRatingData.results[4].name;

          var gameRating1 = pageLoadData.rating;
          var gameRating2 = pageLoadRatingData.results[0].rating;
          var gameRating3 = pageLoadRatingData.results[1].rating;
          var gameRating4 = pageLoadRatingData.results[2].rating;
          var gameRating5 = pageLoadRatingData.results[3].rating;

          const ctx = document.getElementById("ratingChart");
          var chartStatus = Chart.getChart("ratingChart");
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }

          new Chart(ctx, {
            type: "bar",
            data: {
              labels: [game1, game2, game3, game4, game5],
              datasets: [
                {
                  label: "Rating",
                  data: [
                    gameRating1,
                    gameRating2,
                    gameRating3,
                    gameRating4,
                    gameRating5,
                  ],
                  borderWidth: 2,
                  backgroundColor: "rgb(250, 6, 6)",
                },
              ],
            },
            options: {
              animation: {
                borderWidth: {
                  duration: 1000,
                  easing: "linear",
                  to: 1,
                  from: 5,
                  loop: true,
                },
              },
              animations: {
                backgroundColor: {
                  type: "color",
                  duration: 1000,
                  easing: "linear",
                  to: "blue",
                  from: "red",
                  loop: true,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });

          const ctx1 = document.getElementById("popChart");
          var chartStatus = Chart.getChart("popChart");
          if (chartStatus != undefined) {
            chartStatus.destroy();
          }

          new Chart(ctx1, {
            type: "line",
            data: {
              labels: [game1, game2, game3, game4, game5],
              datasets: [
                {
                  label: "Rating",
                  data: [
                    gameRating1,
                    gameRating2,
                    gameRating3,
                    gameRating4,
                    gameRating5,
                  ],
                  borderWidth: 5,
                  backgroundColor: "rgb(250, 6, 6)",
                },
              ],
            },
            options: {
              animation: {
                tension: {
                  duration: 1000,
                  easing: "linear",
                  from: 1,
                  to: 2,
                  loop: true,
                },
                backgroundColor: {
                  type: "color",
                  duration: 1000,
                  easing: "linear",
                  to: "blue",
                  from: "red",
                  loop: true,
                },
              },

              scales: {
                y: {
                  min: 0,
                  max: 5,
                },
              },
            },
          });
        });
      renderWishlist();
    });
}

function handleSearchButtonClick(event) {
  event.preventDefault();
  const inputVal = input.value;
  const slug = createSlug(inputVal);
  console.log(slug);
  clearGameDetailsContainer();
  searchGame(slug);
}

function createSlug(input) {
  return input
    .toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '')  // Remove non-word characters except dashes
    .replace(/\-\-+/g, '-')  // Replace multiple dashes with a single dash
    .replace(/^-+/, '')  // Remove leading dashes
    .replace(/-+$/, '');  // Remove trailing dashes
}


// Define the array to store all game names
const allGames = [];

// Function to fetch the list of games and populate the array
async function populateAllGamesArray() {
  try {
    const response = await fetch(fullGameList);

    if (response.ok) {
      const data = await response.json();

      // Extract game names from the data and populate the array
      data.results.forEach((game) => {
        allGames.push(game.name);
      });

      // Now, the allGames array contains all the game names
    } else {
      console.error('Failed to fetch game list');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the function to populate the array
populateAllGamesArray();

// Get the search input and game list
const searchInput = document.getElementById('searchInput');
const gameList = document.getElementById('gameList');

// Function to filter games based on input
function filterGames() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredGames = allGames.filter((game) =>
    game.toLowerCase().includes(searchTerm)
  );

  // Clear the game list
  gameList.innerHTML = '';

  // Display the filtered games
  filteredGames.forEach((game) => {
    const li = document.createElement('li');
    li.textContent = game;
    gameList.appendChild(li);
  });
}
function showLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}

function hideLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

// Example usage during an API call
showLoadingSpinner();
fetch('/api/some-data')
  .then(response => response.json())
  .then(data => {
    // Process data
    hideLoadingSpinner(); // Hide spinner after data is loaded
  });


// Attach an event listener to the search input
searchInput.addEventListener('input', filterGames);

// Initialize the game list
filterGames();
function fetchGameSuggestions(query) {
  if (query.length < 2) {
    document.getElementById("suggestionsList").innerHTML = "";
    return;
  }

  const url = `https://api.rawg.io/api/games?key=${rawgAPIKey}&search=${query}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      // Show suggestions as a dropdown list
      const suggestions = data.results.slice(0, 5);
      let suggestionsHTML = "<ul>";
      suggestions.forEach(game => {
        suggestionsHTML += `<li onclick="selectGame('${game.name}')">${game.name}</li>`;
      });
      suggestionsHTML += "</ul>";
      document.getElementById("suggestionsList").innerHTML = suggestionsHTML;
    })
    .catch(error => {
      console.error("Error fetching game suggestions:", error);
    });
}


const giantBombAPIKey = "5203df07fa7057b6c6b1cc15a141a8f97ca375d9";
const giantBombAPIUrl = "https://www.giantbomb.com/api";

// Function to fetch game data from Giant Bomb API
async function fetchGiantBombGameData(query) {
  const url = `${giantBombAPIUrl}/search/?api_key=${giantBombAPIKey}&format=json&query=${query}&resources=game`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      displayGiantBombGameData(data.results[0]); // Display the first search result
    } else {
      console.log("No games found.");
    }
  } catch (error) {
    console.error("Error fetching Giant Bomb game data:", error);
  }
}

// Example of displaying game data (can be enhanced for your UI)
function displayGiantBombGameData(game) {
  console.log(`Title: ${game.name}`);
  console.log(`Description: ${game.deck}`);
  console.log(`Release Date: ${game.original_release_date}`);
  console.log(`Genres: ${game.genres.map(genre => genre.name).join(', ')}`);
  console.log(`Platforms: ${game.platforms.map(platform => platform.name).join(', ')}`);
  console.log(`Image: ${game.image.small_url}`);
  console.log(`Videos: ${game.videos.length} videos available`);
}

// Function to search game and use both RAWG and Giant Bomb APIs
function searchGameWithFallback(inputVal) {
  const slug = createSlug(inputVal);

  // First search the game in RAWG API
  searchGame(slug)
    .then((data) => {
      if (!data) {
        // If the game isn't found in RAWG, try searching in Giant Bomb
        fetchGiantBombGameData(inputVal);
      }
    })
    .catch((error) => {
      console.error("Error searching game in RAWG:", error);
      // Fallback to Giant Bomb if there's an error
      fetchGiantBombGameData(inputVal);
    });
}

// Event listener to trigger search
document.getElementById("SearchBtn").addEventListener("click", (event) => {
  event.preventDefault();
  const inputVal = input.value;
  searchGameWithFallback(inputVal); // Search using both RAWG and Giant Bomb
});


// Event listeners
document
  .getElementById("SearchBtn")
  .addEventListener("click", handleSearchButtonClick);

saveEl.addEventListener("click", (event) => {
  event.preventDefault();
  const wishlistText = event.target.getAttribute("data-game");
  storeWishlist(wishlistText);
});
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
};

// Initial page load
init();
pageLoad();
