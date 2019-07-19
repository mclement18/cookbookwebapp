const actualUserName = localStorage.getItem("actualUser"); // Retrieve the actual username
const recipeTitle = document.getElementById("recipeTitle"); // Retrieve recipe title
const recipeTitleForm = document.getElementById("recipe_title"); // Retrieve recipe title input element from delete form
const userNameForm = document.getElementById("username"); // Retrieve username input element from delete form
const personNbInput = document.getElementById("person_nb"); // Retrieve person nuber input
const caculateButton = document.getElementById("calculate"); // Retrieve calculate button
const quantities = document.getElementsByClassName("quantity_calculation"); // Retrieve a list of ingredient quantities using the span
const linkToUserCooBook = document.getElementById("linkToUserCookBook"); // Retrieve link to options
const linkToRecipeList = document.getElementById("linkToRecipeList"); // Retrieve link back to list
let actualPersonNb = 4; // set recipe person number to default 4 people

// Update link to gu back to options with actual username
linkToUserCooBook.href = linkToUserCooBook.href.replace("USER", actualUserName);

// If there is a "search" variable in locaStorage
// Create a link back to search
// Else, create a link back to Recipes List
if (localStorage.getItem("search") != undefined) {
  linkToRecipeList.href = `/search?username=${actualUserName}&query=${localStorage.getItem("search")}`;
  linkToRecipeList.innerText = `Back to Search`;
} else {
  linkToRecipeList.href = `/allrecipes?username=${actualUserName}`;
  linkToRecipeList.innerText = `Back to Recipes List`;
}

// Add recipe title and actual username to the delete recipe form
recipeTitleForm.value = recipeTitle.innerText;
userNameForm.value = actualUserName;

// Create functionality for the calculate button
caculateButton.addEventListener("click", function() {
  // If the input value is not empty and is an integer
  if (personNbInput.value != undefined && Number.isInteger(Number(personNbInput.value))) {
    const newPersonNb = Number(personNbInput.value);
    // for each ingredient quantity
    // replace old quantity with newly calulated quantity
    for (let index = 0; index < quantities.length; index++) {
      const quantity = quantities[index];
      const oldQuantity = Number(quantity.innerText);
      const newQuantity = oldQuantity / actualPersonNb * newPersonNb;
      quantity.innerText = newQuantity.toString();
    }
    // finaly, update recipe personne number
    actualPersonNb = newPersonNb;
  }
});

// From here the solution is a copy paste from stackoverflow
// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(event => {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}

// Restrict input to digits by using a regular expression filter.
setInputFilter(personNbInput, function(value) {
  return /^\d*$/.test(value);
});