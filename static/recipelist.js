const actualUserName = localStorage.getItem("actualUser");
const recipeTitles = document.getElementsByClassName("title_form");
const userSearch = document.getElementById("userSearch");
const linkToUserCooBook = document.getElementById("linkToUserCookBook");
const pageTitle = document.getElementById("pageTitle");

linkToUserCooBook.href = linkToUserCooBook.href.replace("USER", actualUserName);

if (localStorage.getItem("search") != undefined) {
  userSearch.innerHTML = `Your search: <span id="search_display">${localStorage.getItem("search")}</span>`;
  pageTitle.innerText = "Search results";
} else {
  userSearch.parentElement.removeChild(userSearch);
}

for (let index = 0; index < recipeTitles.length; index++) {
  recipeTitles[index].children[2].value = actualUserName;
  recipeTitles[index].children[0].addEventListener('click', function() {
    recipeTitles[index].submit();
  });
}