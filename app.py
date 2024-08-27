from cs50 import SQL
from flask import Flask, redirect, render_template, session
from flask_session import Session

from helpers import apology, login_required

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///users.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Index Page"""
    users = db.exeucte("SELECT * FROM users WHERE id = ?", session['user_id'])

    if len(users) == 0:
        return redirect("/logout")

    return render_template("index.html", user=users[0])


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """Register user"""
    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Login user"""
    return render_template("login.html")


@app.route("/logout")
def logout():
    """Logout User"""
    session.clear()
    return redirect("/login")


if __name__ == "__main__":
    app.run(debug=True)