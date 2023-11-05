const rawgAPIKey = "9291f496b0954cfd85fdd080b9cd538f";
const fullGameList = `https://api.rawg.io/api/games?key=${rawgAPIKey}`;
const wishlistArray = [];
const modalWindow = document.getElementById("modalWindow");
const saveEl = document.getElementById("saveBtn");
const input = document.getElementById("query");
const wishlist = document.getElementById("wishlist-id");
const wishlistCount = document.getElementById("wishlist-count");




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
      const updatedWishlist = wishlistArray.filter((game) => game !== gameTitle);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      renderWishlist();
    });

    const addMouseOverAndOutEvents = (element, stylesOnMouseOver, stylesOnMouseOut) => {
      element.addEventListener("mouseover", () => {
        element.style.cssText = stylesOnMouseOver;
      });

      element.addEventListener("mouseout", () => {
        element.style.cssText = stylesOnMouseOut;
      });
    };

    addMouseOverAndOutEvents(removeButton, `
      margin-left: 1%;
      background-color: hsl(348, 100%, 61%);
      border: none;
      padding: 1%;
      cursor: pointer;
      display: flex;
      height: 25px;
    `, `
      margin-left: 1%;
      background-color: hsl(348, 100%, 61%);
      border: 1px solid rgba(255, 182, 182, 0.534);
      padding: 1%;
      height: 25px;
    `);

    addMouseOverAndOutEvents(li, `
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
    `, `
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
    `);

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

// Function to search for a game
function searchGame(inputVal) {
  const specificGameURL = `https://api.rawg.io/api/games/${inputVal.replace(/\s+/g, "-").toLowerCase()}?key=${rawgAPIKey}`;

  fetch(specificGameURL)
    .then((res) => {
      if (res.status === 404) {
        showModal();
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
      const platformsString = data.parent_platforms.map((platform) => platform.platform.name).join(", ");
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
        console.log(ratingData);

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
    });
}


// Function to load the page
function pageLoad() {
  const pageLoadURL = `https://api.rawg.io/api/games/borderlands?key=${rawgAPIKey}`;

  fetch(pageLoadURL)
    .then((res) => res.json())
    .then((pageLoadData) => {
      const videoGameImageURLDynamic2 = pageLoadData.background_image_additional;
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
      const staticPlatformsString = pageLoadData.parent_platforms.map((platform) => platform.platform.name).join(", ");
      videoGamePlatforms.textContent = staticPlatformsString;

      const genreStringOnLoad = pageLoadData.genres.map((genre) => genre.id).join(",");
      const pageLoadGenre = `https://api.rawg.io/api/games?key=${rawgAPIKey}&genres=${genreStringOnLoad}`;

      fetch(pageLoadGenre)
        .then((res) => res.json())
        .then((pageLoadRatingData) => {
          // Rest of the code to display additional game details and charts...
          console.log(pageLoadRatingData);

          function populateCarouselWithImages() {
            var carousel = document.querySelector("#myCarousel .carousel-inner");
          
            // Extract background images and game names from the first 20 results
            var gameResults = pageLoadRatingData.results.slice(0, 20);
          
            // Group the game results into chunks of 4
            var chunkSize = 5;
            for (var i = 0; i < gameResults.length; i += chunkSize) {
              var chunk = gameResults.slice(i, i + chunkSize);
          
              var item = document.createElement("div");
              item.className = "carousel-item";
          
              // Add the "active" class to the first item
              if (i === 0) {
                item.classList.add("active");
              }
          
              // Create a row for the images
              var row = document.createElement("div");
              row.className = "row";
          
              // Loop through the chunk of game results
              chunk.forEach(function (gameData) {
                var gameImageURL = gameData.background_image;
                var gameName = gameData.slug;
          console.log(gameData);
                // Create a column for each image
                var col = document.createElement("div");
                col.className = "col";
          
                // Create a container to set a fixed size
                var imageContainer = document.createElement("div");
                imageContainer.style.width = "300px"; // Set the desired width
                imageContainer.style.height = "200px"; // Set the desired height
                imageContainer.style.overflow = "hidden";
                imageContainer.style.position = "relative"; // To position text inside
          
                // Create an image element
                var image = document.createElement("img");
                image.src = gameImageURL;
                image.style.width = "100%"; // Make the image fill the container
                image.style.height = "100%";
          
                // Create a text element for the game name
                var gameNameText = document.createElement("p");
                gameNameText.textContent = gameName;
                gameNameText.style.position = "absolute";
                gameNameText.style.bottom = "0";
                gameNameText.style.left = "0";
                gameNameText.style.right = "0";
                gameNameText.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
                gameNameText.style.color = "white";
                gameNameText.style.padding = "5px";
          
                // Add a click event listener to the image
                image.addEventListener("click", function () {
                  // Set the game name as the value of the search input
                  var searchInput = document.getElementById("query");
                  searchInput.value = gameName;
          
                  // Trigger the search by clicking the search button
                  var searchButton = document.getElementById("SearchBtn");
                  searchButton.click();
                });
          
                // Add the image and game name to the container
                imageContainer.appendChild(image);
                imageContainer.appendChild(gameNameText);
          
                // Add the container to the column
                col.appendChild(imageContainer);
          
                // Add the column to the row
                row.appendChild(col);
              });
          
              // Add the row to the item
              item.appendChild(row);
          
              // Add the item to the carousel
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
document.getElementById("SearchBtn").addEventListener("click", handleSearchButtonClick);

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
