var rawgAPIKey = "9291f496b0954cfd85fdd080b9cd538f";
var fullGameList = "https://api.rawg.io/api/games?key=" + rawgAPIKey;
var wishlistArray = []; // Add this line at the beginning of your script.

AOS.init();

var modalWindow = document.getElementById("modalWindow");

function showModal() {
  modalWindow.style.display = "block";
}

function hideModal() {
  modalWindow.style.display = "none";
}

const saveEl = document.getElementById("saveBtn");
const input = document.getElementById("query");
const wishlist = document.getElementById("wishlist-id");
var wishlistCount = document.getElementById("wishlist-count");

function searchBar(event) {
  event.preventDefault();
  var inputVal = input.value;
  var videoGameContainerParent = document.getElementById("vgImages");
  videoGameContainerParent.innerHTML = ""; // Clear the game details container
  searchGame(inputVal);
}


function pageLoad() {
  var pageLoadURL =
    "https://api.rawg.io/api/games/borderlands?key=" + rawgAPIKey;

  fetch(pageLoadURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (pageLoadData) {
      var videoGameImageURLDynamic2 = pageLoadData.background_image_additional;
      document.body.style.backgroundImage = `url('${videoGameImageURLDynamic2}')`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";

      console.log(pageLoadData);

      var videoGameTitle = document.querySelector("#vgTitle");
      saveEl.setAttribute("data-game", pageLoadData.name);
      var videoGameDesc = document.querySelector("#vgDescription");
      var videoGameDate = document.querySelector("#releaseDate");
      var videoGameRating = document.querySelector("#vgRating");
      var videoGamePlatforms = document.querySelector("#vgPlatforms");
      var videoGameContainer = document.getElementById("vgImages");
      var videoGameImage = document.createElement("img");
      videoGameContainer.appendChild(videoGameImage);
      var videoGameImageURL = pageLoadData.background_image;
      videoGameImage.setAttribute("src", videoGameImageURL);

      console.log(videoGameImageURL);

      videoGameDate.textContent = "Released: " + pageLoadData.released;
      videoGameDesc.textContent = pageLoadData.description_raw;
      videoGameTitle.textContent = pageLoadData.name;
      videoGameRating.textContent = pageLoadData.esrb_rating.name;
      var staticPlatformsString = "";
      for (var j = 0; j < pageLoadData.parent_platforms.length; j++) {
        staticPlatformsString +=
          pageLoadData.parent_platforms[j].platform.name + ", ";
      }
      staticPlatformsString = staticPlatformsString.slice(0, -2);
      console.log(staticPlatformsString);
      videoGamePlatforms.textContent = staticPlatformsString;

      var genreStringOnLoad = "";
      for (var i = 0; i < pageLoadData.genres.length; i++) {
        console.log(pageLoadData.genres[i].id);
        genreStringOnLoad += pageLoadData.genres[i].id + ",";
      }
      genreStringOnLoad = genreStringOnLoad.slice(0, -1);
      console.log(genreStringOnLoad);

      var pageLoadGenre =
        "https://api.rawg.io/api/games" +
        "?key=" +
        rawgAPIKey +
        "&genres=" +
        genreStringOnLoad;

      fetch(pageLoadGenre)
        .then(function (res) {
          return res.json();
        })
        .then(function (pageLoadRatingData) {
          console.log(pageLoadRatingData);

          function populateCarouselWithImages() {
            var carousel = document.querySelector(
              "#myCarousel .carousel-inner"
            );

            // Extract background images and game names from the first 20 results
            var gameResults = pageLoadRatingData.results.slice(0, 20);

            // Group the game results into chunks of 3
            var chunkSize = 4;
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
                var gameName = gameData.name;

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
    });
}

function searchGame(inputVal) {
  var specificGameURL =
    "https://api.rawg.io/api/games/" +
    inputVal.replace(/\s+/g, "-").toLowerCase() +
    "?key=" +
    rawgAPIKey;

  fetch(specificGameURL)
    .then(function (res) {
      if (res.status === 404) {
        // Handle the case when the game is not found
        showModal();
        return null;
      }
      return res.json();
    })
    .then(function (data) {
      if (data === null) {
        return;
      }

      var videoGameTitle = document.querySelector("#vgTitle");
      videoGameTitle.textContent = data.name;
      saveEl.setAttribute("data-game", data.name);
      var videoGameRelease = document.querySelector("#releaseDate");
      videoGameRelease.textContent = "Released:" + data.released;
      var videoGameDescription = document.querySelector("#vgDescription");
      videoGameDescription.textContent = data.description_raw;
      var videoGameRating = document.querySelector("#vgRating");
      videoGameRating.textContent = data.esrb_rating.name;
      if (data.esrb_rating.name === null) {
        videoGameRating.textContent = "";
      }
      var videoGamePlatforms = document.querySelector("#vgPlatforms");
      var platformsString = "";
      for (var j = 0; j < data.parent_platforms.length; j++) {
        platformsString += data.parent_platforms[j].platform.name + ", ";
      }
      platformsString = platformsString.slice(0, -2);
      videoGamePlatforms.textContent = platformsString;

      var videoGameContainer = document.getElementById("vgImages");
      videoGameContainer.innerHTML = ""; // Clear the previous game images
      var videoGameImage = document.createElement("img");
      videoGameContainer.appendChild(videoGameImage);
      var videoGameImageURLDynamic = data.background_image;
      var videoGameImageURLDynamic2 = data.background_image_additional;
      videoGameImage.setAttribute("src", videoGameImageURLDynamic);

      document.body.style.backgroundImage = `url('${videoGameImageURLDynamic2}')`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";

      var genreString = "";
      for (var i = 0; i < data.genres.length; i++) {
        genreString += data.genres[i].id + ",";
      }
      genreString = genreString.slice(0, -1);

      var genreURL =
        "https://api.rawg.io/api/games" +
        "?key=" +
        rawgAPIKey +
        "&genres=" +
        genreString;

      fetch(genreURL)
        .then(function (res) {
          return res.json();
        })
        .then(function (ratingData) {
          // Rest of the code to display additional game details and charts...
        });
    });
}

// The following function renders items in a todo list as <li> elements
function renderWishlist() {
  // Clear wishlist element and update wishlist count
  wishlist.innerHTML = "";
  var wishlistArray = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlistCount.textContent = wishlistArray.length;

  // Render a new li for each wishlist item
  for (var i = 0; i < wishlistArray.length; i++) {
    var wishlistGame = wishlistArray[i];

    var li = document.createElement("button");
    li.textContent = wishlistGame;
    li.setAttribute("data-index", i);
    li.setAttribute(
      "style",
      "margin-right: 1%; margin-bottom: 4%; background-color: hsl(204, 86%, 53%); width: 75%; color: white; border-radius: 2px; border: none; padding: 3%; display: flex; justify-content: space-between;"
    );
    li.setAttribute("class", "liStyles");

    var removeButton = document.createElement("button");
    removeButton.setAttribute(
      "style",
      "margin-left: 1%; background-color: hsl(348, 100%, 61%); border: 1px solid rgba(255, 182, 182, 0.534); padding: 1%; display: flex; height: 25px;"
    );
    // removeButton.style.borderHover = "none";
    removeButton.setAttribute("class", "removebuttonstyle fa fa-remove");
    removeButton.textContent = "";
    // .class.add bulma css class here
    removeButton.dataset.game = wishlistGame;
    removeButton.addEventListener("click", function (event) {
      var gameTitle = event.target.getAttribute("data-game");
      var wishlistArray = JSON.parse(localStorage.getItem("wishlist")) || [];
      var updatedWishlist = wishlistArray.filter(function (game) {
        return game !== gameTitle;
      });
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      renderWishlist();
    });
    removeButton.addEventListener("mouseover", function (event) {
      if (event.target.classList.contains("removebuttonstyle")) {
        event.target.setAttribute(
          "style",
          "margin-left: 1%; background-color: hsl(348, 100%, 61%); border: none; padding: 1%; cursor: pointer; display: flex; height: 25px;"
        );
      }
    });
    removeButton.addEventListener("mouseout", function (event) {
      if (event.target.classList.contains("removebuttonstyle")) {
        event.target.setAttribute(
          "style",
          "margin-left: 1%; background-color: hsl(348, 100%, 61%); border: 1px solid rgba(255, 182, 182, 0.534); padding: 1%; height: 25px;"
        );
      }
    });
    li.addEventListener("mouseover", function (event) {
      if (event.target.classList.contains("liStyles")) {
        event.target.setAttribute(
          "style",
          "margin-right: 1%; margin-bottom: 4%; background-color: hsl(204, 86%, 53%); width: 75%; color: white; border-radius: 2px; border: none; padding: 3%; display: flex; justify-content: space-between;"
        );
      }
    });
    li.addEventListener("mouseout", function (event) {
      if (event.target.classList.contains("liStyles")) {
        event.target.setAttribute(
          "style",
          "margin-right: 1%; margin-bottom: 4%; background-color: hsl(204, 86%, 53%); width: 75%; color: white; border-radius: 2px; border: 1px solid blue; padding: 3%; display: flex; justify-content: space-between;"
        );
      }
    });
    li.addEventListener("click", function () {
      var gameName = this.textContent;
      var videoGameContainerParent = document.getElementById("vgImages");
      videoGameContainerParent.innerHTML = "";
      searchGame(gameName.replace(/\s+/g, "-").replace(/:/g, "").toLowerCase());
    });

    li.appendChild(removeButton);
    wishlist.appendChild(li);
  }
}

// This function is being called below and will run when the page loads.
function init() {
  // Get stored wishlist items from localStorage
  var wishlistItems = JSON.parse(localStorage.getItem("wishlist"));

  // If wishlist were retrieved from localStorage, update the wishlist array to it
  if (wishlistItems !== null) {
    wishlistArray = wishlistItems;
  }

  // This is a helper function that will render wishlist to the DOM
  renderWishlist();
}

function storeWishlist(game) {
  // Stringify and set key in localStorage to wishlist array
  var wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (!wishlistItems.includes(game)) {
    wishlistItems.push(game);
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    renderWishlist();
  }
}

// Have the button only show up when the search is run
var searchEl = document.getElementById("SearchBtn");

// Add event listener to Search button element
searchEl.addEventListener("click", searchBar);
saveEl.addEventListener("click", function (event) {
  event.preventDefault();

  var wishlistText = event.target.getAttribute("data-game");
  console.log(wishlistText);
  storeWishlist(wishlistText);
});
