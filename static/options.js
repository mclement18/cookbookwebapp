const actualUserName = localStorage.getItem("actualUser"); // Retrieve actual username
const userNameClass = document.getElementsByClassName("username"); // Retrieve all the hidden input element that should contain username
const mainTitle = document.getElementById("mainTitle"); // Retrieve Page title element
const searchButton = document.getElementById("search"); // Retrieve search submit button
const query = document.getElementById("query"); // Retieve query input

// If there is a variable named "search" in the local storage, delete it
if (localStorage.getItem("search") != undefined) {
  localStorage.removeItem("search");
}

// Update page title with actual username
mainTitle.innerHTML = `${actualUserName}'s CookBook`;

// Add actual username as value to all hidden input elements that should contain it
for (let index = 0; index < userNameClass.length; index++) {
  const element = userNameClass[index];
  element.value = actualUserName;
}

// Upon click on search button, add "search" variable to localStorage with the query as value
searchButton.addEventListener("click", function() {
  localStorage.setItem("search", query.value);
});