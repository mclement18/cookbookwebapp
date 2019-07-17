const actualUserName = localStorage.getItem("actualUser");
const userNameClass = document.getElementsByClassName("username");
const mainTitle = document.getElementById("mainTitle");
const searchButton = document.getElementById("search");
const query = document.getElementById("query");

if (localStorage.getItem("search") != undefined) {
  localStorage.removeItem("search");
}

mainTitle.innerHTML = `${actualUserName}'s CookBook`;

for (let index = 0; index < userNameClass.length; index++) {
  const element = userNameClass[index];
  element.value = actualUserName;
}

searchButton.addEventListener("click", function() {
  localStorage.setItem("search", query.value);
});