const actualUserName = localStorage.getItem("actualUser"); // Retrieve the actual username
const recipeTitles = document.getElementsByClassName("title_form"); // Retrieve the list of recipes titles form elements
const userSearch = document.getElementById("userSearch"); // Retrieve the search dislpay element
const linkToUserCooBook = document.getElementById("linkToUserCookBook"); // Retrieve the link to option element
const pageTitle = document.getElementById("pageTitle"); // Retrieve the page title element

// Update link to gu back to options with actual username
linkToUserCooBook.href = linkToUserCooBook.href.replace("USER", actualUserName);

// If there is a "search" variable in locaStorage, display the value in the Your search line
// And change the page title
// Else, revome Your search element
if (localStorage.getItem("search") != undefined) {
  userSearch.innerHTML = `Your search: <span id="search_display">${localStorage.getItem("search")}</span>`;
  pageTitle.innerText = "Search results";
} else {
  userSearch.parentElement.removeChild(userSearch);
}

// For each recipe title
// Add the actual username to the corresponding input element
// Add an event listener to the title element
// So that upon cllick, the form is submitted
for (let index = 0; index < recipeTitles.length; index++) {
  recipeTitles[index].children[2].value = actualUserName;
  recipeTitles[index].children[0].addEventListener('click', function() {
    recipeTitles[index].submit();
  });
}