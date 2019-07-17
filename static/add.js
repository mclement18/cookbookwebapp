const actualUserName = localStorage.getItem("actualUser");
const userNameInput = document.getElementById("username");
const addIngredientButton = document.getElementById("addIngredient");
const ingredientsInputList = document.getElementById("ingredientsInputList");
const linkToUserCooBook = document.getElementById("linkToUserCookBook");
let ingredientNb = 0;

linkToUserCooBook.href = linkToUserCooBook.href.replace("USER", actualUserName);

userNameInput.value = actualUserName;

function createInputElement(type, number) {
  const newElement = document.createElement("input");
  let placeHolder = "";
  let required = true;
  if (type === "quantity") {
    placeHolder = "Quantity";
    setInputFilter(newElement, function(value) {
      return /^\d*$/.test(value);
    });
  } else if (type === "unit") {
    placeHolder = "Unit";
    required = false;
  } else if (type === "ingredient") {
    placeHolder = "Ingredient";
  }
  const name = `${type}_${number.toString()}`;
  newElement.type = "text";
  newElement.name = name;
  newElement.id = name;
  newElement.placeholder = placeHolder;
  newElement.required = required;
  return newElement;
}

function createRemoveIngredientButton(number, parent) {
  const removeButton = document.createElement("input");
  removeButton.type = "button";
  removeButton.value = "Remove";
  removeButton.className = "button";
  removeButton.id = `removeIngredient_${number.toString()}`;
  removeButton.addEventListener("click", function() {
    ingredientsInputList.removeChild(parent);
    fixIngredientNumbering(Number(this.id.split("_")[1]));
  });
  return removeButton;
}

function fixIngredientNumbering(startingNb) {
  console.log(startingNb);
  for (let index = startingNb; index < ingredientsInputList.children.length; index++) {
    const ingredient = ingredientsInputList.children[index];
    const oldIngredientNb = Number(ingredient.children[0].name.split("_")[1]);
    const newIgredientNb = oldIngredientNb - 1;
    ingredient.id = `ingredient_${newIgredientNb.toString()}`;
    for (let index = 0; index < ingredient.children.length; index++) {
      const child = ingredient.children[index];
      if (child.type === "text") {
        const type = child.name.split("_")[0];
        const newName = `${type}_${newIgredientNb.toString()}`;
        child.name = newName;
        child.id = newName;
      } else if (child.type === "button") {
        child.id = `removeIngredient_${newIgredientNb.toString()}`;
      }
    }
  }
  ingredientNb--;
}

addIngredientButton.addEventListener("click", function() {
  ingredientNb++;
  const newQuantity = createInputElement("quantity", ingredientNb);
  const newUnit = createInputElement("unit", ingredientNb);
  const newIngredientName = createInputElement("ingredient", ingredientNb);
  const newIgredient = document.createElement("p");
  newIgredient.className = "ingredient";
  newIgredient.id = `ingredient_${ingredientNb.toString()}`;
  newIgredient.appendChild(newQuantity);
  newIgredient.appendChild(newUnit);
  newIgredient.appendChild(newIngredientName);
  const removeButton = createRemoveIngredientButton(ingredientNb, newIgredient);
  newIgredient.appendChild(removeButton);
  ingredientsInputList.appendChild(newIgredient);
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
setInputFilter(ingredientsInputList.children[0].children[0], function(value) {
  return /^\d*$/.test(value);
});