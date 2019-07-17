const usersSaved = document.getElementById("users");
const usersLink = document.getElementById("usersLink");
const userNameInput = document.getElementById("username");
const userNameSubmit = document.getElementById("submitUser");

if (localStorage.getItem("search") != undefined) {
  localStorage.removeItem("search");
}

function createUsersLinkList(usersList, parent) {
  usersList.forEach(user => {
    const newForm = document.createElement("form");
    newForm.method = "get";
    newForm.action = "/options";
    newForm.className = "usersLinkList";
    const newUser = document.createElement("li");
    newUser.innerHTML = user;
    newUser.className = "users-list-style";
    newForm.appendChild(newUser);
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.value = user;
    usernameInput.hidden = true;
    newForm.appendChild(usernameInput);
    parent.appendChild(newForm);
  });
}

function createClickableList(classname, values) {
  const classnameElement = document.getElementsByClassName(classname);
  for (let index = 0; index < classnameElement.length; index++) {
    classnameElement[index].children[0].addEventListener('click', function() {
      localStorage.setItem("actualUser", values[index]);
      classnameElement[index].submit();
    });
  }
}

if (usersSaved.innerText != "") {
  usersLink.removeChild(usersLink.children[0]);
  const usersList = usersSaved.innerText.split(",");
  createUsersLinkList(usersList, usersLink);
  createClickableList("usersLinkList", usersList);
}

userNameSubmit.addEventListener("click", function() {
  newUser = userNameInput.value;
  localStorage.setItem("actualUser", newUser);
})
