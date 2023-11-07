const rawgAPIKey = "afe2446d033e4b5197325726cd2f5fb8";
const fullGameList = `https://api.rawg.io/api/games?key=${rawgAPIKey}`;
console.log(fullGameList);
var wishlistArray = [];
const modalWindow = document.getElementById("modalWindow");
const saveEl = document.getElementById("saveBtn");
const input = document.getElementById("query");
const wishlist = document.getElementById("wishlist-id");
const wishlistCount = document.getElementById("wishlist-count");

const gamesListContainer = document.getElementById("gamesList");

let page = 1; // Start with page 1
const resultsPerPage = 100; // Number of results per page

// Function to fetch and display the list of games
function fetchGamesList() {
  const gamesListURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&page=${page}&page_size=${resultsPerPage}`;

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
}

// Call the function to fetch and display the games list
fetchGamesList();

AOS.init();

// Function to show the modal
const alertModal = document.getElementById("alertModal"); // Assuming you have an alert modal element with this ID

// Function to show the custom alert modal
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

// Function to render items in the wishlist as <li> elements
function renderWishlist() {
  // Clear wishlist element and update wishlist count
  wishlist.innerHTML = "";
  const wishlistArray = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlistCount.textContent = wishlistArray.length;

  wishlistArray.forEach((wishlistGame, i) => {
    const li = document.createElement("button");
    li.textContent = wishlistGame;
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
    removeButton.dataset.game = wishlistGame;

    removeButton.addEventListener("click", (event) => {
      const gameTitle = event.target.getAttribute("data-game");
      const updatedWishlist = wishlistArray.filter(
        (game) => game !== gameTitle
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      renderWishlist();
    });

    const addMouseOverAndOutEvents = (
      element,
      stylesOnMouseOver,
      stylesOnMouseOut
    ) => {
      element.addEventListener("mouseover", () => {
        element.style.cssText = stylesOnMouseOver;
      });

      element.addEventListener("mouseout", () => {
        element.style.cssText = stylesOnMouseOut;
      });
    };

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

    li.addEventListener("click", () => {
      const gameName = li.textContent;
      const videoGameContainerParent = document.getElementById("vgImages");
      videoGameContainerParent.innerHTML = "";
      searchGame(gameName.replace(/\s+/g, "-").replace(/:/g, "").toLowerCase());
    });

    li.appendChild(removeButton);
    wishlist.appendChild(li);
  });
}

// Function to initialize the page
function init() {
  var wishlistItems = JSON.parse(localStorage.getItem("wishlist"));
  if (wishlistItems !== null) {
    wishlistArray = wishlistItems;
  }
  renderWishlist();
}

// Function to store a game in the wishlist
function storeWishlist(game) {
  const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlistItems.includes(game)) {
    wishlistItems.push(game);
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    renderWishlist();
  }
}

function fetchRelatedGames(gameName) {
  const relatedGamesURL = `https://api.rawg.io/api/games?key=${rawgAPIKey}&search=${gameName}&page_size=20`; 

  fetch(relatedGamesURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok (${response.status}): ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      if (data.results && data.results.length > 0) {
        // You can now display the related games in your HTML.
        displayGameSeries(data.results);
      } else {
        // Handle the case where there are no related games.
        console.error("No related games found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching related games:", error);
    });
}


function displayGameSeries(gameSeries) {
  const relatedGamesContainer = document.getElementById("relatedGames");

  // Clear the existing related games
  relatedGamesContainer.innerHTML = "";

  if (gameSeries.length === 0) {
    // If there is no game series information, display a message or handle as needed
    const noSeriesMessage = document.createElement("p");
    noSeriesMessage.textContent = "No game series information available.";
    relatedGamesContainer.appendChild(noSeriesMessage);
  } else {
    // Create a row div for the game series
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    // Create a card for each game in the series
    gameSeries.forEach((game) => {
      const gameCard = document.createElement("div");
      gameCard.classList.add("col", "related-game-card");

      // Create an image element for the game
      const gameImage = document.createElement("img");
      gameImage.src = game.background_image;
      gameImage.alt = game.name;

      // Create a title element for the game
      const gameTitle = document.createElement("h2");
      gameTitle.textContent = game.name;

      // Append the image and title to the card
      gameCard.appendChild(gameImage);
      gameCard.appendChild(gameTitle);

      // Append the card to the row
      rowDiv.appendChild(gameCard);
    });

    // Append the row to the related games container
    relatedGamesContainer.appendChild(rowDiv);
  }
}




// Function to search for a game
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
      fetchRelatedGames(data.id);

      renderWishlist();
    })
    .catch((error) => {
      console.error("Error fetching game details: ", error);
    });
}

// Function to load the page
function pageLoad() {
  const pageLoadURL = `https://api.rawg.io/api/games/borderlands?key=${rawgAPIKey}`;

  fetch(pageLoadURL)
    .then((res) => res.json())
    .then((pageLoadData) => {
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
                imageContainer.appendChild(gameNameText);

                col.appendChild(imageContainer);
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



// Function to handle the click event for the Search button
function handleSearchButtonClick(event) {
  event.preventDefault();
  const inputVal = input.value;
  clearGameDetailsContainer();
  searchGame(inputVal);
}

// Event listeners
document
  .getElementById("SearchBtn")
  .addEventListener("click", handleSearchButtonClick);

// function init() {
//   // Get stored wishlist items from localStorage
//   var wishlistItems = JSON.parse(localStorage.getItem("wishlist"));

//   // If wishlist was retrieved from localStorage, update the wishlist array to it
//   if (wishlistItems !== null) {
//     wishlistArray = wishlistItems;
//   }

//   // This is a helper function that will render the wishlist to the DOM
//   renderWishlist();
// }

saveEl.addEventListener("click", (event) => {
  event.preventDefault();
  const wishlistText = event.target.getAttribute("data-game");
  storeWishlist(wishlistText);
});

// Initial page load
init();
pageLoad();
