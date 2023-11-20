const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

//  get 10 images from NASA api
async function getNasaPictures() {
  // show active "page"
  resultsNav.classList.add("active");
  favoritesNav.classList.remove("active");
  // show loader
  loader.classList.remove("hidden");

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    resultsArray = data;
    displayPhotos("main");
  } catch (error) {
    console.log(error);
    imagesContainer.textContent = "Failed to fetch images";
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  loader.classList.add("hidden");
}

function displayPhotos(page) {
  imagesContainer.textContent = "";
  const isFavoritePage = page === "favorites";
  const array = isFavoritePage ? Object.values(favorites) : resultsArray;

  array.forEach((result) => {
    // card container
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    // link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View full image";
    link.target = "_blank";

    // image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA picture of the day";
    image.loading = "lazy";
    image.classList.add("card-img-top");

    // card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;

    // save text
    const addFavoritesBtn = document.createElement("button");
    addFavoritesBtn.classList.add("clickable");
    addFavoritesBtn.setAttribute(
      "onclick",
      isFavoritePage
        ? `removeFromFavorites("${result.url}")`
        : `addToFavorites("${result.url}")`
    );
    addFavoritesBtn.textContent = isFavoritePage
      ? "Remove from Favorites"
      : "Add to Favorites";

    // card text
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = result.explanation;

    const smallElement = document.createElement("small");
    smallElement.classList.add("text-muted");
    const date = document.createElement("strong");
    date.textContent = result.date;

    const copyrightResult = result.copyright ?? "";
    const copyrightInfo = document.createElement("span");
    copyrightInfo.textContent = copyrightResult;

    smallElement.append(date, copyrightResult);

    cardBody.append(cardTitle, addFavoritesBtn, cardText, smallElement);
    link.appendChild(image);
    cardElement.append(link, cardBody);
    imagesContainer.appendChild(cardElement);
  });
}

getNasaPictures();

function displayFavorites() {
  // show active page
  resultsNav.classList.remove("active");
  favoritesNav.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });

  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    displayPhotos("favorites");
  } else {
    imagesContainer.textContent = "No favorites added yet!";
  }
}

function addToFavorites(url) {
  resultsArray.forEach((result) => {
    if (result.url.includes(url)) {
      favorites[url] = result;
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
    saveConfirmed.hidden = false;
    if (favorites[url]) {
      saveConfirmed.textContent = "ADDED TO FAVORITES";
    } else {
      saveConfirmed.textContent = "ALREADY IN FAVORITES";
    }

    setTimeout(() => {
      saveConfirmed.hidden = true;
    }, 2000);
  });
}

function removeFromFavorites(url) {
  if (favorites[url]) {
    delete favorites[url];
    localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    saveConfirmed.hidden = false;
    saveConfirmed.textContent = "REMOVED TO FAVORITES";

    setTimeout(() => {
      saveConfirmed.hidden = true;
    }, 2000);
  }

  displayFavorites();
}
