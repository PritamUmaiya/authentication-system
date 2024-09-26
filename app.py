from cs50 import SQL
from dotenv import load_dotenv
from flask import Flask, redirect, render_template, request, session, jsonify
from flask_mail import Mail, Message
from flask_session import Session
import os
import random

from helpers import apology, login_required

# Configure application
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Flask-Mail configuration
load_dotenv()

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

mail = Mail(app)

otp = None

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
    users = db.execute("SELECT * FROM users WHERE id = ?", session['user_id'])

    if len(users) == 0:
        return redirect("/logout")

    return render_template("index.html", user=users[0])


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """Register user"""
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if not name or not email or not password or not confirm_password:
            return apology("All fields are required", 400)

        if password != confirm_password:
            return apology("Passwords do not match", 400)

        if db.execute("SELECT * FROM users WHERE email = ?", email):
            return apology("Email already exists", 400)
        
        db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", name, email, password)

        session.clear()

        users = db.execute("SELECT * FROM users WHERE email = ?", email)

        session["user_id"] = users[0]["id"]

        return redirect("/")

    return render_template("signup.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Login user"""
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        if not email or not password:
            return apology("All fields are required", 400)

        users = db.execute("SELECT * FROM users WHERE email = ?", email)

        if len(users) != 1 or not users[0]["password"] == password:
            return apology("Invalid email or password", 403)

        session.clear()

        session["user_id"] = users[0]["id"]

        return redirect("/")

    return render_template("login.html")


@app.route("/email_exists", methods=["POST"])
def email_exists():
    """Check if email exists"""
    data = request.get_json()
    email = data.get("email")

    if db.execute("SELECT * FROM users WHERE email = ?", email):
        return jsonify({"email_exists": True})

    return jsonify({"email_exists": False})


@app.route("/send_otp", methods=["POST"])
def send_otp():
    """Send OTP to email"""
    data = request.get_json()
    email = data.get("email")

    global otp
    otp = random.randint(100000, 999999)

    if app.config['MAIL_USERNAME'] and email:
        msg = Message('OTP Verification', sender=app.config['MAIL_USERNAME'], recipients=[email])
        msg.body = f'Your OTP is: {otp}'
        try:
            mail.send(msg)
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"success": False, "error": str(e)})
    else:
        return jsonify({"success": False, "error": "Invalid email or sender"})



@app.route("/verify_otp", methods=["POST"])
def verify_otp():
    """Verify OTP"""
    data  = request.get_json()
    entered_otp = data.get("otp")

    print(otp, entered_otp)

    if otp and int(entered_otp) == otp:
        return jsonify({"success": True})

    return jsonify({"success": False})


@app.route("/logout")
def logout():
    """Logout User"""
    session.clear()
    return redirect("/login")


@app.route("/delete_account")
@login_required
def delete_account():
    """Delete User Account"""
    db.execute("DELETE FROM users WHERE id = ?", session['user_id'])
    return redirect("/login")


if __name__ == "__main__":
    app.run(debug=True)