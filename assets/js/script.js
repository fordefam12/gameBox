var rawgAPIKey = "9291f496b0954cfd85fdd080b9cd538f";
var fullGameList = "https://api.rawg.io/api/games?key=" + rawgAPIKey;

  AOS.init();

// ? Sample RAWG API links for reference
// Full list of games - https://api.rawg.io/api/games?key=5e68bfa8ec8141a990c74c4ebefb01ea
// Games list with filters - https://api.rawg.io/api/games?key=5e68bfa8ec8141a990c74c4ebefb01ea&dates=2019-09-01,2019-09-30&platforms=18,1,7
// Borderlands 3 game details - https://api.rawg.io/api/games/borderlands-3?key=5e68bfa8ec8141a990c74c4ebefb01ea
// how to get the rawg genres on for the chart data ->
// clear input field for more searches
// var rawgKey ='9291f496b0954cfd85fdd080b9cd538f' this is ryans api key;
// var rawgKey ='5e68bfa8ec8141a990c74c4ebefb01ea' this is shawns api key;
// var rawgKey ='afe2446d033e4b5197325726cd2f5fb8' this is brandons api key;
var modalWindow = document.getElementById("modalWindow");
function showModal() {
  modalWindow.style.display = "block";
}
function hideModal() {
  modalWindow.style.display = "none";
}

var saveEl = document.getElementById("saveBtn");
var input = document.getElementById("query");
var wishlist = document.getElementById("wishlist-id");
var wishlistCount = document.getElementById("wishlist-count");
function searchBar(event) {
  event.preventDefault();
  var inputVal = input.value;
  searchGame(inputVal);
  var videoGameContainerParent = document.getElementById("vgImages");
  videoGameContainerParent.innerHTML = "";
}
// List of games object on console log
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
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'cover';
    
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
      for (j = 0; j < pageLoadData.parent_platforms.length; j++) {
        staticPlatformsString +=
          pageLoadData.parent_platforms[j].platform.name + ", ";
      }
      staticPlatformsString = staticPlatformsString.slice(0, -2);
      console.log(staticPlatformsString);
      videoGamePlatforms.textContent = staticPlatformsString;
      var genreStringOnLoad = "";
      for (i = 0; i < pageLoadData.genres.length; i++) {
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

          // charts in here
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
// Targeting Search button element
var searchEl = document.querySelector("#SearchBtn");

//! Code that runs when Search button is pressed (almost all code should go here)
function searchGame(inputVal) {
  console.log(inputVal);
  var specificGameURL =
    "https://api.rawg.io/api/games/" +
    inputVal.replace(/\s+/g, "-").toLowerCase() +
    "?key=" +
    rawgAPIKey;
  // Collect user input for the game search and store it in a variable
  fetch(specificGameURL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      console.log(data.redirect);
      if (data.redirect === true) {
        showModal();
      }
      if(data.redirect === true){
        inputVal = data.slug;
      }
      // make website content here
      // game title/ release/ description
      var videoGameTitle = document.querySelector("#vgTitle");
      videoGameTitle.textContent = data.name;
      saveEl.setAttribute("data-game", data.name);
      var videoGameRelease = document.querySelector("#releaseDate");
      videoGameRelease.textContent = "Released:" + data.released;
      var videoGameDescription = document.querySelector("#vgDescription");
      videoGameDescription.textContent = data.description_raw;
      // rating
      var videoGameRating = document.querySelector("#vgRating");
      videoGameRating.textContent = data.esrb_rating.name;
      if (data.esrb_rating.name === null) {
        videoGameRating.textContent = "";
      }
      // platforms
      var videoGamePlatforms = document.querySelector("#vgPlatforms");
      var platformsString = "";
      for (j = 0; j < data.parent_platforms.length; j++) {
        platformsString += data.parent_platforms[j].platform.name + ", ";
      }
      platformsString = platformsString.slice(0, -2);
      console.log(platformsString);
      videoGamePlatforms.textContent = platformsString;
      // image

      var videoGameContainer = document.getElementById("vgImages");
      var videoGameImage = document.createElement("img");
      videoGameContainer.appendChild(videoGameImage);
      var videoGameImageURLDynamic = data.background_image;
      var videoGameImageURLDynamic2 = data.background_image_additional;
      console.log(data.background_image_additional);
      videoGameImage.setAttribute("src", videoGameImageURLDynamic);
      // end
     
      document.body.style.backgroundImage = `url('${videoGameImageURLDynamic2}')`;
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundSize = 'cover';
      var genreString = "";
      for (i = 0; i < data.genres.length; i++) {
        console.log(data.genres[i].id);
        genreString += data.genres[i].id + ",";
      }
      genreString = genreString.slice(0, -1);
      console.log(genreString);
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
    }
    );
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
    li.setAttribute("style","margin-right: 1%; margin-bottom: 4%; background-color: hsl(204, 86%, 53%); width: 75%; color: white; border-radius: 2px; border: none; padding: 3%; display: flex; justify-content: space-between;");
    li.setAttribute("class", "liStyles");

    var removeButton = document.createElement("button");
    removeButton.setAttribute("style", "margin-left: 1%; background-color: hsl(348, 100%, 61%); border: 1px solid rgba(255, 182, 182, 0.534); padding: 1%; display: flex; height: 25px;");
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
    })
    removeButton.addEventListener("mouseover", function(event){
      if(event.target.classList.contains("removebuttonstyle")){
        event.target.setAttribute("style", "margin-left: 1%; background-color: hsl(348, 100%, 61%); border: none; padding: 1%; cursor: pointer; display: flex; height: 25px;");
      }
    });
    removeButton.addEventListener("mouseout", function(event){
      if(event.target.classList.contains("removebuttonstyle")){
        event.target.setAttribute("style", "margin-left: 1%; background-color: hsl(348, 100%, 61%); border: 1px solid rgba(255, 182, 182, 0.534); padding: 1%; height: 25px;");
      }
    });
    li.addEventListener("mouseover", function(event){
      if(event.target.classList.contains("liStyles")){
        event.target.setAttribute("style", "margin-right: 1%; margin-bottom: 4%; background-color: hsl(204, 86%, 53%); width: 75%; color: white; border-radius: 2px; border: none; padding: 3%; display: flex; justify-content: space-between;");
      }
    });
    li.addEventListener("mouseout", function(event){
      if(event.target.classList.contains("liStyles")){
        event.target.setAttribute("style", "margin-right: 1%; margin-bottom: 4%; background-color: hsl(204, 86%, 53%); width: 75%; color: white; border-radius: 2px; border: 1px solid blue; padding: 3%; display: flex; justify-content: space-between;");
      }
    });
    li.addEventListener("click", function(){
      var videoGameContainerParent = document.getElementById("vgImages");
      videoGameContainerParent.innerHTML = "";
      searchGame(this.textContent.replace(/\s+/g, "-").replace(/:/g,"").toLowerCase());
    })
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

// Add event listener to Search button element
searchEl.addEventListener("click", searchBar);
saveEl.addEventListener("click", function (event) {
  event.preventDefault();

  var wishlistText = event.target.getAttribute("data-game");
  console.log(wishlistText);
  storeWishlist(wishlistText);
});
