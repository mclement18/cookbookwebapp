// Clickable titles in the RECIPES TITLES LIST

const classname = document.getElementsByClassName("classname");


for (let i = 0; i < classname.length; i++) {
  classname[i].children[0].addEventListener('click', function() {
    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username"
    usernameInput.value = localStorage.getItem("actualUser");
    usernameInput.hidden = true;
    classname[i].appendChild(usernameInput);
    classname[i].submit();
  });
}