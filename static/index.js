const usersSaved = document.getElementById("users"); // Retrieve the paragraph containing comma separated list of saved users
const usersLink = document.getElementById("usersLink"); // Retrieve the list that will contain the saved users
const userNameInput = document.getElementById("username"); // Retrieve the input element for new user input
const userNameSubmit = document.getElementById("submitUser"); // Retrieve the submit button for new user input

// If there is a variable named "search" in the local storage, delete it
if (localStorage.getItem("search") != undefined) {
  localStorage.removeItem("search");
}

// Function that create a list of saved user
// It create a form for each user that contain a list element with the username
// And an input element with the username as value
// It also add an event listener to the list element
// Upon click, it will set the locaStorage value "acualUser" as the correponding user and submit the form
function createUsersLinkList(usersList, parent) {
  // for each user
  usersList.forEach(user => {
    // create new form element
    const newForm = document.createElement("form");
    newForm.method = "get";
    newForm.action = "/options";
    newForm.className = "usersLinkList";
    // create new user list element with an evenet listener
    const newUser = document.createElement("li");
    newUser.innerHTML = user;
    newUser.className = "users-list-style";
    newUser.addEventListener('click', function() {
      localStorage.setItem("actualUser", user);
      newUser.parentElement.submit();
    });
    // add it to the form
    newForm.appendChild(newUser);
    // create a new hidden input element containing the username as value
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.value = user;
    usernameInput.hidden = true;
    // add it to the form
    newForm.appendChild(usernameInput);
    // add the form to a parent element
    parent.appendChild(newForm);
  });
}

// If there are saved users, create a clickable users list
if (usersSaved.innerText != "") {
  // Remove the line saying no user saved
  usersLink.removeChild(usersLink.children[0]);
  // creating a list of users
  const usersList = usersSaved.innerText.split(",");
  createUsersLinkList(usersList, usersLink);
}

// On click on "Enter" submit button, set actualUser as username input value in localStorage
userNameSubmit.addEventListener("click", function() {
  localStorage.setItem("actualUser", userNameInput.value);
})
