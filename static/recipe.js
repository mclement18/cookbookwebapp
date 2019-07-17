const actualUserName = localStorage.getItem("actualUser");
const recipeTitle = document.getElementById("recipeTitle");
const recipeTitleForm = document.getElementById("recipe_title");
const userNameForm = document.getElementById("username");
const personNbInput = document.getElementById("person_nb");
const caculateButton = document.getElementById("calculate");
const quantities = document.getElementsByClassName("quantity_calculation");
const linkToUserCooBook = document.getElementById("linkToUserCookBook");
const linkToRecipeList = document.getElementById("linkToRecipeList");
let actualPersonNb = 4;

linkToUserCooBook.href = linkToUserCooBook.href.replace("USER", actualUserName);
if (localStorage.getItem("search") != undefined) {
  linkToRecipeList.href = `/search?username=${actualUserName}&query=${localStorage.getItem("search")}`;
  linkToRecipeList.innerText = `Back to Search`;
} else {
  linkToRecipeList.href = `/allrecipes?username=${actualUserName}`;
  linkToRecipeList.innerText = `Back to Recipes List`;
}

recipeTitleForm.value = recipeTitle.innerText;
userNameForm.value = actualUserName;

caculateButton.addEventListener("click", function() {
  if (personNbInput.value != undefined && Number.isInteger(Number(personNbInput.value))) {
    const newPersonNb = Number(personNbInput.value);
    for (let index = 0; index < quantities.length; index++) {
      const quantity = quantities[index];
      const oldQuantity = Number(quantity.innerText);
      const newQuantity = oldQuantity / actualPersonNb * newPersonNb;
      quantity.innerText = newQuantity.toString();
    }
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