import flask
import json
import jsonpickle
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

    def convert_to_html(self):
        # ingredients
        ingredients_html = ""
        for ingredient in self.ingredients:
            ingredients_html += '<li><span class="quantity">{}</span> {}: {}</li>\n      '.format(ingredient.quantity, ingredient.unit, ingredient.ingredient)
        return self.title, ingredients_html, self.description

class Database:
    def __init__(self, user):
        self.user = user
        self.name = os.path.join("databases", user + "_db.json")

    def create(self):
        with open(self.name, 'w') as db:
            db.write("{}")
        return "Created"

    def write(self, recipe):
        recipe_json = jsonpickle.encode(recipe)
        recipe_dict = json.loads(recipe_json)
        with open(self.name) as db:
            db_dict = json.load(db)
        if recipe.title not in db_dict.keys():
            db_dict[recipe.title] = recipe_dict
            with open(self.name, 'w') as db:
                json.dump(db_dict, db)
            return "Recipe added!"
        else:
            return "Recipe already present in CookBook!"

    def delete(self, recipe_title):
        with open(self.name) as db:
            db_dict = json.load(db)
        if recipe_title in db_dict.keys():
            db_dict.pop(recipe_title)
            with open(self.name, 'w') as db:
                json.dump(db_dict, db)
            message = "Recipe removed!"
        else:
            message = "Recipe was not in CookBook!"
        return message

    def read(self, recipe_title=None):
        with open(self.name) as db:
            db_dict = json.load(db)
        if recipe_title == None:
            return db_dict.keys()
        else:
            if recipe_title in db_dict.keys():
                return jsonpickle.decode(json.dumps(db_dict[recipe_title]))

    def search(self, query):
        result = []
        for title in self.read():
            if query.upper() in title.upper():
                result.append(title)
        return result

    def clear(self):
        if os.path.exists(self.name):
            os.remove(self.name)

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

def get_html(page):
    html_page = open(page + ".html")
    content = html_page.read()
    html_page.close()
    return content

def get_user(method):
    if method == 'GET':
        return flask.request.args.get("username")
    elif method == 'POST':
        return flask.request.form["username"]

def recipe_titles_list_to_html(recipe_titles):
    titles_html = ""
    for title in recipe_titles:
        titles_html += '<form action="/recipe" method="get" class="title_form"><h3 class="recipe_title">{}</h3><input type="text" name="recipe_title" value="{}" hidden></form>\n      '.format(title, title)
    return titles_html

def list_users_saved():
    databases = os.listdir("databases")
    users = [db.replace("_db.json", "") for db in databases]
    return ",".join(users)

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
    return html_page.replace('$$$INFO$$$', '').replace('$$$USERS$$$', users)

@app.route("/options")
def options():
    html_page = get_html("options")
    user_db = Database(get_user(flask.request.method))
    if not user_db.check("exists"):
        user_db.create()
        message = "New CookBook created!"
    else:
        message = user_db.check("content")
    return html_page.replace('$$$INFO$$$', message)

@app.route("/add", methods=['GET', 'POST'])
def add():
    html_page = get_html("add")
    # If adding note run code
    if flask.request.method == 'POST':
        # Get form arguments
        form = flask.request.form
        # Set database
        user_db = Database(form['username'])
        if user_db.check("exists"):
            # Create ingredients list
            ingredients = []
            ingredients_nb = 0
            for key in form.keys():
                if "ingredient" in key:
                    ingredients_nb += 1
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
            # Create recipe
            recipe = Recipe(title, ingredients, description)
            # Add recipe to db
            message = user_db.write(recipe)
        else:
            return missing_database_handler()
    else:
        message = "Ready to add some new recipes!"
    return html_page.replace('$$$INFO$$$', message)

# @app.route("/allrecipes", methods=['POST'])
@app.route("/allrecipes")
def allrecipes():
    html_page = get_html("recipelist")
    user_db = Database(get_user(flask.request.method))
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
    user_db = Database(get_user(flask.request.method))
    if user_db.check('exists'):
        recipe_titles_html = recipe_titles_list_to_html(user_db.search(flask.request.args.get("query")))
        if not recipe_titles_html:
            recipe_titles_html = "No hit found"
        return html_page.replace('$$$RECIPESLIST$$$', recipe_titles_html)
    else:
        return missing_database_handler()

@app.route("/recipe")
def recipe():
    html_page = get_html("recipe")
    user_db = Database(get_user(flask.request.method))
    if user_db.check("exists"):
        recipe = user_db.read(flask.request.args.get("recipe_title"))
        if recipe == None:
            return html_page.replace('$$$RECIPETITLE$$$', 'Recipe not found').replace('$$$INGREDIENTS$$$', "NA").replace('$$$DESCRIPTION$$$', 'NA')
        else:
            title_html, ingredients_html, description_html = recipe.convert_to_html()
            return html_page.replace('$$$RECIPETITLE$$$', title_html).replace('$$$INGREDIENTS$$$', ingredients_html).replace('$$$DESCRIPTION$$$', description_html)
    else:
        return missing_database_handler()

#@app.route("/delete", methods=['POST'])
@app.route("/delete")
def delete():
    html_page = get_html("options")
    user_db = Database(get_user(flask.request.method))
    if user_db.check("exists"):
        #message = user_db.delete(flask.request.form["recipe_title"])
        message = user_db.delete(flask.request.args.get("recipe_title"))
        return html_page.replace('$$$INFO$$$', message)
    else:
        return missing_database_handler()

#@app.route("/clear", methods=['POST'])
@app.route("/clear")
def clear():
    html_page = get_html("index")
    user_db = Database(get_user(flask.request.method))
    if user_db.check("exists"):
        user_db.clear()
        return html_page.replace('$$$INFO$$$', 'CookBook deleted!')
    else:
        return missing_database_handler()
