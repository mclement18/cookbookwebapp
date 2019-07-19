const actualUserName = localStorage.getItem("actualUser"); // Retrieve the actual username
const userNameInput = document.getElementById("username"); // Retrieve username input element from the form
const addIngredientButton = document.getElementById("addIngredient"); // retrieve add ingredient button
const ingredientsInputList = document.getElementById("ingredientsInputList"); // Retrieve the ingredient list element
const linkToUserCooBook = document.getElementById("linkToUserCookBook"); // retrieve the link to options
let ingredientNb = 0; // set ingredient number to 0

// Update link to gu back to options with actual username
linkToUserCooBook.href = linkToUserCooBook.href.replace("USER", actualUserName);

// Set actual username as value to the username input element
userNameInput.value = actualUserName;

// Function to create an input element for ingredient
// Can either be quantity, unit or ingredient (name)
function createInputElement(type, number) {
  // create a new input element
  const newElement = document.createElement("input");
  // Set placeholder variable and required
  let placeHolder = "";
  let required = true;
  // If input is for quantity
  if (type === "quantity") {
    placeHolder = "Quantity";
    // Restrict input to digits by using a regular expression filter.
    setInputFilter(newElement, function(value) {
      return /^\d*$/.test(value);
    });
  // If input is for unit
  } else if (type === "unit") {
    placeHolder = "Unit";
    required = false;
  // If input is for ingredient
  } else if (type === "ingredient") {
    placeHolder = "Ingredient";
  }
  // create name with type and number of the ingredient
  const name = `${type}_${number.toString()}`;
  newElement.type = "text";
  newElement.name = name;
  newElement.id = name;
  newElement.placeholder = placeHolder;
  newElement.required = required;
  return newElement;
}

// Function that create a remove button for the user added ingredients
function createRemoveIngredientButton(number, parent) {
  // Create a new input element
  const removeButton = document.createElement("input");
  removeButton.type = "button";
  removeButton.value = "Remove";
  // add 2 classes
  removeButton.classList.add("button", "removeButton");
  removeButton.id = `removeIngredient_${number.toString()}`;
  // Upon click, remove ingredient and fix remianing ingredients numbering
  removeButton.addEventListener("click", function() {
    ingredientsInputList.removeChild(parent);
    fixIngredientNumbering(Number(this.id.split("_")[1])); // input acutal ingredient number
  });
  return removeButton;
}

// Function that fix ingredient numbering
function fixIngredientNumbering(startingNb) {
  // For each ingredient in ingredientsInputList
  for (let index = startingNb; index < ingredientsInputList.children.length; index++) {
    // Set ingredient
    const ingredient = ingredientsInputList.children[index];
    // Get ingredient old number and create new number
    const oldIngredientNb = Number(ingredient.id.split("_")[1]);
    const newIgredientNb = oldIngredientNb - 1;
    // Replace new ingredient id
    ingredient.id = `ingredient_${newIgredientNb.toString()}`;
    // For each input element from ingredient
    for (let index = 0; index < ingredient.children.length; index++) {
      // Set child
      const child = ingredient.children[index];
      // If input is from tyoe "text"
      if (child.type === "text") {
        // Get child name (quantity, unit or ingredient)
        const name = child.name.split("_")[0];
        // Create new name with new number
        const newName = `${name}_${newIgredientNb.toString()}`;
        // Update name and id
        child.name = newName;
        child.id = newName;
      // If input is from type "button"
      } else if (child.type === "button") {
        // Update id
        child.id = `removeIngredient_${newIgredientNb.toString()}`;
      }
    }
  }
  // Decrement ingredient number
  ingredientNb--;
}

// Upon click, add a new ingredient input
addIngredientButton.addEventListener("click", function() {
  // Increment ingredient number
  ingredientNb++;
  // create new ingredient
  const newIgredient = document.createElement("p");
  newIgredient.className = "ingredient";
  newIgredient.id = `ingredient_${ingredientNb.toString()}`;
  // create new quantity input
  const newQuantity = createInputElement("quantity", ingredientNb);
  newIgredient.appendChild(newQuantity);
  // create new unit input
  const newUnit = createInputElement("unit", ingredientNb);
  newIgredient.appendChild(newUnit);
  // create new ingredient name input
  const newIngredientName = createInputElement("ingredient", ingredientNb);
  newIgredient.appendChild(newIngredientName);
  // create new remove button
  const removeButton = createRemoveIngredientButton(ingredientNb, newIgredient);
  newIgredient.appendChild(removeButton);
  // add new ingredient to ingredient input list
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
// Set it for the first ingredient quantity
setInputFilter(ingredientsInputList.children[0].children[0], function(value) {
  return /^\d*$/.test(value);
});