import flask
import json
import jsonpickle # module to convert custom objects to json, vice versa
import os
app =  flask.Flask("cookbook")

#Classes

class Ingredient:
    def __init__(self, quantity, unit, ingredient):
        self.quantity = quantity
        self.unit = unit
        self.ingredient = ingredient

class Recipe:
    def __init__(self, title, ingredients, description):
        self.title = title
        self.ingredients = ingredients
        self.description = description

    # Metode to convert recipe to html
    def convert_to_html(self):
        # ingredients
        ingredients_html = ""
        for ingredient in self.ingredients:
            ingredients_html += '<li><span class="quantity_calculation">{}</span> {}: {}</li>\n      '.format(ingredient.quantity, ingredient.unit, ingredient.ingredient)
        return self.title, ingredients_html, self.description

class Database:
    def __init__(self, user):
        self.user = user
        self.name = os.path.join("databases", user + "_db.json")

    # Create an empty json
    def create(self):
        with open(self.name, 'w') as db:
            db.write("{}")
        return "Created"

    # Write recipe to database
    def write(self, recipe):
        recipe_json = jsonpickle.encode(recipe) # convert recipe object to json
        recipe_dict = json.loads(recipe_json) # convert recipe json to python dictionary
        # Load json database in a python dictionary
        with open(self.name) as db:
            db_dict = json.load(db)
        # If recipe is not in database, add it to dictionary and save new database in json
        if recipe.title not in db_dict.keys():
            db_dict[recipe.title] = recipe_dict
            with open(self.name, 'w') as db:
                json.dump(db_dict, db)
            return "Recipe added!"
        else:
            return "Recipe already present in CookBook!"

    # Delete recipe from database
    def delete(self, recipe_title):
        # Load json database in a python dictionary
        with open(self.name) as db:
            db_dict = json.load(db)
        # If recipe is in database, remove it from dictionary and save the new database in json
        if recipe_title in db_dict.keys():
            db_dict.pop(recipe_title)
            with open(self.name, 'w') as db:
                json.dump(db_dict, db)
            return "Recipe removed!"
        else:
            return "Recipe was not in CookBook!"

    # Read database content
    def read(self, recipe_title=None):
        # Load json database in a python dictionary
        with open(self.name) as db:
            db_dict = json.load(db)
        # If no title argument is given, return the a list of all recipes titles
        if recipe_title == None:
            return db_dict.keys()
        # Otherwise, if recipe is in the database, return the specific recipe object
        else:
            if recipe_title in db_dict.keys():
                return jsonpickle.decode(json.dumps(db_dict[recipe_title]))

    # Search database for a query and return a list of recipes titles containing the query
    def search(self, query):
        result = []
        for title in self.read():
            if query.upper() in title.upper():
                result.append(title)
        return result

    # Delete database, if file exists
    def clear(self):
        if os.path.exists(self.name):
            os.remove(self.name)

    # Check if database has some content or if it exists
    def check(self, what):
        if what == "content":
            with open(self.name) as db:
                if db.read() == "{}":
                    return "You're CookBook is empty."
                else:
                    return "You have some Recipes."
        elif what == "exists":
            if os.path.exists(self.name):
                return True
            else:
                return False

    

#Functions

# Get HTML templates content
def get_html(page):
    html_page = open(page + ".html")
    content = html_page.read()
    html_page.close()
    return content

# Retrieve username depending on the request method
def get_user(method):
    if method == 'GET':
        return flask.request.args.get("username")
    elif method == 'POST':
        return flask.request.form["username"]

# Convert recipes titles list in HTML format
# Each title are converted in a form element containing:
# An h3 title with the recipe title
# And 2 hidden input containing as values the recipe title and username, respectively. (note that the username and the form submission method will be added in the front end)
def recipe_titles_list_to_html(recipe_titles):
    titles_html = ""
    for title in recipe_titles:
        titles_html += '<form action="/recipe" method="get" class="title_form"><h3 class="recipe_title">{}</h3><input type="text" name="recipe_title" value="{}" hidden><input type="text" name="username" hidden></form>\n      '.format(title, title)
    return titles_html

# List the saved databases, extract the username from them and create a comma separated list of users
def list_users_saved():
    databases = os.listdir("databases")
    users = [db.replace("_db.json", "") for db in databases]
    return ",".join(users)

# Function returning the index page with error message in case of missing database
def missing_database_handler():
    html_page = get_html("index")
    message = "ERROR: CookBook was not found!"
    users = list_users_saved()
    return html_page.replace('$$$INFO$$$', message).replace('$$$USERS$$$', users)


# Routes

@app.route("/")
def login():
    html_page = get_html("index")
    users = list_users_saved()
    return html_page.replace('$$$INFO$$$', 'Nothing new!').replace('$$$USERS$$$', users)

@app.route("/options")
def options():
    html_page = get_html("options")
    # Set database
    user_db = Database(get_user(flask.request.method))
    # If database does not exist, create it
    if not user_db.check("exists"):
        user_db.create()
        message = "New CookBook created!"
    # Otherwise, check its content
    else:
        message = user_db.check("content")
    return html_page.replace('$$$INFO$$$', message)

@app.route("/add", methods=['GET', 'POST'])
def add():
    html_page = get_html("add")
    # If adding note (via post request method) run the following code
    if flask.request.method == 'POST':
        # Get form arguments
        form = flask.request.form
        # Set database
        user_db = Database(form['username'])
        # if database exists, run the following code
        if user_db.check("exists"):
            # Create ingredients list
            ingredients = []
            ingredients_nb = 0
            # Loop through form keys and count the nuber of ingredients
            for key in form.keys():
                if "ingredient" in key:
                    ingredients_nb += 1
            # For each ingredient, retrieve its quantity, unit and name
            # Create an ingredient object and append it to the ingredient list
            for index in range(ingredients_nb):
                quantity = form['quantity_{}'.format(index)]
                unit = form['unit_{}'.format(index)]
                ingredient_name = form['ingredient_{}'.format(index)]
                ingredient = Ingredient(quantity, unit, ingredient_name)
                ingredients.append(ingredient)
            # Get recipe title
            title = form['recipe_title']
            # Get recipe description
            description = form['recipe_description']
            # Create recipe object
            recipe = Recipe(title, ingredients, description)
            # Add recipe to db
            message = user_db.write(recipe)
        # If databes does not exist, run
        else:
            return missing_database_handler()
    # If not adding a note (accessing add page via get request method), display following message
    else:
        message = "Ready to add some new recipes!"
    return html_page.replace('$$$INFO$$$', message)

@app.route("/allrecipes")
def allrecipes():
    html_page = get_html("recipelist")
    # Set database
    user_db = Database(get_user(flask.request.method))
    # If database exists, list all recipes titles and convert them to HTML
    if user_db.check("exists"):
        recipe_titles_html = recipe_titles_list_to_html(user_db.read())
        if not recipe_titles_html:
            recipe_titles_html = 'CookBook is empty!'
        return html_page.replace('$$$RECIPESLIST$$$', recipe_titles_html)
    else:
        return missing_database_handler()


@app.route("/search")
def search():
    html_page = get_html("recipelist")
    # Set database
    user_db = Database(get_user(flask.request.method))
    # If database exists, search database for query and display recipes titles containing query
    if user_db.check('exists'):
        recipe_titles_html = recipe_titles_list_to_html(user_db.search(flask.request.args.get("query")))
        # If no hit found, display message
        if not recipe_titles_html:
            recipe_titles_html = "No hit found"
        return html_page.replace('$$$RECIPESLIST$$$', recipe_titles_html)
    else:
        return missing_database_handler()

@app.route("/recipe")
def recipe():
    html_page = get_html("recipe")
    # Set database
    user_db = Database(get_user(flask.request.method))
    # If database exists
    if user_db.check("exists"):
        # Retrieve recipe from database
        recipe = user_db.read(flask.request.args.get("recipe_title"))
        # If recipe does not exists
        if recipe == None:
            # Display recipe not found
            return html_page.replace('$$$RECIPETITLE$$$', 'Recipe not found').replace('$$$INGREDIENTS$$$', "NA").replace('$$$DESCRIPTION$$$', 'NA')
        # If recipe exists
        else:
            # Display recipe
            title_html, ingredients_html, description_html = recipe.convert_to_html()
            return html_page.replace('$$$RECIPETITLE$$$', title_html).replace('$$$INGREDIENTS$$$', ingredients_html).replace('$$$DESCRIPTION$$$', description_html)
    else:
        return missing_database_handler()

@app.route("/delete", methods=['POST'])
def delete():
    html_page = get_html("options")
    # Set database
    user_db = Database(get_user(flask.request.method))
    # If database exists, delete recipe from database
    if user_db.check("exists"):
        message = user_db.delete(flask.request.form["recipe_title"])
        return html_page.replace('$$$INFO$$$', message)
    else:
        return missing_database_handler()

@app.route("/clear")
def clear():
    html_page = get_html("index")
    # Set database
    user_db = Database(get_user(flask.request.method))
    # If database exists, delete database and go to index page
    if user_db.check("exists"):
        user_db.clear()
        users = list_users_saved()
        return html_page.replace('$$$INFO$$$', 'CookBook deleted!').replace('$$$USERS$$$', users)
    else:
        return missing_database_handler()

# Run app with
# FLASK_APP=cookbook.py flask run